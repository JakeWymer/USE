import React from 'react';
import {connect} from 'react-redux';
import {addFriend} from '../../ducks/userReducer';

const SearchItem = (props) => {
  let friend = props.user.currentUser.friends.find(friend => friend._id === props.person._id);
  let friendBtn = null;

  if(!friend) {
    friendBtn = <button
                  onClick={() => props.addFriend(props.person)}>
                    Add Friend
                </button>
  }

  return (
    <div>
      <p>{`${props.person._id} : ${props.person.name}`}</p>
      {friendBtn}
    </div>
  );
};

const mapStateToProps = state => state;

export default connect(mapStateToProps, {addFriend})(SearchItem);