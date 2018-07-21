import React from 'react';
import {connect} from 'react-redux';

const SearchItem = (props) => {
  let friend = props.user.friends.find(friend => friend.users_id === props.person.users_id);
  let friendBtn = null;

  if(!friend) {
    friendBtn = <button
                  onClick={() => props.addFriend(props.person.users_id, props.user.currentUser.users_id)}>
                    Add Friend
                </button>
  }

  return (
    <div>
      <p>{`${props.person.users_id} : ${props.person.name}`}</p>
      {friendBtn}
    </div>
  );
};

const mapStateToProps = state => state;

export default connect(mapStateToProps, null)(SearchItem);