/**
 * The global state selectors
 */

import { createSelector } from 'reselect';

export const selectGlobal = (state) => state.get('global');

export const makeSelectCurrentUser = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('currentUser')
);

export const makeSelectLoading = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('loading')
);

export const makeSelectError = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('error')
);

export const makeSelectRepos = () => createSelector(
  selectGlobal,
  (globalState) => globalState.getIn(['userData', 'repositories'])
);

export const makeSelectLocationState = () => {
  let prevRoutingState;
  let prevRoutingStateJS;

  return (state) => {
    const routingState = state.get('route'); // or state.route

    if (!routingState.equals(prevRoutingState)) {
      prevRoutingState = routingState;
      prevRoutingStateJS = routingState.toJS();
    }

    return prevRoutingStateJS;
  };
};

const getRouter = (state) => state.get('router');

export const makeSelectLocation = () => createSelector(
  getRouter,
  (router) => router.get('location'),
);
// export {
//   selectGlobal,
//   makeSelectCurrentUser,
//   makeSelectLoading,
//   makeSelectError,
//   makeSelectRepos,
//   makeSelectLocationState,
// };
