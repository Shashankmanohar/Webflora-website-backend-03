const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  blogSlug: { type: String, required: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  content: { type: String, required: true },
  status: { type: String, default: 'approved', enum: ['approved', 'pending', 'rejected'] }
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
