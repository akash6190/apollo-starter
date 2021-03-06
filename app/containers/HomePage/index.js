import { createAsyncComponent } from 'react-async-component';
import { getInjectors } from 'utils/asyncInjectors';
import { startLoading, endLoading } from 'utils/store';

const { injectReducer } = getInjectors();

export default createAsyncComponent({
  resolve: () => new Promise((resolve) => {
    startLoading();
    Promise.all([
      import('./reducer'),
      // import('./sagas'),
      import('./Component'),
    ]).then(([reducer, Component]) => {
      injectReducer('home', reducer.default);
      // injectSagas(sagas.default);
      endLoading();
      resolve(Component);
    });
  }),
});

