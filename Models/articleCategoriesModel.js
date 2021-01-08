const mongoose = require('mongoose');

var articleCategoriesSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    trim: true,
    required: [true, 'An article Category must have a name'],
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

var articleCategories = mongoose.model(
  'articleCategories',
  articleCategoriesSchema,
);
module.exports = articleCategories;
