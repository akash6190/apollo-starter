/**
 * Combine all reducers in this file and export the combined reducers.
 * If we were to do this in store.js, reducers wouldn't be hot reloadable.
 */

// import { fromJS } from 'immutable';
import { combineReducers } from 'redux-immutable';
import { loadingBarReducer } from 'react-redux-loading-bar';
import { reducer as formReducer } from 'redux-form';
import ApolloClient from 'apollo-client';

import globalReducer from 'containers/App/reducer';
import languageProviderReducer from 'containers/LanguageProvider/reducer';
import login from 'containers/LoginPage/reducer';

const client = new ApolloClient();

export const getClient = () => client;

/**
 * Creates the main reducer with the asynchronously loaded ones
 */
export default function createReducer(asyncReducers) {
  return combineReducers({
    form: formReducer,
    apollo: client.reducer(),
    loadingBar: loadingBarReducer,
    global: globalReducer,
    language: languageProviderReducer,
    login,
    ...asyncReducers,
  });
}
