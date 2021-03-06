/*
 * AppReducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true);
 */

import { fromJS } from 'immutable';
import { createReducer } from 'reduxsauce';

import {
  TOGGLE_DRAWER,
} from './constants';

// The initial state of the App
const initialState = fromJS({
  loading: false,
  error: false,
  currentUser: false,
  drawer: false,
});

const toggleDrawer = (state) => state.set('drawer', !state.get('drawer'));

export default createReducer(initialState, {
  [TOGGLE_DRAWER]: toggleDrawer,
});
