require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 5000;

const JWT_SECRET =
  process.env.JWT_SECRET || 'global-talents-secret-2025';

// ============================
// MIDDLEWARE
// ============================
app.use(cors());

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

// ============================
// DATABASE CONNECTION
// ============================
// ============================
// DATABASE CONNECTION
// ============================

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('✅ MongoDB Connected');
})
.catch((err) => {
  console.log('❌ MongoDB Error:', err.message);
});

// ============================
// SCHEMAS
// ============================

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    default: 'candidate'
  },

  skills: [String],

  trustScore: {
    type: Number,
    default: 70
  }
});

const jobSchema = new mongoose.Schema({
  title: String,
  company: String,
  skills: [String],
  salary: String,
  postedBy: String
});

const courseSchema = new mongoose.Schema({
  title: String,
  skills: [String],
  rating: Number
});

const applicationSchema = new mongoose.Schema({
  userId: String,
  jobId: String,

  date: {
    type: Date,
    default: Date.now
  }
});

const enrollmentSchema = new mongoose.Schema({
  userId: String,
  courseId: String,

  date: {
    type: Date,
    default: Date.now
  }
});

const eventSchema = new mongoose.Schema({
  title: String,
  date: String,
  description: String
});

// ============================
// MODELS
// ============================

const User = mongoose.model('User', userSchema);

const Job = mongoose.model('Job', jobSchema);

const Course = mongoose.model('Course', courseSchema);

const Application = mongoose.model(
  'Application',
  applicationSchema
);

const Enrollment = mongoose.model(
  'Enrollment',
  enrollmentSchema
);

const Event = mongoose.model('Event', eventSchema);

// ============================
// AUTH MIDDLEWARE
// ============================

function authenticateToken(req, res, next) {

  const authHeader = req.headers.authorization;

  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: 'Access denied'
    });
  }

  try {

    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    next();

  } catch (err) {

    return res.status(403).json({
      error: 'Invalid token'
    });
  }
}

// ============================
// MATCHING ENGINE
// ============================

function calculateMatchScore(userSkills, requiredSkills) {

  if (!userSkills || !requiredSkills) {
    return 0;
  }

  const userSet = new Set(
    userSkills.map(skill => skill.toLowerCase())
  );

  const matched = requiredSkills.filter(skill =>
    userSet.has(skill.toLowerCase())
  ).length;

  const baseScore = Math.round(
    (matched / requiredSkills.length) * 100
  );

  const bonus =
    matched > 0
      ? Math.floor(Math.random() * 10)
      : 0;

  return Math.min(99, baseScore + bonus);
}

// ============================
// REGISTER
// ============================

app.post('/api/auth/register', async (req, res) => {

  try {

    const {
      name,
      email,
      password,
      role,
      skills
    } = req.body;

    // Check existing user
    const existingUser = await User.findOne({
      email
    });

    if (existingUser) {
      return res.status(400).json({
        error: 'Email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      skills: skills || []
    });

    // Create token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      JWT_SECRET,
      {
        expiresIn: '24h'
      }
    );

    // Remove password
    const safeUser = user.toObject();

    delete safeUser.password;

    res.json({
      success: true,
      message: 'Registration successful',
      token,
      user: safeUser
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });
  }
});

// ============================
// LOGIN / SIGN IN
// ============================

app.post('/api/auth/login', async (req, res) => {

  try {

    const { email, password } = req.body;

    // Validate fields
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password required'
      });
    }

    // Find user
    const user = await User.findOne({
      email: email.trim()
    });

    // User not found
    if (!user) {
      return res.status(401).json({
        error: 'User not found'
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    // Wrong password
    if (!isMatch) {
      return res.status(401).json({
        error: 'Incorrect password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      JWT_SECRET,
      {
        expiresIn: '24h'
      }
    );

    // Remove password
    const safeUser = user.toObject();

    delete safeUser.password;

    // Send response
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: safeUser
    });

  } catch (err) {

    console.log('LOGIN ERROR:', err);

    res.status(500).json({
      error: 'Server error'
    });
  }
});

// ============================
// CHATBOT
// ============================

app.post(
  '/api/chatbot',
  authenticateToken,
  async (req, res) => {

    const { message } = req.body;

    const msg = message.toLowerCase();

    let response =
      "I didn't understand that.";

    if (msg.includes('job')) {

      const jobs = await Job.find();

      response = `We have ${jobs.length} jobs available.`;

    } else if (msg.includes('course')) {

      const courses = await Course.find();

      response = `We have ${courses.length} courses available.`;

    } else if (msg.includes('hello')) {

      response =
        'Hello 👋 I am your AI assistant!';
    }

    res.json({ response });
  }
);

// ============================
// JOBS
// ============================

app.get(
  '/api/jobs',
  authenticateToken,
  async (req, res) => {

    const user = await User.findById(
      req.user.id
    );

    const jobs = await Job.find();

    const result = jobs.map(job => ({
      ...job._doc,

      matchScore: calculateMatchScore(
        user.skills,
        job.skills
      )
    }));

    res.json(result);
  }
);

// ============================
// CREATE JOB
// ============================

app.post(
  '/api/jobs',
  authenticateToken,
  async (req, res) => {

    if (req.user.role !== 'corporate') {
      return res.status(403).json({
        error:
          'Only corporates can post jobs'
      });
    }

    const job = await Job.create({
      ...req.body,
      postedBy: req.user.id
    });

    res.json(job);
  }
);

// ============================
// APPLY JOB
// ============================

app.post(
  '/api/jobs/apply/:id',
  authenticateToken,
  async (req, res) => {

    const exists =
      await Application.findOne({
        userId: req.user.id,
        jobId: req.params.id
      });

    if (exists) {
      return res.status(400).json({
        error: 'Already applied'
      });
    }

    await Application.create({
      userId: req.user.id,
      jobId: req.params.id
    });

    res.json({
      message: 'Applied successfully'
    });
  }
);

// ============================
// COURSES
// ============================

app.get(
  '/api/courses',
  authenticateToken,
  async (req, res) => {

    const user = await User.findById(
      req.user.id
    );

    const courses = await Course.find();

    const result = courses.map(course => ({
      ...course._doc,

      matchScore: calculateMatchScore(
        user.skills,
        course.skills
      )
    }));

    res.json(result);
  }
);

// ============================
// EVENTS
// ============================

app.get('/api/events', async (req, res) => {

  const events = await Event.find();

  res.json(events);
});

// ============================
// DASHBOARD
// ============================

app.get(
  '/api/dashboard',
  authenticateToken,
  async (req, res) => {

    const applications =
      await Application.find({
        userId: req.user.id
      });

    const enrollments =
      await Enrollment.find({
        userId: req.user.id
      });

    res.json({
      stats: {
        jobsApplied:
          applications.length,

        coursesEnrolled:
          enrollments.length
      }
    });
  }
);

// ============================
// DEBUG USERS ROUTE
// ============================

app.get('/api/users', async (req, res) => {

  const users = await User.find();

  res.json(users);
});

// ============================
// HEALTH CHECK
// ============================

app.get('/api/health', (req, res) => {

  res.json({
    status: 'OK'
  });
});

// ============================
// START SERVER
// ============================

app.listen(PORT, () => {

  console.log(
    `🚀 Server running on http://localhost:${PORT}`
  );
});
