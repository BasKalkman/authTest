var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String
});

module.exports = mongoose.model('User', UserSchema);
