const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const comunitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      min: 3,
      max: 160,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    body: {
      type: {},
      required: true,
      min: 1,
      max: 2000000,
    },

    mtitle: {
      type: String,
    },
    mdesc: {
      type: String,
    },

    postedBy: {
      type: ObjectId,
      ref: 'User',
    },
    likes: [{ type: ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

// user model
module.exports = mongoose.model('Comunity', comunitySchema);
