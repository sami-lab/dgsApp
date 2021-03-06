const mongoose = require('mongoose');

var articleSchema = mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'An article must have a name'],
  },
  matter: {
    type: String,
    required: true,
  },

  thumbnail: {
    type: String,
    required: [true, 'An article must have a cover image'],
  },
  files: [String],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'articleCategories',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

var article = mongoose.model('article', articleSchema);
module.exports = article;
