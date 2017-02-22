import { createAsyncComponent } from 'react-async-component';
import { startLoading, endLoading } from 'utils/store';

export default createAsyncComponent({
  resolve: () => new Promise((resolve) => {
    startLoading();
    import('./Component').then((Component) => {
      endLoading();
      resolve(Component);
    });
  }),
});

