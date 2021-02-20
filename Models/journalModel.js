const mongoose = require('mongoose');

var JournalSchema = mongoose.Schema({
  description: {
    type: String,
    required: [true, 'A note  must have a description'],
  },
  image: {
    type: String,
  },
  title: {
    type: String,
    required: [true, 'A note must have title'],
  },

  date: {
    type: Date,
    default: Date.now(),
  },
});

var JournalModel = mongoose.model('JournalModel', JournalSchema);
module.exports = JournalModel;
