const mongoose = require('mongoose');

const careerSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  resumeUrl: { type: String, required: true }, // Cloudinary URL
  position: { type: String, default: 'General Application' },
  status: { type: String, default: 'applied', enum: ['applied', 'shortlisted', 'rejected'] }
}, { timestamps: true });

module.exports = mongoose.model('Career', careerSchema);
