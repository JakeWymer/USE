const addSong = (req, res) => {
  let {name, users_id} = req.body;
  req.app.get('db').songs.create_song([name, users_id, 'c', 100])
    .then(() => {
      req.app.get('db').songs.get_songs(users_id)
        .then(songs => {
          res.send(songs)
        })
        .catch(err => res.send(err));
    })
    .catch(err => {
      console.log(err);
      res.send(err)
    });
}

const getSongs = (req, res) => {
  req.app.get('db').songs.get_songs(req.params.id)
    .then(songs => {
      let synced = songs.map(song => {
        return req.app.get('db').songs.get_collaborators(song.songs_id)
          .then(collaborators => {
            song['collaborators'] = collaborators;
            
          })
          .catch(err => res.send(err));
      });
      Promise.all(synced).then(() => res.send(songs));
    })
    .catch(err => res.send(err));
}

const getSongById = (req, res) => {
  req.app.get('db').songs.get_song_by_id(req.params.id)
    .then(song => {
      req.app.get('db').songs.get_collaborators(req.params.id)
        .then(collaborators => {
          song[0].collaborators = collaborators;
          res.send(song)
        })
        .catch(err => res.send(err));
    })
    .catch(err => res.send(err));
}

const addCollaborator = (req, res) => {
  let {songs_id, users_id} = req.body;
  req.app.get('db').songs.add_collaborator([songs_id, users_id])
    .then(() => res.sendStatus(200))
    .catch(err => res.send(err));
}

const getCollaborators = (req, res) => {
  req.app.get('db').songs.get_collaborators(req.params.id)
    .then(collaborators => res.send(collaborators))
    .catch(err => res.send(err));
}

const removeCollaborator = (req, res) => {
  let {songs_id, users_id} = req.params;
  req.app.get('db').songs.remove_collaborator([songs_id, users_id])
    .then(() => res.sendStatus(200))
    .catch(err => res.send(err));
}

module.exports = {
  addSong,
  getSongs,
  getSongById,
  addCollaborator,
  getCollaborators,
  removeCollaborator
};