const { PubSub, SubscriptionManager } = require('graphql-subscriptions');

const pubsub = new PubSub();

const configureSubscription = (schema) => new SubscriptionManager({
  schema,
  pubsub,
});


module.exports = {
  pubsub,
  configureSubscription,
};
