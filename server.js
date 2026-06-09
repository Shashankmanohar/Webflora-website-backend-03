const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const publicRoutes = require('./routes/publicRoutes');
const Admin = require('./models/Admin');
const bcrypt = require('bcryptjs');

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'X-Requested-With', 'Accept', 'Accept-Version', 'Content-Length', 'Content-MD5', 'Date', 'X-Api-Version']
}));

app.use(express.json());

// Test Route
app.get('/', (req, res) => {
  res.send('Hello from Webflora Backend!');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicRoutes);

// Seed Admin Logic
const seedAdmin = async () => {
  try {
    const adminExists = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      await Admin.create({
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword
      });
      console.log('Admin seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding admin:', error.message);
  }
};

// Error Handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

// Database Connection and Server Start
const startServer = async () => {
  try {
    // 1. Connect to Database
    await connectDB();

    // 2. Seed Admin if not exists
    await seedAdmin();

    // 3. Start Express Server
    const PORT = process.env.PORT || 5000;
    if (process.env.NODE_ENV !== 'production') {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    }
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
