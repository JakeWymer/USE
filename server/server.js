const express = require('express');
const {json} = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');

const User = require('./models/User.js');

require('dotenv').config();

const userController = require('./controllers/userController');
const songsController = require('./controllers/songsController');

const strategy = require(`${__dirname}/strategy.js`);

const app = express();

const port = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('MONGOOOOO');
});

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
  User.findOne({ auth_id: user.id }, (err, res) => {
    if(res) {
      return done(null, res)
    } else {
      let u = new User({auth_id: user.id, name: user._json.name, pic_url: user._json.picture});
      u.save();
      return done(null, u);
    }
  });
});

passport.deserializeUser((obj, done) => {
  done( null, obj );
});

app.get('/login', userController.login);
app.get('/logout', userController.logout);
app.get('/api/currentuser', userController.getUser);
app.get('/api/users', userController.getUsers);

app.post('/api/friends', userController.addFriend);
app.delete('/api/requests/:toId', userController.cancelFriendRequest);
app.put('/api/friends/:fromId', userController.acceptFriend);

app.post('/api/songs', songsController.addSong);
app.get('/api/songs/:id', songsController.getSongs);
app.get('/api/song/:id', songsController.getSongById);

app.post('/api/collaborators', songsController.addCollaborator);
app.delete('/api/collaborators/:song_id/:user_id', songsController.removeCollaborator);

app.post('/api/sections', songsController.addSection);
app.get('/api/sections/:id', songsController.getSectionById);
app.put('/api/sections/:section_id', songsController.updateSection);
app.post('/api/sections/:section_id/uploads', songsController.addUpload);

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});