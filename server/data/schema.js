const { merge } = require('lodash');
const { makeExecutableSchema, addErrorLoggingToSchema } = require('graphql-tools');

const { pubsub } = require('./subscriptions');

const rootSchema = [`
  # Database counter
  type Count {
    # Current amount
    amount: Int!
  }

  type Query {
    #Hello world
    hello: String
    # Counter
    count: Count
  }

  type Mutation{
    # Increase counter value, returns current counter amount
    addCount(
      # Amount to add
      amount: Int!
    ): Count
  }

  type Subscription {
    # Subscriptions fired when anyone increases counter
    countUpdated: Count
  }

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`];

const rootResolvers = {
  Query: {
    hello() {
      return 'Hello world! from graphql.';
    },
    count(doc, args, ctx) {
      return ctx.counterService.getCount();
    },
  },

  Mutation: {
    addCount(doc, { amount }, { counterService }) {
      return counterService
        .addCount(amount)
        .then(() => counterService.getCount())
        .then((count) => {
          pubsub.publish('countUpdated', count);
          return count;
        });
    },
  },

  Subscription: {
    countUpdated(amount) {
      return amount;
    },
  },
};


const schema = [...rootSchema];
const resolvers = merge(rootResolvers);

const execSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers,
});

addErrorLoggingToSchema(execSchema, {
  /* eslint-disable no-console */
  log: (m) => console.log(m),
});

module.exports = execSchema;
