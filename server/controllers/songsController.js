const Song = require('../models/Song');
const User = require('../models/User');
const Section = require('../models/Section');

const addSong = (req, res) => {
  let {name} = req.body;
  let song = new Song({title: name, user_id: req.user._id, music_key: "C", bpm: 100});
  song.save(err => {
    if(err) {
      res.send(err)
    } else {
      Song.find({user_id: req.user._id}, (err, songs) => {
        if(err) {
          res.send(err)
        } else {
          res.send(songs);
        }
      })
    }
  });
}

const getSongs = (req, res) => {
  Song.find({user_id: req.params.id}, (err, songs) => {
    if(err) {
      res.send(err)
    } else {
      res.send(songs);
    }
  });
}

const getSongById = (req, res) => {
  Song.findById(req.params.id, (err, song) => {
    if(err) {
      res.send(err);
    } else {
      Section.find({song_id: song._id}, (err, sections) => {
        song.sections = sections;
        res.send(song);
      });
    }
  });  
}

const addCollaborator = (req, res) => {
  Song.findById(req.body.song_id, (err, song) => {
    User.findById(req.body.user_id, (err, user) => {
      let {name, pic_url, _id} = user;
      song.collaborators.push({name, pic_url, _id});
      song.save();

      Section.find({song_id: song._id}, (err, sections) => {
        song.sections = sections;
        res.send(song);
      });
    })
  })
}

const removeCollaborator = (req, res) => {
  Song.findById(req.params.song_id, (err, song) => {
    let collabIndex = song.collaborators.findIndex(collaborator => collaborator._id === req.params.user_id);

    song.collaborators.splice(collabIndex, 1);
    song.save();

    res.send(song);
  });
}

const addSection = (req, res) => {
  let section = new Section({title: req.body.title, song_id: req.body.song_id, progression: "I - IV - V"});
  section.save();

  Song.findById(req.body.song_id, (err, song) => {
    if(err) {
      return res.send(err);
    }
    song.sections.push(section)
    song.save();

    Section.find({song_id: song._id}, (err, sections) => {
      song.sections = sections;
      res.send(song);
    });
  });
}

const getSectionById = (req, res) => {
  Section.findById(req.params.id, (err, section) => {
    if(err) {
      return res.send(err);
    }
    res.send(section);
  });
}

const updateSection = (req, res) => {
  console.log(req.body);
  Section.findById(req.params.section_id, (err, section) => {
    if(err) {
      return res.send(err);
    }

    clearSection(section)
      .then(section => {
        section.title = req.body.title;
        section.progression = req.body.progression;

        req.body.lyrics.forEach(lyric => {
          section.lyrics.push(lyric);
        });

        console.log(section);

        section.save();
        res.send(section);
      });
  });
}

const clearSection = section => {
  return new Promise((resolve, reject) => {
    section.title = '';
    section.progression = '';
    section.lyrics = [];

    resolve(section);
  })
}

const addUpload = (req, res) => {
  Section.findById(req.params.section_id, (err, section) => {
    if(err) {
      return res.send(err);
    }
    section.uploads.push(req.body.url);
    section.save();

    res.send(section.uploads);
  });
}

const updateSong = (req, res) => {
  let {titleEdit, keyEdit, bpmEdit} = req.body;
  Song.findById(req.params.id, (err, song) => {
    if(err) {
      return res.send(err);
    }

    song.title = titleEdit;
    song.music_key = keyEdit;
    song.bpm = bpmEdit;

    song.save();
    
    Section.find({song_id: song._id}, (err, sections) => {
      song.sections = sections;
      res.send(song);
    });
  });
}

module.exports = {
  addSong,
  getSongs,
  getSongById,
  addCollaborator,
  removeCollaborator,
  addSection,
  getSectionById,
  updateSection,
  addUpload,
  updateSong
};