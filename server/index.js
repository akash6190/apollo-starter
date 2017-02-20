/* eslint consistent-return:0 */

require('dotenv').config();

const argv = require('minimist')(process.argv.slice(2));
const isDev = process.env.NODE_ENV !== 'production';
const ngrok = (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel ? require('ngrok') : false;

const resolve = require('path').resolve;
const bodyParser = require('body-parser');
const express = require('express');
const passport = require('passport');

const schema = require('./data');
const logger = require('./logger');
const setupFrontend = require('./middlewares/frontendMiddleware');
const setupAuth = require('./middlewares/auth');


const app = express();
// If you need a backend, e.g. an API, add your custom backend-specific middleware here
// app.use('/api', myApi);

// In production we need to pass these values in instead of relying on webpack
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

setupAuth(app);

const { graphqlExpress, graphiqlExpress } = require('graphql-server-express');
app.use('/graphql', passport.authenticate('jwt', { session: false }));

app.use('/graphql', graphqlExpress((req) => {
  const query = req.query.query || req.body.query;

  if (query && query.length > 2000) throw new Error('Query too large');

  return {
    schema,
    context: {
      user: req.user,
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


// Start your app.
app.listen(port, host, (err) => {
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