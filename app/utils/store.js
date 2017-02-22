/**
 * Create the store with asynchronously loaded reducers
 */

import { createStore, applyMiddleware, compose } from 'redux';
import { fromJS } from 'immutable';
import { routerMiddleware, connectRouter } from 'connected-react-router/immutable';
import createSagaMiddleware from 'redux-saga';
import createHistory from 'history/createBrowserHistory';
import createReducer from '../reducers';

// Create redux store with history
// this uses the singleton browserHistory provided by react-router
// Optionally, this could be changed to leverage a created history
// e.g. `const browserHistory = useRouterHistory(createBrowserHistory)();`
const history = createHistory();
const initialState = {};

const sagaMiddleware = createSagaMiddleware();

// Create the store with two middlewares
// 1. sagaMiddleware: Makes redux-sagas work
// 2. routerMiddleware: Syncs the location/URL path to the state
const middlewares = [
  sagaMiddleware,
  routerMiddleware(history),
];

const enhancers = [
  applyMiddleware(...middlewares),
];

// If Redux DevTools Extension is installed use it, otherwise use Redux compose
/* eslint-disable no-underscore-dangle */
const composeEnhancers =
  process.env.NODE_ENV !== 'production' &&
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose;
/* eslint-enable */

const store = createStore(
  connectRouter(history)(createReducer()),
  fromJS(initialState),
  composeEnhancers(...enhancers)
);

// Extensions
store.runSaga = sagaMiddleware.run;
store.asyncReducers = {}; // Async reducer registry

// Make reducers hot reloadable, see http://mxs.is/googmo
/* istanbul ignore next */
if (module.hot) {
  module.hot.accept('../reducers', () => {
    import('../reducers').then((reducerModule) => {
      const createReducers = reducerModule.default;
      const nextReducers = createReducers(store.asyncReducers);

      store.replaceReducer(connectRouter(history)(nextReducers));
    });
  });
}

export const getHistory = () => history;
export const getStore = () => store;
