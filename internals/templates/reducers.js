/**
 * Combine all reducers in this file and export the combined reducers.
 * If we were to do this in store.js, reducers wouldn't be hot reloadable.
 */

import { combineReducers } from 'redux-immutable';
import { loadingBarReducer } from 'react-redux-loading-bar';

import languageProviderReducer from 'containers/LanguageProvider/reducer';

/**
 * Creates the main reducer with the asynchronously loaded ones
 */
export default function createReducer(asyncReducers) {
  return combineReducers({
    loadingBar: loadingBarReducer,
    language: languageProviderReducer,
    ...asyncReducers,
  });
}
