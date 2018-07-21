const passport = require('passport');

const login = passport.authenticate('auth0', { 
  successRedirect: 'http://localhost:3000/#/dashboard', 
  failureRedirect: 'http://localhost:3000/#/', connection: 'google-oauth2'
});

const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('http://localhost:3000/#/');
  });
};

const getUser = (req, res) => {
  if(req.user) {
    res.status(200).send(req.user);
  } else {
    res.status(500).send({message: "Please log in to continue"});
  }
}

module.exports = {
  login,
  logout,
  getUser
}