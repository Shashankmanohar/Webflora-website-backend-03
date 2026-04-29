const mongoose = require('mongoose');

const CaseStudySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Please add a short description']
  },
  content: {
    type: String,
    required: [true, 'Please add the main content (HTML supported)']
  },
  image: {
    type: String,
    required: [true, 'Please add an image URL']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['WEB', 'MOBILE', 'AI/ML', 'SOFTWARE', 'MARKETING', 'DIGITAL MARKETING']
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'published'
  },
  projectUrl: {
    type: String,
    trim: true
  },
  client: {
    type: String,
    trim: true
  },
  outcome: {
    type: String,
    trim: true
  },
  offset: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CaseStudy', CaseStudySchema);
