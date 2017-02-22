import { createAsyncComponent } from 'react-async-component';
import { getInjectors } from 'utils/asyncInjectors';

const { injectReducer, injectSagas } = getInjectors();

export default createAsyncComponent({
  resolve: () => new Promise((resolve) => {
    Promise.all([
      import('./reducer'),
      import('./sagas'),
      import('./Component'),
    ]).then(([reducer, sagas, Component]) => {
      injectReducer('home', reducer.default);
      injectSagas(sagas.default);
      resolve(Component);
    });
  }),
});

