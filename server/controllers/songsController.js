const addSong = (req, res) => {
  let {name, users_id} = req.body;
  req.app.get('db').songs.create_song([name, users_id, 'c', 100])
    .then(() => {
      req.app.get('db').songs.get_songs(users_id)
        .then(songs => {
          console.log(songs);
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
    .then(songs => {res.send(songs)})
    .catch(err => res.send(err));
}

module.exports = {
  addSong,
  getSongs
};