const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const TYPES = require('./role-types');

const userSchema = new Schema({
  email      : {type:  String, required: false},
  username   : {type:  String, required: false},
  role       : {type:  String, required: false},
  password   : {type: String, required: false},
  facebookID: String,
  googleID: String
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
