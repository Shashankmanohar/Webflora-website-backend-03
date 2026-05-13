const express = require('express');
const router = express.Router();
const {
  getInquiries,
  getCareers,
  updateInquiryStatus,
  updateCareerStatus,
  deleteInquiry,
  deleteCareer,
  getNewsletters,
  deleteNewsletter,
  getAdmins,
  createAdmin,
  deleteAdmin,
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  getCaseStudies,
  createCaseStudy,
  updateCaseStudy,
  deleteCaseStudy,
  getJobs,
  createJob,
  deleteJob,
  updateJob
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/inquiries', protect, getInquiries);
router.get('/careers', protect, getCareers);
router.get('/newsletters', protect, getNewsletters);
router.put('/inquiry/:id', protect, updateInquiryStatus);
router.delete('/inquiry/:id', protect, deleteInquiry);
router.put('/career/:id', protect, updateCareerStatus);
router.delete('/career/:id', protect, deleteCareer);
router.delete('/newsletter/:id', protect, deleteNewsletter);

router.get('/admins', protect, getAdmins);
router.post('/admins', protect, createAdmin);
router.delete('/admins/:id', protect, deleteAdmin);

router.get('/blogs', protect, getBlogs);
router.post('/blogs', protect, upload.single('image'), createBlog);
router.put('/blogs/:id', protect, upload.single('image'), updateBlog);
router.delete('/blogs/:id', protect, deleteBlog);

router.get('/case-studies', protect, getCaseStudies);
router.post('/case-studies', protect, upload.single('image'), createCaseStudy);
router.put('/case-studies/:id', protect, upload.single('image'), updateCaseStudy);
router.delete('/case-studies/:id', protect, deleteCaseStudy);

router.get('/jobs', protect, getJobs);
router.post('/jobs', protect, createJob);
router.put('/jobs/:id', protect, updateJob);
router.delete('/jobs/:id', protect, deleteJob);

module.exports = router;
