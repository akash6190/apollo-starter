import 'whatwg-fetch';
import { select, call, put } from 'redux-saga/effects';
import { makeSelectToken } from 'containers/LoginPage/selectors';
import { logout } from 'containers/LoginPage/actions';


/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */
function parseJSON(response) {
  return response.json();
}

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {object}           The response data
 */
export default function* request(url, options) {
  const token = yield select(makeSelectToken());

  let headers = {};
  if (token) {
    headers = { Authorization: `JWT ${token}` };
  }

  let opts = {};
  if (options && options.headers) {
    opts = {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    };
  } else {
    opts = options;
  }

  const response = yield call(fetch, url, opts);

  if (response.status >= 200 && response.status < 300) {
    return yield call(parseJSON, response);
  }

  if (response.status === 401) {
    if (token) {
      yield put(logout());
    }
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}
