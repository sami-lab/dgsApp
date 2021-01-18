const mongoose = require('mongoose');

var AskJackieSchema = mongoose.Schema({
  subject: {
    type: String,
    trim: true,
    required: [true, 'A Question must have a subject'],
  },
  question: {
    type: String,
    trim: true,
    required: [true, 'A Question must have a Description'],
  },
  // attachment: {
  //   type: String,
  // },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    require: [true, 'Question must Belong to a User!'],
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  date: {
    type: Boolean,
    default: false,
  },
});
AskJackieSchema.pre(/^find/, function (next) {
  this.populate('user').populate({
    path: 'user',
    select: 'name username email',
  });
  next();
});
var askJackie = mongoose.model('AskJackie', AskJackieSchema);
module.exports = askJackie;
