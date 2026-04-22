const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const publicRoutes = require('./routes/publicRoutes');
const Admin = require('./models/Admin');
const bcrypt = require('bcryptjs');

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Test Route
app.get('/', (req, res) => {
  res.send('Hello from Webflora Backend!');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicRoutes);

// Seed Admin if not exists
const seedAdmin = async () => {
  const adminExists = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    await Admin.create({
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword
    });
    console.log('Admin seeded successfully');
  }
};
seedAdmin();

// Error Handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
