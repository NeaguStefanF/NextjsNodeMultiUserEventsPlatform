const Category = require('../models/category');
const Posts = require('../models/posts');
const slugify = require('slugify');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    const slug = slugify(name).toLowerCase();

    const category = new Category({ name, slug });

    const savedCategory = await category.save();

    res.json(savedCategory);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler(err),
    });
  }
};

// List all categories
exports.list = async (req, res) => {
  try {
    const categories = await Category.find({}).exec();
    res.json(categories);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler(err),
    });
  }
};

// Find a single category
exports.read = async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase();
    const category = await Category.findOne({ slug }).exec();

    if (!category) {
      return res.status(404).json({
        error: 'Category not found',
      });
    }
    const data = await Posts.find({ categories: category })
      .populate('categories', '_id, name slug')
      .populate('tags', '_id name slug')
      .populate('postedBy', '_id name username')
      .select(
        '_id title slug excerpt categories postedBy tags createdAt updatedAt'
      )
      .exec();
    res.json({ category, posts: data });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler(err),
    });
  }
};

// Remove a category
exports.remove = async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase();
    await Category.findOneAndRemove({ slug }).exec();
    res.json({
      message: 'Category deleted successfully',
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler(err),
    });
  }
};
