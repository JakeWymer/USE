const passport = require('passport');

const login = passport.authenticate('auth0', { 
  successRedirect: 'http://localhost:3000/#/dashboard', 
  failureRedirect: 'http://localhost:3000/#/', connection: 'google-oauth2'
});

module.exports = {
  login
}