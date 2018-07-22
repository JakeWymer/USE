import axios from 'axios';

const initialState = {
  currentUser: {},
  friends: []
}

const SET_USER = 'SET_USER';
const SET_FRIENDS = 'SET_FRIENDS';
const ADD_FRIEND = 'ADD_FRIEND';
const DELETE_FRIEND = 'DELETE_FRIEND';
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

export function addFriend(user_one_id, user_two_id) {
  return {
    type: ADD_FRIEND,
    payload: axios.post('/api/friends', {user_one_id, user_two_id})
  }
}

export function deleteFriend(currentUserId, friends_id) {
  return {
    type: DELETE_FRIEND,
    payload: axios.delete(`/api/friends/${currentUserId}/${friends_id}`)
  }
}

export function acceptFriend(currentUserId, friends_id) {
  return {
    type: ACCEPT_FRIEND,
    payload: axios.put(`/api/friends/${currentUserId}/${friends_id}`)
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
        friends: action.payload.data
      }
    case `${DELETE_FRIEND}_FULFILLED`:
      return {
        ...state,
        friends: action.payload.data
      }
    case `${ACCEPT_FRIEND}_FULFILLED`:
      return {
        ...state,
        friends: action.payload.data
      }
    default:
      return state;
  }
}