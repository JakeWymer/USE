import axios from 'axios';

const initialState = {
  currentUser: {},
  friends: []
}

const SET_USER = 'SET_USER';
const SET_FRIENDS = 'SET_FRIENDS';
const ADD_FRIEND = 'ADD_FRIEND';
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

export function addFriend(friend) {
  return {
    type: ADD_FRIEND,
    payload: axios.post('/api/friends', {friend})
  }
}

export function cancelFriend(friends_id) {
  return {
    type: CANCEL_FRIEND,
    payload: axios.delete(`/api/requests/${friends_id}`)
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
    case `${ADD_FRIEND}_FULFILLED`:
      return {
        ...state,
        currentUser: action.payload.data
      }
    case `${CANCEL_FRIEND}_FULFILLED`:
      return {
        ...state,
        currentUser: action.payload.data
      }
    case `${ACCEPT_FRIEND}_FULFILLED`:
      return {
        ...state,
        currentUser: action.payload.data
      }
    default:
      return state;
  }
}