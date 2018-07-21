const express = require('express');
const {json} = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const massive = require('massive');
require('dotenv').config();

const userController = require('./controllers/userController');
const strategy = require(`${__dirname}/strategy.js`);

const app = express();

const port = process.env.PORT || 5000;

massive(process.env.DB_CONNECTION_STRING)
  .then(db => {
    app.set('db', db);
    app.get('db').create_users_table()
      .then(() => console.log('CREATED USERS TABLE'))
      .catch(err => console.log(err));
  })
  .catch(err => console.log(err));

app.use(json());

app.use( session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use( passport.initialize() );
app.use( passport.session());
passport.use(strategy);

passport.serializeUser((user, done) => {
  console.log(user);
  app.get('db').users.get_user_by_authid(user.id)
    .then(response => {
      if(!response[0]) {
        app.get('db').users.add_user([user.id, user._json.name, user._json.picture])
          .then(res => done(null, res[0]))
          .catch(err => done(err, null));
      } else {
        return done(null, response[0])
      }
    })
    .catch(err => done(err, null));
});

passport.deserializeUser((obj, done) => {
  done( null, obj );
});

app.get('/login', userController.login);
app.get('/logout', userController.logout);
app.get('/api/currentuser', userController.getUser);

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});