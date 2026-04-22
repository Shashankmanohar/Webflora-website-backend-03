const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  image: { type: String, required: true },
  author: { type: String, default: 'Admin' },
  category: { type: String, default: 'General' },
  tags: { type: [String], default: [] },
  status: { type: String, default: 'published', enum: ['published', 'draft'] },
  seoTitle: { type: String },
  seoDescription: { type: String },
  seoKeywords: { type: String },
  metaExtraHead: { type: String },
  datePosted: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
