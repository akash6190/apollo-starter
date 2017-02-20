const { merge } = require('lodash');
const { makeExecutableSchema, addErrorLoggingToSchema } = require('graphql-tools');

const rootSchema = [`
  type Query {
    #Hello world
    hello: String
  }

  schema {
    query: Query
  }
`];

const rootResolvers = {
  Query: {
    hello() {
      return 'Hello world! from graphql.';
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
