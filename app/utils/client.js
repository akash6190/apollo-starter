import ApolloClient, { createBatchingNetworkInterface } from 'apollo-client';
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';
import { TOKEN_NAME } from 'containers/LoginPage/constants';

const networkInterface = createBatchingNetworkInterface({
  uri: '/graphql',
  batchInterval: 10,
});

networkInterface.use([{
  applyBatchMiddleware(req, next) {
    const headers = req.options.headers || {};

    // get the authentication token from local storage if it exists
    const token = localStorage.getItem(TOKEN_NAME);
    headers.authorization = token ? `JWT ${token}` : null;
    req.options.headers = headers; // eslint-disable-line no-param-reassign

    next();
  },
}]);

//  TODO:: add a error object for unauthorized access
// networkInterface.useAfter([{
//   applyBatchAfterware(res, next) {
//     console.log(res);
//     next();
//   },
// }]);

const wsClient = new SubscriptionClient(`ws://${location.host}/`, {
  reconnect: true,
});

const networkInterfaceWithSubs = addGraphQLSubscriptions(networkInterface, wsClient);

const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubs,
  queryDeduplication: true,
});

export const getClient = () => client;

export const getWSClient = () => wsClient;
