const mongoose = require('mongoose');

const inquirySchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  service: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, default: 'pending', enum: ['pending', 'reviewed', 'contacted'] }
}, { timestamps: true });

module.exports = mongoose.model('Inquiry', inquirySchema);
