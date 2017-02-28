import { createSelector } from 'reselect';

/**
 * Direct selector to the loginPage state domain
 */
const selectLoginPageDomain = () => (state) => state.get('login');

const makeSelectFlashMessages = () => createSelector(
  selectLoginPageDomain(),
  (loginState) => loginState.get('flashMessages')
);

const makeSelectToken = () => createSelector(
  selectLoginPageDomain(),
  (state) => state.get('token')
);

/**
 * Default selector used by LoginPage
 */

const makeSelectLoginPage = () => createSelector(
  selectLoginPageDomain(),
  (substate) => substate.toJS()
);

export default makeSelectLoginPage;
export {
  selectLoginPageDomain,
  makeSelectFlashMessages,
  makeSelectToken,
};
