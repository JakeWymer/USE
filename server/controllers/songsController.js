const addSong = (req, res) => {
  let db = req.app.get('db').songs;
  db.add_song([req.body.name, "C", 100])
    .then(song_id => {
      db.add_owner_to_song(song_id[0].song_id, req.user.user_id)
        .then(songs => res.send(songs))
        .catch(err => res.send(err));
    })
    .catch(err => res.send(err));
}

const getSongsByUser = (req, res) => {
  req.app.get('db').songs.get_songs_by_user(req.params.user_id)
    .then(songs => res.send(songs))
    .catch(err => res.send(err));
}

const getSongById = (req, res) => {
  req.app.get('db').songs.get_song_by_id(req.params.song_id)
    .then(song => res.send(song[0]))
    .catch(err => res.send(err));
}

const updateSong = (req, res) => {
  let {titleEdit, keyEdit, bpmEdit} = req.body;
  req.app.get('db').songs.update_song([req.params.song_id, titleEdit, keyEdit, bpmEdit])
    .then(song => res.send(song[0]))
    .catch(err => res.send(err));
}

const addCollaborator = (req, res) => {
  let db = req.app.get('db').songs;
  db.add_user_to_song([req.body.song_id, req.body.user_id])
    .then(song => res.send(song[0]))
    .catch(err => res.send(err));
}

const removeCollaborator = (req, res) => {
  let {song_id, user_id} = req.params;
  req.app.get('db').songs.remove_user_from_song(song_id, user_id)
    .then(song => res.send(song[0]))
    .catch(err => res.send(err));
}

module.exports = {
  addSong,
  getSongsByUser,
  getSongById,
  updateSong,
  addCollaborator,
  removeCollaborator
};