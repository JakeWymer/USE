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
    res.send({message: "Please log in to continue"});
  }
}

const addFriend = (req, res) => {
  let {user_one_id, user_two_id} = req.body;
  req.app.get('db').users.add_friend([user_one_id, user_two_id])
    .then(() => {
      req.app.get('db').users.get_friends(user_two_id)
        .then(friends => res.status(200).send(friends))
        .catch(err =>  res.send(err));
    })
    .catch(err => res.sendStatus(500));
}

const getFriends = (req, res) => {
  req.app.get('db').users.get_friends(parseInt(req.params.id))
    .then(friends => res.status(200).send(friends))
    .catch(err =>  res.send(err));
}

const getUsers = (req, res) => {
  req.app.get('db').users.get_users()
    .then(users => res.status(200).send(users))
    .catch(err =>  res.send(err));
}

module.exports = {
  login,
  logout,
  getUser,
  addFriend,
  getFriends,
  getUsers
}