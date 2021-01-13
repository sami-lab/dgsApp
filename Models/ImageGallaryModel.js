const mongoose = require('mongoose');

var ImageGallarySchema = mongoose.Schema({
  image: {
    type: String,
    required: [true, 'A Image Gallary image must have a image'],
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

var ImageGallary = mongoose.model('ImageGallary', ImageGallarySchema);
module.exports = ImageGallary;
