const Posts = require('../models/posts');
const Category = require('../models/category');
const Tag = require('../models/tag');
const User = require('../models/user');
const formidable = require('formidable');
const slugify = require('slugify');
const { stripHtml } = require('string-strip-html');
const _ = require('lodash');
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
    const { title, body, categories, tags } = fields;

    if (!title || !title.length) {
      return res.status(400).json({
        error: 'title is required',
      });
    }

    if (!body || body.length < 200) {
      return res.status(400).json({
        error: 'content is shorter than 200 characters',
      });
    }

    if (!categories || categories.length === 0) {
      return res.status(400).json({
        error: 'You need one or more categories',
      });
    }

    if (!tags || tags.length === 0) {
      return res.status(400).json({
        error: 'You need one or more tags',
      });
    }

    let posts = new Posts();
    posts.title = title;
    posts.body = body;
    posts.excerpt = smartTrim(body, 320, ' ', '...');
    posts.slug = slugify(title).toLowerCase();
    posts.mtitle = `${title} | ${process.env.APP_NAME}`;
    posts.mdesc = stripHtml(body.substring(0, 160)).result.toString();
    posts.postedBy = req.auth._id;
    //categories and tags
    let arrayOfCategories = categories && categories.split(',');
    let arrayOfTags = tags && tags.split(',');

    if (files.photo) {
      // console.log('FILES PHOTO: ', files.photo);
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: 'Image should be less than 1mb in size',
        });
      }

      posts.photo.data = fs.readFileSync(files.photo.filepath);
      posts.photo.contentType = files.photo.type;
    }

    posts
      .save()
      .then((savedPost) => {
        // res.json(savedPost);
        return Posts.findByIdAndUpdate(
          savedPost._id,
          { $push: { categories: arrayOfCategories } },
          { new: true }
        ).exec();
      })
      .then((updatedPostCategories) => {
        return Posts.findByIdAndUpdate(
          updatedPostCategories._id,
          { $push: { tags: arrayOfTags } },
          { new: true }
        ).exec();
      })
      .then((updatedPostTags) => {
        res.json(updatedPostTags);
      })
      .catch((err) => {
        res.status(400).json({
          error: err,
        });
      });
  });
};

//list,listAllPostsCategoriesTags,read,remove,update

exports.list = (req, res) => {
  Posts.find({})
    .populate('categories', '_id name slug')
    .populate('tags', '_id name slug')
    .populate('postedBy', '_id name username')
    .sort({ createdAt: -1 })
    .select(
      '_id title slug excerpt categories tags postedBy createdAt updatedAt'
    )
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

exports.listAllPostsCategoriesTags = async (req, res) => {
  try {
    // Extract limit and skip values from the request body
    let limit = req.body.limit ? parseInt(req.body.limit) : 10;
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;

    // Fetch posts with populated categories, tags, and postedBy fields
    const posts = await Posts.find({})
      .populate('categories', '_id name slug')
      .populate('tags', '_id name slug')
      .populate('postedBy', '_id name username profile')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select(
        '_id title slug excerpt categories tags postedBy createdAt updatedAt'
      );

    // Fetch all categories
    const categories = await Category.find({});

    // Fetch all tags
    const tags = await Tag.find({});

    // Return the posts, categories, tags, and size of the posts array
    res.json({ posts, categories, tags, size: posts.length });
  } catch (err) {
    // Handle any errors and return a 400 status code with the error message
    return res.status(400).json({
      error: errorHandler(err),
    });
  }
};
exports.read = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Posts.findOne({ slug })
    .populate('categories', '_id name slug')
    .populate('tags', '_id name slug')
    .populate('postedBy', '_id name username profile')
    .sort({ createdAt: -1 })
    .select(
      '_id title body slug mtitle mdesc categories tags postedBy createdAt updatedAt'
    )
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(400).json({
        error: errorHandler(err),
      });
    });
};

exports.remove = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Posts.findOneAndRemove({ slug })
    .then((data) => {
      res.json({
        message: 'Post removed successfully',
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

  Posts.findOne({ slug })
    .then((oldPosts) => {
      if (!oldPosts) {
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

        let slugBeforeMerge = oldPosts.slug;
        oldPosts = _.merge(oldPosts, fields);
        oldPosts.slug = slugBeforeMerge;

        const { body, mdesc, categories, tags } = fields;

        if (body) {
          oldPosts.excerpt = smartTrim(body, 320, ' ', '...');
          oldPosts.mdesc = stripHtml(body.substring(0, 160)).result.toString();
        }

        if (categories) {
          oldPosts.categories = categories.split(',');
        }

        if (tags) {
          oldPosts.tags = tags.split(',');
        }

        if (files.photo) {
          if (files.photo.size > 1000000) {
            return res.status(400).json({
              error: 'Image should be less than 1mb in size',
            });
          }

          oldPosts.photo.data = fs.readFileSync(files.photo.filepath);
          oldPosts.photo.contentType = files.photo.type;
        }

        oldPosts
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

exports.photo = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Posts.findOne({ slug })
    .select('photo')
    .then((posts) => {
      if (!posts) {
        return res.status(400).json({
          error: 'Post not found',
        });
      }
      res.set('Content-Type', 'image/jpeg');
      return res.send(posts.photo.data);
    })
    .catch((err) => {
      res.status(400).json({
        error: errorHandler(err),
      });
    });
};

exports.listRelated = async (req, res) => {
  try {
    let limit = req.body.limit ? parseInt(req.body.limit) : 3;
    const { _id, categories } = req.body.posts;

    const related = await Posts.find({
      _id: { $ne: _id },
      categories: { $in: categories },
    })
      .limit(limit)
      .populate('postedBy', '_id name username profile')
      .select('title slug excerpt postedBy createdAt updatedAt')
      .exec();

    res.json(related);
  } catch (err) {
    return res.status(400).json({
      error: 'Posts not found',
    });
  }
};

exports.listSearch = async (req, res) => {
  try {
    console.log(req.query);
    const { search } = req.query;

    if (search) {
      const posts = await Posts.find({
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { body: { $regex: search, $options: 'i' } },
        ],
      }).select('-photo -body');
      res.json(posts);
    }
  } catch (err) {
    return res.status(400).json({
      error: errorHandler(err),
    });
  }
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

    const data = await Posts.find({ postedBy: userId })
      .populate('categories', '_id name slug')
      .populate('tags', '_id name slug')
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

// comments
exports.comment = (req, res) => {
  const { slug } = req.body;
  const { text } = req.body.comment;
  const { _id } = req.auth;

  Posts.findOneAndUpdate(
    { slug },
    { $push: { comments: { text, postedBy: _id } } },
    { new: true }
  )
    .populate('comments.postedBy', '_id name')
    .populate('postedBy', '_id name')
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(result);
    });
};

exports.uncomment = (req, res) => {
  const { slug } = req.body;
  const { _id } = req.auth;
  const { comment } = req.body;

  Posts.findOneAndUpdate(
    { slug },
    { $pull: { comments: { _id: comment._id, postedBy: _id } } },
    { new: true }
  )
    .populate('comments.postedBy', '_id name')
    .populate('postedBy', '_id name')
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(result);
    });
};
