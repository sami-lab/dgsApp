const mongoose = require('mongoose');

var BreatheSchema = mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'A Connect Professionals must have a name'],
  },
  thumbnail: {
    type: String,
    default: 'default.png',
    required: true,
  },
  description: {
    type: String,
    required: [true, 'An artcle must have description'],
  },
  video: {
    type: String,
    required: [true, 'A Breathe Video must have video'],
    default: 'default.mp4',
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'breatheCategories',
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

var Breathe = mongoose.model('breathe', BreatheSchema);
module.exports = Breathe;
