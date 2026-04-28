require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'global-talents-secret-2025';

// ============================
// MIDDLEWARE
// ============================
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ============================
// DB CONNECTION
// ============================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ DB Error:', err));

// ============================
// SCHEMAS
// ============================
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  skills: [String],
  trustScore: { type: Number, default: 70 }
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
  date: { type: Date, default: Date.now }
});

const enrollmentSchema = new mongoose.Schema({
  userId: String,
  courseId: String,
  date: { type: Date, default: Date.now }
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
const Application = mongoose.model('Application', applicationSchema);
const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
const Event = mongoose.model('Event', eventSchema);

// ============================
// AUTH MIDDLEWARE
// ============================
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(403).json({ error: 'Invalid token' });
  }
}

// ============================
// MATCHING ENGINE
// ============================
function calculateMatchScore(userSkills, requiredSkills) {
  if (!userSkills || !requiredSkills) return 0;
  const userSet = new Set(userSkills.map(s => s.toLowerCase()));
  const matched = requiredSkills.filter(s => userSet.has(s.toLowerCase())).length;
  const baseScore = Math.round((matched / requiredSkills.length) * 100);
  const bonus = matched > 0 ? Math.floor(Math.random() * 10) : 0;
  return Math.min(99, baseScore + bonus);
}

// ============================
// REGISTER
// ============================
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role, skills } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      skills: skills || []
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const safeUser = user.toObject();
    delete safeUser.password;

    res.json({ token, user: safeUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================
// CHATBOT (FIXED - IMPORTANT)
// ============================
app.post('/api/chatbot', authenticateToken, async (req, res) => {
  const { message } = req.body;
  const msg = message.toLowerCase();

  let response = "I didn't understand that.";

  if (msg.includes('job')) {
    const jobs = await Job.find();
    response = `We have ${jobs.length} jobs available.`;
  } else if (msg.includes('course')) {
    const courses = await Course.find();
    response = `We have ${courses.length} courses available.`;
  } else if (msg.includes('hello')) {
    response = "Hello 👋 I am your AI assistant!";
  }

  res.json({ response });
});

// ============================
// JOBS
// ============================
app.get('/api/jobs', authenticateToken, async (req, res) => {
  const user = await User.findById(req.user.id);
  const jobs = await Job.find();

  const result = jobs.map(job => ({
    ...job._doc,
    matchScore: calculateMatchScore(user.skills, job.skills)
  }));

  res.json(result);
});

app.post('/api/jobs', authenticateToken, async (req, res) => {
  if (req.user.role !== 'corporate')
    return res.status(403).json({ error: 'Only corporates can post jobs' });

  const job = await Job.create({ ...req.body, postedBy: req.user.id });
  res.json(job);
});

// ============================
// APPLY JOB
// ============================
app.post('/api/jobs/apply/:id', authenticateToken, async (req, res) => {
  const exists = await Application.findOne({
    userId: req.user.id,
    jobId: req.params.id
  });

  if (exists)
    return res.status(400).json({ error: 'Already applied' });

  await Application.create({
    userId: req.user.id,
    jobId: req.params.id
  });

  res.json({ message: 'Applied successfully' });
});

// ============================
// COURSES
// ============================
app.get('/api/courses', authenticateToken, async (req, res) => {
  const user = await User.findById(req.user.id);
  const courses = await Course.find();

  const result = courses.map(c => ({
    ...c._doc,
    matchScore: calculateMatchScore(user.skills, c.skills)
  }));

  res.json(result);
});

// ============================
// EVENTS
// ============================
app.get('/api/events', async (req, res) => {
  res.json(await Event.find());
});

// ============================
// DASHBOARD
// ============================
app.get('/api/dashboard', authenticateToken, async (req, res) => {
  const applications = await Application.find({ userId: req.user.id });
  const enrollments = await Enrollment.find({ userId: req.user.id });

  res.json({
    stats: {
      jobsApplied: applications.length,
      coursesEnrolled: enrollments.length
    }
  });
});

// ============================
// HEALTH CHECK
// ============================
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// ============================
// START SERVER
// ============================
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});