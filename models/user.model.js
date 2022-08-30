var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  telegramId : Number,
  firstname : String,
  lastname : String,
  username: String,
  language_code: String,
  coreSystemRefId: String,
  lang: String, // fa ,ar, en
});

module.exports = mongoose.model('User', UserSchema);
