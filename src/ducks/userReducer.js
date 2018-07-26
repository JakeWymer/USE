import axios from 'axios';

const initialState = {
  currentUser: {},
  friends: []
}

const SET_USER = 'SET_USER';
const SET_FRIENDS = 'SET_FRIENDS';
const SEND_FRIEND_REQUEST = 'SEND_FRIEND_REQUEST';
const CANCEL_FRIEND = 'CANCEL_FRIEND';
const ACCEPT_FRIEND = 'ACCEPT_FRIEND'

export function setCurrentUser(user) {
  return {
    type: SET_USER,
    payload: user
  };
}

export function setFriends(friends) {
  return {
    type: SET_FRIENDS,
    payload: friends
  }
}

export function sendFriendRequest(friend) {
  return {
    type: SEND_FRIEND_REQUEST,
    payload: axios.post(`/api/friends/${friend.user_id}`)
  }
}

export function cancelFriend(friends_id) {
  return {
    type: CANCEL_FRIEND,
    payload: axios.delete(`/api/friends/${friends_id}`)
  }
}

export function acceptFriend(friends_id) {
  return {
    type: ACCEPT_FRIEND,
    payload: axios.put(`/api/friends/${friends_id}`)
  }
}

export default function userReducer(state = initialState, action) {
  switch(action.type) {
    case SET_USER:
      return {
        ...state,
        currentUser: action.payload
      };
    case SET_FRIENDS:
      return {
        ...state,
        friends: action.payload
      }
    case `${SEND_FRIEND_REQUEST}_FULFILLED`:
      return {
        ...state,
        friends: action.payload.data
      }
    case `${ACCEPT_FRIEND}_FULFILLED`:
      return {
        ...state,
        friends: action.payload.data
      }
    case `${CANCEL_FRIEND}_FULFILLED`:
      return {
        ...state,
        friends: action.payload.data
      }
    default:
      return state;
  }
}