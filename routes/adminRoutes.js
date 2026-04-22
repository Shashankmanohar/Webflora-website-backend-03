const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/inquiries', protect, getInquiries);
router.get('/careers', protect, getCareers);
router.get('/newsletters', protect, getNewsletters);
router.put('/inquiry/:id', protect, updateInquiryStatus);
router.put('/career/:id', protect, updateCareerStatus);

router.get('/admins', protect, getAdmins);
router.post('/admins', protect, createAdmin);
router.delete('/admins/:id', protect, deleteAdmin);

router.get('/blogs', protect, getBlogs);
router.post('/blogs', protect, upload.single('image'), createBlog);
router.delete('/blogs/:id', protect, deleteBlog);

module.exports = router;
