const express = require('express');
const router = express.Router();
const { 
  submitInquiry, 
  submitCareer, 
  subscribeNewsletter, 
  getBlogs, 
  getBlogBySlug, 
  getPublicCaseStudies, 
  getCaseStudyBySlug, 
  getJobs,
  getCommentsForBlog,
  submitComment
} = require('../controllers/publicController');
const upload = require('../middleware/uploadMiddleware');
const { publicFormLimiter } = require('../middleware/rateLimiter');

router.post('/inquiry', publicFormLimiter, submitInquiry);
router.post('/career', publicFormLimiter, upload.single('resume'), submitCareer);
router.post('/newsletter', publicFormLimiter, subscribeNewsletter);
router.get('/blogs', getBlogs);
router.get('/blogs/:slug', getBlogBySlug);
router.get('/blogs/:slug/comments', getCommentsForBlog);
router.post('/blogs/:slug/comments', publicFormLimiter, submitComment);
router.get('/case-studies', getPublicCaseStudies);
router.get('/case-studies/:slug', getCaseStudyBySlug);
router.get('/jobs', getJobs);

module.exports = router;
