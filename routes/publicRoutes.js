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

router.post('/inquiry', submitInquiry);
router.post('/career', upload.single('resume'), submitCareer);
router.post('/newsletter', subscribeNewsletter);
router.get('/blogs', getBlogs);
router.get('/blogs/:slug', getBlogBySlug);
router.get('/blogs/:slug/comments', getCommentsForBlog);
router.post('/blogs/:slug/comments', submitComment);
router.get('/case-studies', getPublicCaseStudies);
router.get('/case-studies/:slug', getCaseStudyBySlug);
router.get('/jobs', getJobs);

module.exports = router;
