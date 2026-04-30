const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Full-Time', 'Part-Time', 'Internship', 'Contract'],
    default: 'Full-Time'
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  lastDate: {
    type: Date,
    required: false
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Job', jobSchema);
