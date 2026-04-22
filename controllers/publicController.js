const Inquiry = require('../models/Inquiry');
const Career = require('../models/Career');
const Newsletter = require('../models/Newsletter');
const Blog = require('../models/Blog');

const submitInquiry = async (req, res) => {
  const { name, email, service, message } = req.body;

  try {
    const inquiry = await Inquiry.create({ name, email, service, message });
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

module.exports = { submitInquiry, submitCareer, subscribeNewsletter, getBlogs, getBlogBySlug };
