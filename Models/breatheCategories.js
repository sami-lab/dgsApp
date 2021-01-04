const mongoose = require('mongoose');

var BreatheCategoriesSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    trim: true,
    required: [true, 'A Breathe Category must have a name'],
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

var BreatheCategories = mongoose.model(
  'breatheCategories',
  BreatheCategoriesSchema,
);
module.exports = BreatheCategories;
