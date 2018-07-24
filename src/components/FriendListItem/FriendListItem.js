import React from 'react';
import {connect} from 'react-redux';
import {cancelFriend, acceptFriend} from '../../ducks/userReducer';
import './FriendListItem.css';

const FriendListItem = (props) => {
  let button = <i className="fas fa-comment-alt fa-2x"></i>
  let collab = null;

  if(props.page === "detail") {
    collab = <i 
              className="fas fa-plus fa-2x"
              onClick={() => props.addCollaborator(props.friend._id)}></i>

    if(props.collaborator) {
      collab = <i 
                className="fas fa-times fa-2x orange"
                onClick={() => props.removeCollaborator(props.friend._id)}></i>
    }
  }

  if(props.request) {
    if(props.request.from.auth_id === props.user.currentUser.auth_id) {
      button = <button onClick={() => props.cancelFriend(props.request.to._id)}>Cancel</button>;
      return (
        <div className="friend">
          <img src={props.request.to.pic_url} alt=""/>
          <h2>{props.request.to.name}</h2>
          {button}
          {collab}
        </div>
      );
    } else {
      button = <button onClick={() => props.acceptFriend(props.request.from._id)}>Accept</button>;
      return (
        <div className="friend">
          <img src={props.request.from.pic_url} alt=""/>
          <h2>{props.request.from.name}</h2>
          {button}
          {collab}
        </div>
      );
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

export default connect(mapStateToProps, {cancelFriend, acceptFriend})(FriendListItem);