import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {cancelFriend, acceptFriend} from '../../ducks/userReducer';
import './FriendListItem.css';

const FriendListItem = (props) => {
  let button = <Link to={`/chat/${props.friend.friend_id}`}><i className="fas fa-comment-alt fa-2x"></i></Link>
  let collab = null;

  if(props.page === "detail") {
    collab = <i 
              className="fas fa-plus fa-2x"
              onClick={() => props.addCollaborator(props.friend.user_id)}></i>

    if(props.collaborator) {
      collab = <i 
                className="fas fa-times fa-2x orange"
                onClick={() => props.removeCollaborator(props.friend.user_id)}></i>
    }
  }

  if(props.friend.status === 'pending') {
    if(props.friend.from_user === props.user.currentUser.user_id) {
      button = <button onClick={() => props.cancelFriend(props.friend.friend_id)}>Cancel</button>;
    } else {
      button = (
        <div className="option-buttons">
          <button onClick={() => props.acceptFriend(props.friend.friend_id)}>Accept</button>
          <button onClick={() => props.cancelFriend(props.friend.friend_id)}>Decline</button>
        </div>
      );
    }
  }

  return (
    <div className="friend">
      <img src={props.friend.pic_url} alt=""/>
      <Link to={`/profile/${props.friend.user_id}`}><h2>{props.friend.name}</h2></Link>
      {button}
      {collab}
    </div>
  );
};

const mapStateToProps = state => state;

export default connect(mapStateToProps, {cancelFriend, acceptFriend})(FriendListItem);