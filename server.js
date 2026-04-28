const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'global-talents-secret-2025';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ============================
// IN-MEMORY DATABASE
// ============================
const db = {
  users: [
    { id: 1, name: 'Priya Sharma', email: 'priya@email.com', password: bcrypt.hashSync('pass123', 8), role: 'candidate', skills: ['React', 'Node.js', 'Python', 'Machine Learning'], experience: 2, trustScore: 87, verified: true, location: 'Mumbai' },
    { id: 2, name: 'TechCorp India', email: 'hr@techcorp.com', password: bcrypt.hashSync('pass123', 8), role: 'corporate', industry: 'Technology', trustScore: 95, verified: true, location: 'Bangalore' },
    { id: 3, name: 'Dr. Meera Joshi', email: 'meera@edu.com', password: bcrypt.hashSync('pass123', 8), role: 'educator', specialization: 'AI/ML', trustScore: 92, verified: true, location: 'Pune' },
    { id: 4, name: 'Alex Consultant', email: 'alex@consult.com', password: bcrypt.hashSync('pass123', 8), role: 'consultant', specialization: 'HR Tech', trustScore: 88, verified: true, location: 'Delhi' },
  ],
  jobs: [
    { id: 1, title: 'Full Stack Developer', company: 'TechCorp India', location: 'Bangalore (Remote)', skills: ['React', 'Node.js', 'MongoDB'], salary: '₹8-12 LPA', type: 'Full-time', postedBy: 2, applicants: 24, matchScore: 0 },
    { id: 2, title: 'AI/ML Engineer', company: 'DataMinds', location: 'Hyderabad', skills: ['Python', 'Machine Learning', 'TensorFlow'], salary: '₹10-16 LPA', type: 'Full-time', postedBy: 2, applicants: 18, matchScore: 0 },
    { id: 3, title: 'React Frontend Developer', company: 'StartupX', location: 'Remote', skills: ['React', 'Tailwind CSS', 'JavaScript'], salary: '₹6-10 LPA', type: 'Full-time', postedBy: 2, applicants: 31, matchScore: 0 },
    { id: 4, title: 'Data Scientist', company: 'AnalyticsHub', location: 'Mumbai', skills: ['Python', 'Machine Learning', 'SQL', 'Data Analysis'], salary: '₹9-15 LPA', type: 'Full-time', postedBy: 2, applicants: 12, matchScore: 0 },
    { id: 5, title: 'Backend Engineer (Node.js)', company: 'CloudSoft', location: 'Pune (Hybrid)', skills: ['Node.js', 'Express', 'PostgreSQL'], salary: '₹7-11 LPA', type: 'Full-time', postedBy: 2, applicants: 9, matchScore: 0 },
    { id: 6, title: 'DevOps Engineer', company: 'InfraScale', location: 'Remote', skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'], salary: '₹11-18 LPA', type: 'Full-time', postedBy: 2, applicants: 7, matchScore: 0 },
    { id: 7, title: 'Product Manager - EdTech', company: 'LearnPath', location: 'Delhi', skills: ['Product Management', 'Agile', 'User Research'], salary: '₹12-20 LPA', type: 'Full-time', postedBy: 2, applicants: 15, matchScore: 0 },
    { id: 8, title: 'Freelance ML Consultant', company: 'Various Clients', location: 'Remote', skills: ['Python', 'Machine Learning', 'NLP'], salary: '₹5K-15K/day', type: 'Freelance', postedBy: 2, applicants: 6, matchScore: 0 },
  ],
  courses: [
    { id: 1, title: 'Full Stack Web Development Bootcamp', instructor: 'Dr. Meera Joshi', duration: '12 weeks', level: 'Intermediate', skills: ['React', 'Node.js', 'MongoDB', 'CSS'], rating: 4.8, enrolled: 1240, price: '₹4,999', category: 'Development' },
    { id: 2, title: 'Machine Learning A-Z with Python', instructor: 'Prof. Raj Kumar', duration: '10 weeks', level: 'Beginner', skills: ['Python', 'Machine Learning', 'Data Analysis'], rating: 4.9, enrolled: 2180, price: '₹3,999', category: 'AI/ML' },
    { id: 3, title: 'Advanced React & Redux Masterclass', instructor: 'Ananya Singh', duration: '6 weeks', level: 'Advanced', skills: ['React', 'Redux', 'TypeScript'], rating: 4.7, enrolled: 890, price: '₹2,999', category: 'Development' },
    { id: 4, title: 'Cloud Computing & DevOps (AWS)', instructor: 'Vikram Nair', duration: '8 weeks', level: 'Intermediate', skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'], rating: 4.6, enrolled: 670, price: '₹5,999', category: 'DevOps' },
    { id: 5, title: 'Product Management for Tech Leaders', instructor: 'Dr. Shalini Reddy', duration: '4 weeks', level: 'Intermediate', skills: ['Product Management', 'Agile', 'User Research'], rating: 4.8, enrolled: 456, price: '₹6,999', category: 'Management' },
    { id: 6, title: 'NLP & Deep Learning with TensorFlow', instructor: 'Dr. Meera Joshi', duration: '8 weeks', level: 'Advanced', skills: ['Python', 'NLP', 'TensorFlow', 'Machine Learning'], rating: 4.9, enrolled: 320, price: '₹7,499', category: 'AI/ML' },
  ],
  events: [
    { id: 1, title: 'Global Tech Talent Summit 2025', date: '2025-08-15', location: 'Mumbai + Virtual', type: 'Conference', organizer: 'Global Talents', attendees: 2500, description: 'Annual summit bringing together tech professionals, corporates, and educators from 50+ countries.', tags: ['Networking', 'Hiring', 'Tech'] },
    { id: 2, title: 'AI/ML Hackathon - Innovation Challenge', date: '2025-07-20', location: 'Virtual', type: 'Hackathon', organizer: 'DataMinds x Global Talents', attendees: 800, description: '48-hour hackathon focused on building AI solutions for real-world problems. Prizes worth ₹5 Lakhs.', tags: ['AI', 'Hackathon', 'Prize'] },
    { id: 3, title: 'Campus Hiring Fair - Engineering Colleges', date: '2025-07-10', location: 'Pune', type: 'Hiring Fair', organizer: 'MIT ADT University', attendees: 1200, description: 'On-campus hiring drive connecting 200+ companies with fresh engineering graduates.', tags: ['Hiring', 'Campus', 'Freshers'] },
    { id: 4, title: 'Freelancing & Gig Economy Webinar', date: '2025-07-05', location: 'Online', type: 'Webinar', organizer: 'ConsultPro', attendees: 350, description: 'Learn how to build a successful freelancing career in tech. Expert panel discussion.', tags: ['Freelance', 'Career', 'Webinar'] },
    { id: 5, title: 'India-Germany Talent Exchange Program', date: '2025-09-01', location: 'Berlin + Bangalore', type: 'Exchange Program', organizer: 'Global Talents + DAAD', attendees: 150, description: 'International talent exchange connecting Indian tech professionals with German companies.', tags: ['International', 'Exchange', 'Europe'] },
  ],
  applications: [],
  enrollments: [],
  nextUserId: 5
};

// ============================
// MIDDLEWARE
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
// AI MATCHING ENGINE
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
// AUTH ROUTES
// ============================
app.post('/api/auth/register', async (req, res) => {

  console.log('\n=================================');
  console.log('📩 STEP 1: NEW REGISTRATION REQUEST RECEIVED');
  console.log('📦 STEP 2: Data sent from frontend:');
  console.log(req.body);
  console.log('=================================');

  const { name, email, password, role, skills, experience, industry, specialization, location } = req.body;
  
  if (db.users.find(u => u.email === email)) {
    console.log('❌ ERROR: Email already exists:', email);
    return res.status(400).json({ error: 'Email already registered' });
  }

  console.log('✅ STEP 3: Email is unique, proceeding...');

  const hashedPassword = bcrypt.hashSync(password, 8);
  console.log('🔐 STEP 4: Password hashed! Original:', password, '→ Hashed:', hashedPassword.slice(0, 20) + '...');

  const user = {
    id: db.nextUserId++,
    name, email, password: hashedPassword, role,
    skills: skills || [],
    experience: experience || 0,
    industry: industry || '',
    specialization: specialization || '',
    location: location || '',
    trustScore: Math.floor(Math.random() * 20) + 60,
    verified: false,
    joinedDate: new Date().toISOString()
  };

  db.users.push(user);
  console.log('💾 STEP 5: User saved to database!');
  console.log('👤 New User Created:', { id: user.id, name: user.name, role: user.role, trustScore: user.trustScore });
  console.log('📊 Total users in database now:', db.users.length);

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
  console.log('🎫 STEP 6: JWT Token generated:', token.slice(0, 30) + '...');

  const { password: _, ...safeUser } = user;

  console.log('📤 STEP 7: Sending response back to frontend...');
  console.log('📦 Response contains: token + user data + success message');
  console.log('=================================\n');

  res.json({ token, user: safeUser, message: 'Registration successful!' });
});

// ============================
// JOBS ROUTES
// ============================
app.get('/api/jobs', (req, res) => {
  const user = db.users.find(u => u.id === req.user.id);
  const jobs = db.jobs.map(job => ({
    ...job,
    matchScore: user?.skills ? calculateMatchScore(user.skills, job.skills) : 0,
    applied: db.applications.some(a => a.userId === req.user.id && a.jobId === job.id)
  }));
  jobs.sort((a, b) => b.matchScore - a.matchScore);
  res.json(jobs);
});

app.post('/api/jobs/apply/:jobId', authenticateToken, (req, res) => {
  const jobId = parseInt(req.params.jobId);
  if (db.applications.find(a => a.userId === req.user.id && a.jobId === jobId)) {
    return res.status(400).json({ error: 'Already applied' });
  }
  db.applications.push({ userId: req.user.id, jobId, date: new Date().toISOString(), status: 'Applied' });
  res.json({ message: 'Application submitted successfully!' });
});

app.post('/api/jobs', authenticateToken, (req, res) => {
  if (req.user.role !== 'corporate') return res.status(403).json({ error: 'Only corporates can post jobs' });
  const job = { id: db.jobs.length + 1, ...req.body, postedBy: req.user.id, applicants: 0 };
  db.jobs.push(job);
  res.json({ message: 'Job posted successfully!', job });
});

// ============================
// COURSES ROUTES
// ============================
app.get('/api/courses', (req, res) => {
  const user = db.users.find(u => u.id === req.user.id);
  const courses = db.courses.map(course => ({
    ...course,
    matchScore: user?.skills ? calculateMatchScore(user.skills, course.skills) : 50,
    enrolled: db.enrollments.some(e => e.userId === req.user.id && e.courseId === course.id)
  }));
  courses.sort((a, b) => b.matchScore - a.matchScore);
  res.json(courses);
});

app.post('/api/courses/enroll/:courseId', authenticateToken, (req, res) => {
  const courseId = parseInt(req.params.courseId);
  if (db.enrollments.find(e => e.userId === req.user.id && e.courseId === courseId)) {
    return res.status(400).json({ error: 'Already enrolled' });
  }
  db.enrollments.push({ userId: req.user.id, courseId, date: new Date().toISOString(), progress: 0 });
  res.json({ message: 'Enrolled successfully!' });
});

// ============================
// EVENTS ROUTES
// ============================
app.get('/api/events', (req, res) => {
  res.json(db.events);
});

// ============================
// AI MATCHING ENGINE ROUTE
// ============================
app.get('/api/ai/matches', authenticateToken, (req, res) => {
  const user = db.users.find(u => u.id === req.user.id);
  const jobMatches = db.jobs
    .map(job => ({ ...job, matchScore: calculateMatchScore(user?.skills || [], job.skills) }))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3);

  const courseMatches = db.courses
    .map(course => ({ ...course, matchScore: calculateMatchScore(user?.skills || [], course.skills) }))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3);

  // Skill Gap Analysis
  const allRequiredSkills = [...new Set(db.jobs.flatMap(j => j.skills))];
  const userSkillSet = new Set((user?.skills || []).map(s => s.toLowerCase()));
  const skillGaps = allRequiredSkills
    .filter(skill => !userSkillSet.has(skill.toLowerCase()))
    .slice(0, 5);

  res.json({ jobMatches, courseMatches, skillGaps, trustScore: user?.trustScore || 70 });
});

// ============================
// CHATBOT ROUTE
// ============================
app.post('/api/chatbot', authenticateToken, (req, res) => {
  const { message } = req.body;
  const msg = message.toLowerCase();

  let response = '';
  if (msg.includes('job') || msg.includes('work') || msg.includes('career')) {
    const topJob = db.jobs[0];
    response = `Great question! 🎯 Based on your profile, I found ${db.jobs.length} job opportunities. The top match for you is "${topJob.title}" at ${topJob.company} with ${topJob.salary}. Go to the Jobs section to apply! Would you like tips on improving your profile for better matches?`;
  } else if (msg.includes('course') || msg.includes('learn') || msg.includes('skill')) {
    response = `📚 We have ${db.courses.length} courses tailored to your skill gaps! I recommend starting with "Machine Learning A-Z with Python" — it has a 4.9 rating and 2180+ students. Your current skill gap analysis shows you could boost your profile by learning cloud computing. Want me to show personalized recommendations?`;
  } else if (msg.includes('event') || msg.includes('hackathon') || msg.includes('summit')) {
    response = `🌟 Exciting news! We have ${db.events.length} upcoming events. The Global Tech Talent Summit 2025 on Aug 15 is the biggest event of the year with 2500+ attendees. The AI/ML Hackathon on July 20 has ₹5 Lakh prizes! Want to register for any event?`;
  } else if (msg.includes('trust') || msg.includes('score') || msg.includes('verify')) {
    response = `🛡️ Your Trust Score is a key metric on Global Talents. You can improve it by: (1) Completing profile verification with KYC, (2) Getting rated by employers/clients, (3) Adding verified certifications, (4) Being active on the platform. A higher trust score means more visibility to top companies!`;
  } else if (msg.includes('register') || msg.includes('signup') || msg.includes('account')) {
    response = `👋 Welcome! Registration on Global Talents is simple. We support 5 roles: Candidate, Corporate, Educator, Consultant, and Government. Each gets a personalized dashboard. It's free to join! Shall I walk you through the process?`;
  } else if (msg.includes('ai') || msg.includes('match') || msg.includes('recommend')) {
    response = `🤖 Our AI Matching Engine analyzes your skills, experience, and preferences to recommend the most relevant jobs and courses. It performs real-time skill gap analysis too! The more complete your profile, the better the matches. Currently matching from ${db.jobs.length} jobs and ${db.courses.length} courses!`;
  } else if (msg.includes('freelanc') || msg.includes('project') || msg.includes('gig')) {
    response = `💼 Global Talents supports freelancing! You can find project-based and part-time gigs alongside full-time roles. Check the Jobs section and filter by "Freelance" type. We currently have freelance ML consultant roles available. Want help setting up your freelancer profile?`;
  } else if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
    response = `👋 Hello! Welcome to Global Talents — your AI-powered career companion! I can help you with: finding jobs, discovering courses, registering for events, understanding your trust score, and much more. What would you like to explore today?`;
  } else if (msg.includes('salary') || msg.includes('pay') || msg.includes('package')) {
    response = `💰 Salary insights! Based on our platform data: Full Stack Developers earn ₹8-12 LPA, AI/ML Engineers ₹10-16 LPA, and DevOps Engineers ₹11-18 LPA. Senior roles can go much higher! Tip: Candidates with verified skills and high trust scores often get 15-20% better offers. Shall I show you the highest-paying jobs?`;
  } else {
    response = `I'm your Global Talents AI assistant! 🤖 I can help you with:
• 🔍 Finding matched job opportunities  
• 📚 Course recommendations & skill gaps
• 🌟 Upcoming events & hackathons
• 🛡️ Building your trust score
• 💼 Freelancing opportunities

What would you like to explore?`;
  }

  res.json({ response, timestamp: new Date().toISOString() });
});

// ============================
// DASHBOARD / ANALYTICS
// ============================
app.get('/api/dashboard', authenticateToken, (req, res) => {
  const user = db.users.find(u => u.id === req.user.id);
  const userApplications = db.applications.filter(a => a.userId === req.user.id);
  const userEnrollments = db.enrollments.filter(e => e.userId === req.user.id);

  if (user.role === 'candidate') {
    const topJobMatch = db.jobs
      .map(j => ({ ...j, score: calculateMatchScore(user.skills, j.skills) }))
      .sort((a, b) => b.score - a.score)[0];

    res.json({
      stats: {
        jobsApplied: userApplications.length,
        coursesEnrolled: userEnrollments.length,
        profileViews: Math.floor(Math.random() * 50) + 10,
        trustScore: user.trustScore,
        topMatchScore: topJobMatch?.score || 0,
        topMatchJob: topJobMatch?.title || 'N/A'
      },
      recentApplications: userApplications.slice(-3).map(a => ({
        ...a, job: db.jobs.find(j => j.id === a.jobId)
      })),
      skillGapCount: 5
    });
  } else if (user.role === 'corporate') {
    const myJobs = db.jobs.filter(j => j.postedBy === req.user.id);
    res.json({
      stats: {
        jobsPosted: myJobs.length,
        totalApplicants: myJobs.reduce((s, j) => s + j.applicants, 0),
        activeListings: myJobs.length,
        trustScore: user.trustScore
      },
      myJobs
    });
  } else {
    res.json({
      stats: {
        trustScore: user.trustScore,
        profileViews: Math.floor(Math.random() * 100) + 20,
        connections: Math.floor(Math.random() * 50) + 10
      }
    });
  }
});

// ============================
// USERS / TALENT POOL
// ============================
app.get('/api/talent', authenticateToken, (req, res) => {
  if (req.user.role !== 'corporate') return res.status(403).json({ error: 'Corporate access only' });
  const candidates = db.users
    .filter(u => u.role === 'candidate')
    .map(({ password, ...u }) => u);
  res.json(candidates);
});

// ============================
// HEALTH CHECK
// ============================
app.get('/api/health', (req, res) => res.json({ status: 'OK', platform: 'Global Talents', version: '1.0.0' }));

// ============================
// SERVE FRONTEND
// ============================
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🌟 Global Talents Platform running on http://localhost:${PORT}`);
  console.log('Demo accounts:');
  console.log('  Candidate: priya@email.com / pass123');
  console.log('  Corporate: hr@techcorp.com / pass123');
  console.log('  Educator:  meera@edu.com / pass123');
  console.log('  Consultant: alex@consult.com / pass123\n');
});