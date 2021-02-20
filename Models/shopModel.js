const mongoose = require('mongoose');

var ShopSchema = mongoose.Schema({
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
    required: [true, 'A Shop  must have website url'],
  },

  date: {
    type: Date,
    default: Date.now(),
  },
});

var ShopModel = mongoose.model('ShopModel', ShopSchema);
module.exports = ShopModel;
