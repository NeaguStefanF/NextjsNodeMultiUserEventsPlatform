const Comunity = require('../models/comunity');
const User = require('../models/user');
const formidable = require('formidable');
const slugify = require('slugify');
const _ = require('lodash');
const { stripHtml } = require('string-strip-html');
const { errorHandler } = require('../helpers/dbErrorHandler');
const fs = require('fs');
const { smartTrim } = require('../helpers/posts');

exports.create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: 'Image could not be uploaded',
      });
    }
    const { title, body } = fields;

    if (!title || !title.length) {
      return res.status(400).json({
        error: 'Title is required',
      });
    }

    if (!body || body.length < 2) {
      return res.status(400).json({
        error: 'Content is shorter than 2 characters',
      });
    }

    let comunity = new Comunity();
    comunity.title = title;
    comunity.body = body;
    comunity.slug = slugify(title).toLowerCase();
    comunity.mtitle = `${title} | ${process.env.APP_NAME}`;
    comunity.mdesc = stripHtml(body.substring(0, 160)).result.toString();
    comunity.postedBy = req.auth._id;

    comunity
      .save()
      .then((savedComunity) => {
        res.json(savedComunity);
      })
      .catch((err) => {
        res.status(400).json({
          error: err,
        });
      });
  });
};

exports.mlist = (req, res) => {
  Comunity.find({})
    .populate('postedBy', '_id name username')
    .sort({ createdAt: -1 })
    .select('_id title slug postedBy createdAt updatedAt')
    .exec()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({
        error: errorHandler(err),
      });
    });
};

exports.read = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Comunity.findOne({ slug })
    .populate('postedBy', '_id name username profile')
    .sort({ createdAt: -1 })
    .select('_id title body slug mdesc postedBy createdAt updatedAt')
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(400).json({
        error: errorHandler(err),
      });
    });
};

exports.list = async (req, res) => {
  try {
    // Extract limit and skip values from the request body
    let limit = req.body.limit ? parseInt(req.body.limit) : 10;
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;

    // Fetch posts with populated categories, tags, and postedBy fields
    const comunity = await Comunity.find({})
      .populate('postedBy', '_id name username profile')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('_id title slug body postedBy createdAt updatedAt');

    // Return the posts, categories, tags, and size of the posts array
    res.json({ comunity, size: comunity.length });
  } catch (err) {
    // Handle any errors and return a 400 status code with the error message
    return res.status(400).json({
      error: errorHandler(err),
    });
  }
};

exports.remove = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Comunity.findOneAndRemove({ slug })
    .then((data) => {
      res.json({
        message: 'Comunity Post removed successfully',
      });
    })
    .catch((err) => {
      res.status(400).json({
        error: errorHandler(err),
      });
    });
};

exports.update = (req, res) => {
  const slug = req.params.slug.toLowerCase();

  Comunity.findOne({ slug })
    .then((oldComunity) => {
      if (!oldComunity) {
        return res.status(404).json({
          error: 'Post not found',
        });
      }

      let form = new formidable.IncomingForm();
      form.keepExtensions = true;
      form.parse(req, (err, fields, files) => {
        if (err) {
          return res.status(400).json({
            error: 'Image could not be uploaded',
          });
        }

        let slugBeforeMerge = oldComunity.slug;
        oldComunity = _.merge(oldComunity, fields);
        oldComunity.slug = slugBeforeMerge;

        const { body } = fields;

        if (body) {
          oldComunity.mdesc = stripHtml(
            body.substring(0, 160)
          ).result.toString();
        }

        oldComunity
          .save()
          .then((result) => {
            res.json(result);
          })
          .catch((err) => {
            res.status(400).json({
              error: err,
            });
          });
      });
    })
    .catch((err) => {
      res.status(400).json({
        error: errorHandler(err),
      });
    });
};

//list all posts from the normal user
exports.listByUser = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).exec();

    if (!user) {
      return res.status(400).json({
        error: 'User not found',
      });
    }

    const userId = user._id;

    const data = await Comunity.find({ postedBy: userId })
      .populate('postedBy', '_id name username')
      .sort({ createdAt: -1 })
      .select('_id title slug postedBy createdAt updatedAt')
      .exec();

    res.json(data);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler(err),
    });
  }
};
