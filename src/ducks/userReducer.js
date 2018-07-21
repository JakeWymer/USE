const initialState = {
  currentUser: {}
}

const SET_USER = 'SET_USER';

export function setCurrentUser(user) {
  return {
    type: SET_USER,
    payload: user
  };
}

export default function userReducer(state = initialState, action) {
  switch(action.type) {
    case SET_USER:
      return {
        ...state,
        currentUser: action.payload
      };
    default:
      return state;
  }
}