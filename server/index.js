/* eslint consistent-return:0 */

require('dotenv').config();

const argv = require('minimist')(process.argv.slice(2));
const isDev = process.env.NODE_ENV !== 'production';
const ngrok = (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel ? require('ngrok') : false;

const resolve = require('path').resolve;
const bodyParser = require('body-parser');
const express = require('express');
// const flash = require('connect-flash');
const passport = require('passport');
const counterService = require('./services/counter');
const { createServer } = require('http');
const { SubscriptionServer } = require('subscriptions-transport-ws');

const { configureSubscription } = require('./data/subscriptions');
const schema = require('./data/schema');
const logger = require('./logger');
const setupFrontend = require('./middlewares/frontendMiddleware');
const setupAuth = require('./middlewares/auth');


const app = express();
// If you need a backend, e.g. an API, add your custom backend-specific middleware here
// app.use('/api', myApi);

// app.use(flash());
// In production we need to pass these values in instead of relying on webpack
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

setupAuth(app);

const { graphqlExpress, graphiqlExpress } = require('graphql-server-express');
// TODO:: uncomment this once jwt token is being sent with the requests
app.use('/graphql', passport.authenticate('jwt', { session: false }));

app.use('/graphql', graphqlExpress((req) => {
  const query = req.query.query || req.body.query;

  if (query && query.length > 2000) throw new Error('Query too large');

  return {
    schema,
    context: {
      user: req.user,
      counterService,
    },
  };
}));

if (isDev) {
  app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
  }));
}


setupFrontend(app, {
  outputPath: resolve(process.cwd(), 'build'),
  publicPath: '/',
});
// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost';
const port = argv.port || process.env.PORT || 3000;


const server = createServer();

server.on('request', app);
// Start your app.
server.listen(port, host, (err) => {
  if (err) {
    return logger.error(err.message);
  }

  // Connect to ngrok in dev mode
  if (ngrok) {
    ngrok.connect(port, (innerErr, url) => {
      if (innerErr) {
        return logger.error(innerErr);
      }

      logger.appStarted(port, prettyHost, url);
    });
  } else {
    logger.appStarted(port, prettyHost);
  }
});

const subsServer = new SubscriptionServer( // eslint-disable-line no-unused-vars
  { subscriptionManager: configureSubscription(schema) },
  { server }
);
