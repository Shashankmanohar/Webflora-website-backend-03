const Inquiry = require('../models/Inquiry');
const Career = require('../models/Career');
const Newsletter = require('../models/Newsletter');
const Admin = require('../models/Admin');
const Blog = require('../models/Blog');
const bcrypt = require('bcryptjs');

const getInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({}).sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getNewsletters = async (req, res) => {
  try {
    const newsletters = await Newsletter.find({}).sort({ createdAt: -1 });
    res.json(newsletters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCareers = async (req, res) => {
  try {
    const careers = await Career.find({}).sort({ createdAt: -1 });
    res.json(careers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createBlog = async (req, res) => {
  try {
    const {
      title, slug, content, author, category, tags, status,
      seoTitle, seoDescription, seoKeywords, metaExtraHead, datePosted,
      imageUrl
    } = req.body;

    let image = req.file ? req.file.path : imageUrl;

    if (!title || !content || !image) {
      return res.status(400).json({ message: 'Please provide title, content and image' });
    }

    const generatedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const blog = await Blog.create({
      title,
      slug: generatedSlug,
      content,
      image,
      author: author || 'Admin',
      category: category || 'General',
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [],
      status: status || 'published',
      seoTitle,
      seoDescription,
      seoKeywords,
      metaExtraHead,
      datePosted: datePosted || Date.now()
    });

    res.status(201).json(blog);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Slug already exists. Please use a unique slug.' });
    }
    res.status(500).json({ message: error.message });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (blog) {
      await blog.deleteOne();
      res.json({ message: 'Blog removed' });
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateInquiryStatus = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (inquiry) {
      inquiry.status = req.body.status || inquiry.status;
      const updatedInquiry = await inquiry.save();
      res.json(updatedInquiry);
    } else {
      res.status(404).json({ message: 'Inquiry not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCareerStatus = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);
    if (career) {
      career.status = req.body.status || career.status;
      const updatedCareer = await career.save();
      res.json(updatedCareer);
    } else {
      res.status(404).json({ message: 'Application not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({}, '-password');
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ email, password: hashedPassword });
    res.status(201).json({ _id: admin._id, email: admin.email });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (admin) {
      await admin.deleteOne();
      res.json({ message: 'Admin removed' });
    } else {
      res.status(404).json({ message: 'Admin not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getInquiries,
  getCareers,
  updateInquiryStatus,
  updateCareerStatus,
  getNewsletters,
  getAdmins,
  createAdmin,
  deleteAdmin,
  getBlogs,
  createBlog,
  deleteBlog
};
