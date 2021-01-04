const mongoose = require('mongoose');

var ConnectCategoriesSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    trim: true,
    required: [true, 'A Connect Category must have a name'],
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

var connectCategories = mongoose.model(
  'connectCategories',
  ConnectCategoriesSchema,
);
module.exports = connectCategories;
