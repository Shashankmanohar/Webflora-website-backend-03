const Inquiry = require('../models/Inquiry');
const Career = require('../models/Career');
const Newsletter = require('../models/Newsletter');
const Blog = require('../models/Blog');
const CaseStudy = require('../models/CaseStudy');
const Job = require('../models/Job');
const Comment = require('../models/Comment');
const {
  isHoneypotFilled,
  isDisposableEmail,
  isValidName,
  isValidEmail,
  isValidMessageQuality
} = require('../utils/spamFilter');

const submitInquiry = async (req, res) => {
  const { name, email, phone, service, message } = req.body;

  // 1. Honeypot Field Check (Silent Bot Discard)
  if (isHoneypotFilled(req.body)) {
    return res.status(200).json({ message: 'Inquiry submitted successfully' });
  }

  // 2. Name Format & Gibberish Validation
  if (!name || !isValidName(name)) {
    return res.status(400).json({ message: 'Please provide a valid name (letters and spaces only).' });
  }

  // 3. Email & Disposable Domain Validation
  if (email && !isValidEmail(email)) {
    return res.status(400).json({ message: 'Please provide a valid, non-disposable email address.' });
  }

  // 4. Message Quality & Minimum Length Validation
  const effectiveMessage = message || 'Quick Quote Request';
  if (effectiveMessage !== 'Quick Quote Request' && !isValidMessageQuality(effectiveMessage)) {
    return res.status(400).json({ 
      message: 'Message does not meet quality standards. Please provide a clear description (at least 15 characters).' 
    });
  }

  // Extract Client IP and User Agent
  const ipAddress = (req.headers['x-forwarded-for'] || req.ip || req.socket.remoteAddress || '').split(',')[0].trim();
  const userAgent = req.headers['user-agent'] || '';

  try {
    const inquiry = await Inquiry.create({ 
      name, 
      email: email || '', 
      phone: phone || '', 
      service: service || 'Attendance Software Inquiry', 
      message: effectiveMessage,
      ipAddress,
      userAgent
    });
    res.status(201).json({ message: 'Inquiry submitted successfully', data: inquiry });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const subscribeNewsletter = async (req, res) => {
  const { email } = req.body;

  try {
    const exists = await Newsletter.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'Already subscribed' });
    }
    await Newsletter.create({ email });
    res.status(201).json({ message: 'Subscribed successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const submitCareer = async (req, res) => {
  const { name, email, position } = req.body;
  const resumeUrl = req.file ? req.file.path : null;

  if (!resumeUrl) {
    return res.status(400).json({ message: 'Resume file is required' });
  }

  try {
    const career = await Career.create({
      name,
      email,
      position: position || 'General Application',
      resumeUrl
    });
    res.status(201).json({ message: 'Application submitted successfully', data: career });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ status: 'published' }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, status: 'published' });
    if (blog) {
      res.json(blog);
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPublicCaseStudies = async (req, res) => {
  try {
    const caseStudies = await CaseStudy.find({ status: 'published' }).sort({ createdAt: -1 });
    res.json(caseStudies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCaseStudyBySlug = async (req, res) => {
  try {
    const caseStudy = await CaseStudy.findOne({ slug: req.params.slug, status: 'published' });
    if (caseStudy) {
      res.json(caseStudy);
    } else {
      res.status(404).json({ message: 'Case Study not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'open' }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCommentsForBlog = async (req, res) => {
  try {
    const comments = await Comment.find({ blogSlug: req.params.slug, status: 'approved' }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const submitComment = async (req, res) => {
  const { name, email, content } = req.body;
  const { slug } = req.params;

  if (isHoneypotFilled(req.body)) {
    return res.status(201).json({ message: 'Comment posted successfully' });
  }

  if (!name || !isValidName(name)) {
    return res.status(400).json({ message: 'Valid name is required.' });
  }

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ message: 'Valid non-disposable email is required.' });
  }

  if (!content || !isValidMessageQuality(content)) {
    return res.status(400).json({ message: 'Comment content does not meet quality requirements.' });
  }

  try {
    const comment = await Comment.create({
      blogSlug: slug,
      name,
      email,
      content
    });
    res.status(201).json({ message: 'Comment posted successfully', data: comment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { 
  submitInquiry, 
  submitCareer, 
  subscribeNewsletter, 
  getBlogs, 
  getBlogBySlug, 
  getPublicCaseStudies, 
  getCaseStudyBySlug, 
  getJobs,
  getCommentsForBlog,
  submitComment
};
