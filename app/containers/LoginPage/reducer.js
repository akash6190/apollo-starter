/*
 *
 * LoginPage reducer
 *
 */

import { fromJS } from 'immutable';
import { createReducer } from 'reduxsauce';
import {
  SET_FLASH_MESSAGE,
  LOGIN_SUCCESS,
  PERFORM_LOGOUT,
  PERFORM_LOGIN,
} from './constants';


const initialState = fromJS({
  flashMessages: {},
  loggingIn: false,
  token: null,
  id: null,
});

const setFlashMessage = (state, { messages }) => state.set('flashMessages', messages);

const performLogin = (state) => state.set('loggingIn', true);

const loginSuccess = (state, { token }) => state.merge({
  token,
  loggingIn: false,
});

const performLogout = (state) => state.merge({
  token: null,
  id: null,
});

export default createReducer(initialState, {
  [SET_FLASH_MESSAGE]: setFlashMessage,
  [PERFORM_LOGOUT]: performLogout,
  [PERFORM_LOGIN]: performLogin,
  [LOGIN_SUCCESS]: loginSuccess,
});
