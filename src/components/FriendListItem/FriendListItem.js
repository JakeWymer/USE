import React from 'react';
import './FriendListItem.css';

const FriendListItem = (props) => {
  return (
    <div>
      <h2>{props.friend.name}</h2>
      <h3>{props.friend.status}</h3>
    </div>
  );
};

export default FriendListItem;