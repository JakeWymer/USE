const mongoose = require('mongoose');

let sectionSchema = new mongoose.Schema({
  song_id: String,
  title: String,
  progression: String,
  lyrics: [],
  uploads: []
});

let Section = mongoose.model('Section', sectionSchema);

module.exports = Section;