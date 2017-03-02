import ApolloClient, { createBatchingNetworkInterface } from 'apollo-client';
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';

const networkInterface = createBatchingNetworkInterface({
  uri: '/graphql',
  batchInterval: 10,
});

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
