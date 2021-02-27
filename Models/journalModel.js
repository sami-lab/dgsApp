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
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

var JournalModel = mongoose.model('JournalModel', JournalSchema);
module.exports = JournalModel;
