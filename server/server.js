const express = require('express');
const {json} = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const massive = require('massive');

require('dotenv').config()
;
const app = express();

const http = require('http').Server(app);
const io = require('socket.io')(http);

const userController = require('./controllers/userController');
const songsController = require('./controllers/songsController');
const sectionController = require('./controllers/sectionController');
const dictionaryController = require('./controllers/dictionaryController');
const messageController = require('./controllers/messageController')(app, http);

const strategy = require(`${__dirname}/strategy.js`);

const port = process.env.PORT || 5000;

app.use( express.static( `${__dirname}/../build` ) );

massive(process.env.POSTGRES_URI)
  .then(db => {
    app.set('db', db);
    app.get('db').build_schema()
      .then(() => console.log('SCHEMA BUILT'))
      .catch(err => console.log(err))
  })
  .catch(err => console.log(err));

app.use(json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: false,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
}));

app.use( passport.initialize() );
app.use( passport.session());
passport.use(strategy);

passport.serializeUser((user, done) => {
  db = app.get('db').users;
  db.get_user_by_auth(user.id)
    .then(result => {
      if(result[0]) {
        return done(null, result[0])
      }

      let bio = "I love U.S.E!"
      db.add_user(user.id, user._json.name, user._json.picture, bio)
        .then(newUser => {
          return done(null, newUser[0]);
        })
    })
    .catch(err => console.log(err));
});

passport.deserializeUser((obj, done) => {
  done( null, obj );
});

app.get('/login', userController.login);
app.get('/logout', userController.logout);
app.get('/api/currentuser', userController.getUser);
app.get('/api/users', userController.getUsers);
app.get('/api/users/:user_id', userController.getUserById);
app.put('/api/users/:user_id', userController.editUser);

app.get('/api/friends', userController.getFriends);
app.get('/api/friends/:user_id', userController.getFriends);
app.post('/api/friends/:to_id', userController.sendFriendRequest);
app.put('/api/friends/:friend_id', userController.acceptFriendRequest);
app.delete('/api/friends/:friend_id', userController.cancelFriendRequest);

app.post('/api/songs', songsController.addSong);
app.get('/api/songs/:user_id', songsController.getSongsByUser);
app.get('/api/song/:song_id', songsController.getSongById);
app.put('/api/song/:song_id', songsController.updateSong);
app.delete('/api/song/:song_id', songsController.deleteSong);

app.post('/api/collaborators', songsController.addCollaborator);
app.delete('/api/collaborators/:song_id/:user_id', songsController.removeCollaborator);

app.get('/api/:song_id/sections', sectionController.getSections);
app.post('/api/sections', sectionController.addSection);
app.delete('/api/:song_id/sections/:section_id', sectionController.deleteSection);
app.get('/api/sections/:section_id', sectionController.getSectionById);
app.put('/api/sections/:section_id', sectionController.updateSection);

app.get('/api/words/:word', dictionaryController.search);

const path = require('path')
app.get('*', (req, res)=>{
  res.sendFile(path.join(__dirname, '../build/index.html'));
})

http.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});