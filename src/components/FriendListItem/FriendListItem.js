import React from 'react';
import {connect} from 'react-redux';
import {deleteFriend, acceptFriend} from '../../ducks/userReducer';
import './FriendListItem.css';

const FriendListItem = (props) => {
  let button = <i className="fas fa-comment-alt fa-2x"></i>
  let collab = null;

  if(props.friend.user_two_id === props.user.currentUser.users_id) {
    if(props.friend.status === 'pending') {
      button = <button onClick={() => props.deleteFriend(props.user.currentUser.users_id, props.friend.friends_id)}>Cancel</button>;
    } 
  } else{
    if(props.friend.status === 'pending') {
      button = <button onClick={() => props.acceptFriend(props.user.currentUser.users_id, props.friend.friends_id)}>Accept</button>
    } 
  }

  if(props.page === "detail") {
    collab = <i 
              className="fas fa-plus fa-2x"
              onClick={() => props.addCollaborator(props.friend.users_id)}></i>

    if(props.collaborator) {
      collab = <i 
                className="fas fa-times fa-2x orange"
                onClick={() => props.removeCollaborator(props.friend.users_id)}></i>
    }
  }

  return (
    <div className="friend">
      <img src={props.friend.pic_url} alt=""/>
      <h2>{props.friend.name}</h2>
      {button}
      {collab}
    </div>
  );
};

const mapStateToProps = state => state;

export default connect(mapStateToProps, {deleteFriend, acceptFriend})(FriendListItem);