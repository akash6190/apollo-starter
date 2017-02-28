/*
 *
 * LoginPage actions
 *
 */

import {
  FETCH_FLASH_MESSAGES,
  SET_FLASH_MESSAGE,
  PERFORM_LOGIN,
  LOGIN_SUCCESS,
  PERFORM_LOGOUT,
  FETCH_LOGIN_TOKEN,
} from './constants';


export const fetchFlashMessages = () => ({
  type: FETCH_FLASH_MESSAGES,
});

export const setFlashMessage = (messages) => ({
  type: SET_FLASH_MESSAGE,
  messages,
});

export const login = (username, password, promise) => ({
  type: PERFORM_LOGIN,
  username,
  password,
  promise,
});

export const logout = () => ({
  type: PERFORM_LOGOUT,
});

export const fetchLoginToken = () => ({
  type: FETCH_LOGIN_TOKEN,
});

export const loginSuccess = (token) => ({
  type: LOGIN_SUCCESS,
  token,
});
