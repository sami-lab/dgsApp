const mongoose = require('mongoose');

var RolesSchema = mongoose.Schema({
  rolename: {
    type: String,
    unique: true,
    required: [true, 'A Role must have a name'],
  },
});

var Roles = mongoose.model('Roles', RolesSchema);
module.exports = Roles;
