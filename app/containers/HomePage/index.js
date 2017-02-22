import { createAsyncComponent } from 'react-async-component';
import { getInjectors } from 'utils/asyncInjectors';
import { startLoading, endLoading } from 'utils/store';

const { injectReducer, injectSagas } = getInjectors();

export default createAsyncComponent({
  resolve: () => new Promise((resolve) => {
    startLoading();
    Promise.all([
      import('./reducer'),
      import('./sagas'),
      import('./Component'),
    ]).then(([reducer, sagas, Component]) => {
      injectReducer('home', reducer.default);
      injectSagas(sagas.default);
      endLoading();
      resolve(Component);
    });
  }),
});

