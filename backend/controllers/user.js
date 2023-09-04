const User = require('../models/user');
const Posts = require('../models/posts');
const _ = require('lodash');
const formidable = require('formidable');
const fs = require('fs');
const { errorHandler } = require('../helpers/dbErrorHandler');

//controller method read, user info/profile
exports.read = (req, res) => {
  req.profile.hashed_password = undefined;
  return res.json(req.profile);
};

exports.publicProfile = async (req, res) => {
  try {
    let username = req.params.username;

    // Find the user
    let auth = await User.findOne({ username });

    if (!auth) {
      return res.status(400).json({
        error: 'User not found',
      });
    }

    let userId = auth._id;

    // Find the posts associated with the user
    let data = await Posts.find({ postedBy: userId })
      .populate('categories', '_id name slug')
      .populate('tags', '_id name slug')
      .populate('postedBy', '_id name')
      .limit(10)
      .select(
        '_id title slug excerpt categories tags postedBy createdAt updatedAt'
      );

    auth.photo = undefined;
    auth.hashed_password = undefined;

    res.json({
      auth,
      posts: data,
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler(err),
    });
  }
};

//user profile update
exports.update = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: 'Photo could not be uploaded',
      });
    }
    let auth = req.profile;
    auth = _.extend(auth, fields);

    if (fields.password && fields.password.length < 6) {
      return res.status(400).json({
        error: 'Password need to be min 6 characters',
      });
    }

    if (files.photo) {
      // console.log('FILES PHOTO: ', files.photo);
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: 'Image should be less than 1mb in size',
        });
      }

      auth.photo.data = fs.readFileSync(files.photo.filepath);
      auth.photo.contentType = files.photo.type;
    }

    auth
      .save()
      .then(() => {
        auth.hashed_password = undefined;
        auth.salt = undefined;
        auth.photo = undefined;

        res.json(auth);
      })
      .catch((err) => {
        return res.status(400).json({
          error: errorHandler(err),
        });
      });
  });
};

//update photo
exports.photo = (req, res) => {
  const username = req.params.username;
  User.findOne({ username })
    .then((auth) => {
      if (!auth) {
        return res.status(400).json({
          error: 'User not found',
        });
      }
      if (auth.photo.data) {
        res.set('Content-Type', auth.photo.contentType);
        return res.send(auth.photo.data);
      }
    })
    .catch((err) => {
      return res.status(400).json({
        error: errorHandler(err),
      });
    });
};
