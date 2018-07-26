const passport = require('passport');
const User = require('../models/User');

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
    res.send({message: "Please log in to continue"});
  }
}

const getUsers = (req, res) => {
  req.app.get('db').users.get_all_users(req.user.user_id)
    .then(users => res.send(users))
    .catch(err => res.send(err));
}

const getFriends = (req, res) => {
  req.app.get('db').users.get_friends(req.user.user_id)
    .then(friends => res.send(friends))
    .catch(err => res.send(err));
}

const sendFriendRequest = (req, res) => {
  req.app.get('db').users.send_friend_request([req.params.to_id, req.user.user_id, 'pending'])
    .then(friends => res.send(friends))
    .catch(err => res.send(err));
}

const acceptFriendRequest = (req, res) => {
  req.app.get('db').users.accept_friend_request([req.user.user_id, req.params.friend_id, 'active'])
    .then(friends => res.send(friends))
    .catch(err => res.send(err));
}

const cancelFriendRequest = (req, res) => {
  req.app.get('db').users.cancel_friend_request(req.user.user_id, req.params.friend_id)
    .then(friends => res.send(friends))
    .catch(err => res.send(err));
};

module.exports = {
  login,
  logout,
  getUser,
  getUsers,
  getFriends,
  sendFriendRequest,
  cancelFriendRequest,
  acceptFriendRequest
}