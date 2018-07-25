const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
  name: String,
  pic_url: String,
  auth_id: String,
  friends: [],
  requests: [],
  chats: [],
  collaborating: []
});

let User = mongoose.model('User', userSchema);

module.exports = User;