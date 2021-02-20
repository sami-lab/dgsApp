const mongoose = require('mongoose');

var BookSchema = mongoose.Schema({
  description: {
    type: String,
    required: [true, 'A Book  must have a description'],
  },
  image: {
    type: String,
    required: [true, 'A Book  must have a cover Image'],
  },
  website: {
    type: String,
    required: [true, 'A Book  must have website url'],
  },

  date: {
    type: Date,
    default: Date.now(),
  },
});

var BookModel = mongoose.model('BookModel', BookSchema);
module.exports = BookModel;
