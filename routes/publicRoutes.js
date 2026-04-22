const express = require('express');
const router = express.Router();
const { submitInquiry, submitCareer, subscribeNewsletter, getBlogs, getBlogBySlug } = require('../controllers/publicController');
const upload = require('../middleware/uploadMiddleware');

router.post('/inquiry', submitInquiry);
router.post('/career', upload.single('resume'), submitCareer);
router.post('/newsletter', subscribeNewsletter);
router.get('/blogs', getBlogs);
router.get('/blogs/:slug', getBlogBySlug);

module.exports = router;
