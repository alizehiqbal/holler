import { merge } from 'lodash';

import {
  RECEIVE_CURRENT_USER
} from '../actions/session_actions';

const _nullUser = Object.freeze({
  currentUser: null
});

const sessionReducer = (oldState = _nullUser, action) => {
  Object.freeze(oldState);
  let newState;
  switch(action.type) {
    case RECEIVE_CURRENT_USER:
      console.log("is it coming from sessionReducer", action);
      const currentUser = action.currentUser;
      newState = merge({}, { currentUser });
      return newState;
    default:
      return oldState;
  }
};

export default sessionReducer;
