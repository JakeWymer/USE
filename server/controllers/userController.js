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

const addFriend = (req, res) => {
  User.findOne({_id: req.user._id}, (err, user) => {
    if(err) {
      res.send(err)
    } else {
      User.findOne({_id: req.body.friend._id}, (err, friend) => {
        if(err) {
          return res.send(err);
        }

        let request = {from: req.user, to: req.body.friend};
        user.requests.push(request);
        friend.requests.push(request);

        user.save();
        friend.save()
        
        res.send(user);
      });
    }
  });
}

const getUsers = (req, res) => {
  User.find({}, (err, users) => {
    if(err) {
      res.send(err);
    } else {
      res.send(users);
    }
  })
}

const cancelFriendRequest = (req, res) => {
  User.findOne({auth_id: req.user.auth_id}, (err, user) => {
    let newFriendIndex = user.requests.findIndex(request => request.to._id === req.params.toId);
    user.requests.splice(newFriendIndex, 1);
    user.save();

    User.findById(req.params.toId, (err, toUser) => {
      let fromIndex = toUser.requests.findIndex(request => request.from._id === req.user._id);
      toUser.requests.splice(fromIndex, 1);
  
      toUser.save();
      res.send(user);
    });
  });
};

const acceptFriend = (req, res) => {
  User.findOne({auth_id: req.user.auth_id}, (err, user) => {
    let newFriendIndex = user.requests.findIndex(request => request.from._id === req.params.fromId);
    let friend = user.requests[newFriendIndex].from;
    friend.friends = []
    user.friends.push(friend);
    user.requests.splice(newFriendIndex, 1);
    user.save();

    User.findById(req.params.fromId, (err, fromUser) => {
      let toIndex = fromUser.requests.findIndex(request => request.to._id === req.user._id);
      let toUser = fromUser.requests[toIndex].to;
      toUser.friends = [];

      fromUser.friends.push(toUser);
      fromUser.requests.splice(toIndex, 1);
  
      fromUser.save();
      res.send(user);
    });
  });
}

module.exports = {
  login,
  logout,
  getUser,
  addFriend,
  getUsers,
  cancelFriendRequest,
  acceptFriend
}