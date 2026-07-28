const mongoose = require('mongoose');

const inquirySchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  service: { type: String, default: 'General Inquiry' },
  message: { type: String, required: true },
  ipAddress: { type: String, default: '' },
  userAgent: { type: String, default: '' },
  status: { type: String, default: 'pending', enum: ['pending', 'reviewed', 'contacted'] }
}, { timestamps: true });

module.exports = mongoose.model('Inquiry', inquirySchema);
