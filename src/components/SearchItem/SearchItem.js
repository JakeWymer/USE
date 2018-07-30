import React from 'react';
import {connect} from 'react-redux';
import {sendFriendRequest} from '../../ducks/userReducer';
import './SearchItem.css';

const SearchItem = (props) => {
  let friend = props.user.friends.find(friend => friend.user_id === props.person.user_id);
  let friendBtn = null;

  if(!friend) {
    friendBtn = <button
                  onClick={() => props.sendFriendRequest(props.person)}>
                    Add Friend
                </button>
  }

  return (
    <div className="search-item">
      <p>{`${props.person.user_id} : ${props.person.name}`}</p>
      {friendBtn}
    </div>
  );
};

const mapStateToProps = state => state;

export default connect(mapStateToProps, {sendFriendRequest})(SearchItem);