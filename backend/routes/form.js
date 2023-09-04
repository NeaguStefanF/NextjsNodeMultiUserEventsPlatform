const express = require('express');
const router = express.Router();
const { contactForm, contactPostsAuthorForm } = require('../controllers/form');

// validators
const { runValidation } = require('../validators');
const { contactFormValidator } = require('../validators/form');

router.post('/contact', contactFormValidator, runValidation, contactForm);
router.post(
  '/contact-posts-author',
  contactFormValidator,
  runValidation,
  contactPostsAuthorForm
);

module.exports = router;
