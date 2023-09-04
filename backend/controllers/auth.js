const User = require('../models/user');
const Posts = require('../models/posts');
const Comunity = require('../models/comunity');
const { errorHandler } = require('../helpers/dbErrorHandler');
const shortId = require('shortid');
const jwt = require('jsonwebtoken');
const { expressjwt } = require('express-jwt');
const _ = require('lodash');
const posts = require('../models/posts');
const comunity = require('../models/comunity');

//sendgrid
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.preSignup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      return res.status(400).json({
        error: 'Email is taken',
      });
    }

    const token = jwt.sign(
      { name, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION,
      {
        expiresIn: '10m',
      }
    );

    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Account activation link`,
      html: `
        <p>Use the following link to activate your account:</p>
        <p>${process.env.CLIENT_URL}/auth/account/activate/${token}</p>
        <hr/>
        <p>This email may contain sensitive information.</p>
        <p>https://concursul.com</p>
      `,
    };

    await sgMail.send(emailData);

    return res.json({
      message: `Email has been sent to ${email}. Follow the instruction to activate your account.`,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Something went wrong. Please try again later.',
    });
  }
};

exports.signup = async (req, res) => {
  const token = req.body.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION);
      const { name, email, password } = jwt.decode(token);
      let username = shortId.generate();
      let profile = `${process.env.CLIENT_URL}/profile/${username}`;

      const user = new User({ name, email, password, profile, username });
      await user.save();

      return res.json({
        message: 'Signup success! Please signin',
      });
    } catch (err) {
      return res.status(401).json({
        error: 'Expired link. Signup again',
      });
    }
  } else {
    return res.json({
      message: 'Something went wrong. Try again',
    });
  }
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        error: 'User with that email does not exist. Signup or try again.',
      });
    }

    // Authenticate
    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: 'Email and password do not match.',
      });
    }

    // Generate a token and send it to the client
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.cookie('token', token, { expiresIn: '1d' });

    const { _id, username, name, role } = user; // Remove 'email' from the destructuring

    return res.json({
      token,
      user: { _id, username, name, email, role },
    });
  } catch (err) {
    return res.status(400).json({
      error: err,
    });
  }
};

exports.signout = (req, res) => {
  res.clearCookie('token');
  res.json({
    message: 'Signout success',
  });
};

exports.requireSignin = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
});

exports.authMiddleware = async (req, res, next) => {
  try {
    const authUserId = req.auth._id;
    const user = await User.findById(authUserId).exec();

    if (!user) {
      return res.status(400).json({
        error: 'User not found',
      });
    }

    req.profile = user;
    next();
  } catch (err) {
    return res.status(400).json({
      error: err.message,
    });
  }
};

exports.adminMiddleware = async (req, res, next) => {
  try {
    const adminUserId = req.auth._id;
    const user = await User.findById(adminUserId).exec();

    if (!user) {
      return res.status(400).json({
        error: 'User not found',
      });
    }

    if (user.role !== 1) {
      return res.status(400).json({
        error: 'Admin resource. Access denied',
      });
    }

    req.profile = user;
    next();
  } catch (err) {
    return res.status(400).json({
      error: err.message,
    });
  }
};

exports.canUpdateDeletePosts = (req, res, next) => {
  const slug = req.params.slug.toLowerCase();
  Posts.findOne({ slug })
    .exec()
    .then((data) => {
      if (!data) {
        return res.status(400).json({
          error: 'Post not found',
        });
      }
      let authorizedUser =
        data.postedBy._id.toString() === req.profile._id.toString();
      if (!authorizedUser) {
        return res.status(400).json({
          error: 'You are not authorized to perform this action on this post',
        });
      }
      next();
    })
    .catch((err) => {
      return res.status(400).json({
        error: errorHandler(err),
      });
    });
};

exports.canUpdateDeleteComunitiesPosts = (req, res, next) => {
  const slug = req.params.slug.toLowerCase();
  Comunity.findOne({ slug })
    .exec()
    .then((data) => {
      if (!data) {
        return res.status(400).json({
          error: 'Post not found',
        });
      }
      let authorizedUser =
        data.postedBy._id.toString() === req.profile._id.toString();
      if (!authorizedUser) {
        return res.status(400).json({
          error: 'You are not authorized to perform this action on this post',
        });
      }
      next();
    })
    .catch((err) => {
      return res.status(400).json({
        error: errorHandler(err),
      });
    });
};

// forgot and reset password

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const auth = await User.findOne({ email });

    if (!auth) {
      return res.status(401).json({
        error: 'User with that email does not exist',
      });
    }

    const token = jwt.sign({ _id: auth._id }, process.env.JWT_RESET_PASSWORD, {
      expiresIn: '10m',
    });

    // email
    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Password reset link`,
      html: `
        <p>Use the following link to reset your password:</p>
        <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
        <hr/>
        <p>This email may contain sensitive information.</p>
        <p>https://concursul.com</p>
      `,
    };

    auth.resetPasswordLink = token;
    await auth.save(); // Save the user document after updating resetPasswordLink

    sgMail.send(emailData).then((sent) => {
      return res.json({
        message: `Link to reset password has been sent to ${email}. It expires in 10 minutes. Follow the instructions to successfully reset your password.`,
      });
    });
  } catch (err) {
    return res.json({ error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;

  if (resetPasswordLink) {
    try {
      const decoded = await jwt.verify(
        resetPasswordLink,
        process.env.JWT_RESET_PASSWORD
      );

      const user = await User.findOne({ resetPasswordLink });

      if (!user) {
        return res.status(401).json({
          error: 'Something went wrong. Try later...',
        });
      }

      user.password = newPassword;
      user.resetPasswordLink = '';

      const result = await user.save();

      res.json({
        message: `Nice~ Now you can sign in with your new password!`,
      });
    } catch (err) {
      return res.status(401).json({
        error: 'Expired link. Try again',
      });
    }
  }
};
