import { takeEvery, take, call, put, fork, cancel } from 'redux-saga/effects';
import request from 'utils/request';
import { getClient } from 'utils/client';
import {
  FETCH_FLASH_MESSAGES,
  PERFORM_LOGIN,
  PERFORM_LOGOUT,
  FETCH_LOGIN_TOKEN,
  TOKEN_NAME,
} from './constants';
import {
  setFlashMessage,
  loginSuccess,
  logout as performLogout,
} from './actions';


function* makeFetchRequest() {
  try {
    // Call our request helper (see 'utils/request')
    const messages = yield call(request, '/flash');
    yield put(setFlashMessage(messages));
  } catch (e) {
    // console.log(e);
  }
}

function* fetchFlashMessages() {
  yield takeEvery(FETCH_FLASH_MESSAGES, makeFetchRequest);
}


function* fetchLoginToken() {
  while (true) { // eslint-disable-line no-constant-condition
    yield take(FETCH_LOGIN_TOKEN);
    const token = localStorage.getItem(TOKEN_NAME);

    if (token) {
      try {
        // returns user, which can be used for everything else
        yield request('/user', {
          headers: {
            Authorization: `JWT ${token}`,
          },
        });

        yield put(loginSuccess(token));
      } catch (e) {
        yield put(performLogout());
      }
    }
  }
}

function* logout() {
  return new Promise((resolve) => {
    localStorage.removeItem(TOKEN_NAME);
    getClient().resetStore();
    resolve();
  });
}

function* loginFlow(username, password, promise) {
  // Add login here
  let token = null;
  try {
    // try login check for the same using passport-jwt
    // yield put(request, '/login', 'username');
    token = 'some-token';
    // set a stringified version of our token to localstorage on our domain
    localStorage.setItem('token', token);
    yield call(promise.resolve);
  } catch (e) {
    // console.log(e);
  } finally {
    // if(yield cancelled()) {
    //   // navigate to login
    // }
  }
}

function* logoutWatcher() {
  yield takeEvery(PERFORM_LOGOUT, logout);
}

/**
 * Log in saga
 */
export function* loginWatcher() {
  // Because sagas are generators, doing `while (true)` doesn't block our program
  // Basically here we say "this saga is always listening for actions"
  while (true) { // eslint-disable-line no-constant-condition
    // And we're listening for `LOGIN_REQUEST` actions and destructuring its payload
    const { username, password, promise } = yield take(PERFORM_LOGIN);

    const flow = yield fork(loginFlow, username, password, promise);

    const action = yield take([PERFORM_LOGOUT]);

    if (action.type === PERFORM_LOGOUT) yield cancel(flow);

    yield logout();
  }
}


export default [
  fetchFlashMessages,
  loginWatcher,
  logoutWatcher,
  fetchLoginToken,
];
