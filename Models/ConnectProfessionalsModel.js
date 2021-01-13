const mongoose = require('mongoose');
const validator = require('validator');

var ConnectProfessionalsSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    trim: true,
    required: [true, 'A Connect Professionals must have a name'],
  },
  image: {
    type: String,
    default: 'default.png',
  },
  phone: {
    type: String,
    required: [true, 'A Connect Professionals must have an phone'],
  },
  description: {
    type: String,
    required: [true, 'A Connect Professionals must have an short Bio'],
  },
  website: {
    type: String,
  },
  email: {
    type: String,
    required: [true, 'A Connect Professionals must have an email'],
    validate: [validator.isEmail, 'Please Provide a Valid Email'],
  },
  connectCategory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'connectCategories',
      required: true,
    },
  ],
  date: {
    type: Date,
    default: Date.now(),
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

var connectProfessionals = mongoose.model(
  'connectProfessionals',
  ConnectProfessionalsSchema,
);
module.exports = connectProfessionals;
