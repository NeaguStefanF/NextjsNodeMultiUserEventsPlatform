const { check } = require('express-validator');

exports.contactFormValidator = [
  check('name').not().isEmpty().withMessage('Name is required'),
  check('email').isEmail().withMessage('Email have to be a valid one'),
  check('message')
    .not()
    .isEmpty()
    .isLength({ min: 20 })
    .withMessage('Message need to be at least 20 characters long'),
];
