const Tag = require('../models/tag');
const Posts = require('../models/posts');
const slugify = require('slugify');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    const slug = slugify(name).toLowerCase();

    const tag = new Tag({ name, slug });

    const savedTag = await tag.save();

    res.json(savedTag);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler(err),
    });
  }
};

// List all tags
exports.list = async (req, res) => {
  try {
    const tags = await Tag.find({}).exec();
    res.json(tags);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler(err),
    });
  }
};

//Find a single tag
exports.read = async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase();
    const tag = await Tag.findOne({ slug }).exec();

    if (!tag) {
      return res.status(404).json({
        error: 'Tag not found',
      });
    }
    const data = await Posts.find({ tags: tag })
      .populate('categories', '_id, name slug')
      .populate('tags', '_id name slug')
      .populate('postedBy', '_id name username')
      .select(
        '_id title slug excerpt categories postedBy tags createdAt updatedAt'
      )
      .exec();
    res.json({ tag, posts: data });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler(err),
    });
  }
};

// Remove a tag
exports.remove = async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase();
    await Tag.findOneAndRemove({ slug }).exec();
    res.json({
      message: 'Tag deleted successfully',
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler(err),
    });
  }
};
