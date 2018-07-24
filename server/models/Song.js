const mongoose = require('mongoose');

let songSchema = new mongoose.Schema({
  user_id: String,
  title: String,
  music_key: String,
  bpm: Number,
  collaborators: [],
  sections: []
});

let Song = mongoose.model('Song', songSchema);

module.exports = Song;