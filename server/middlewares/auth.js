const passport = require('passport');
// const session = require('express-session');
// const MongoStore = require('connect-mongo')(session);
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const configPassport = require('./passport');
const blueBird = require('bluebird');
mongoose.Promise = blueBird;

const tokenForUser = (user) =>
  jwt.sign({
    uid: user._id, // eslint-disable-line no-underscore-dangle
    iat: Math.floor(Date.now() / 1000),
  }, process.env.SECRET, {
    expiresIn: '1d',
    issuer: process.env.JWT_ISSUER,
    audience: process.env.JWT_AUDIENCE,
  });

const setToken = (token) => (`
  <html>
    <head>
      <script language="javascript" type="text/javascript">
        window.opener.localStorage.setItem('apollo_starter_token', '${token}');
        window.opener.location.reload();
        window.close();
      </script>
    </head>
  </html>`
);

module.exports = (app) => {
  mongoose.connect(process.env.MONGODB_URL);

  // app.use(session({
  //   secret: process.env.SECRET,
  //   resave: true,
  //   saveUninitialized: false,
  //   store: new MongoStore({
  //     mongooseConnection: mongoose.connection,
  //   }),
  // }));

  configPassport(passport);

  app.use(passport.initialize());
  // app.use(passport.session());

  app.post(
    '/signin',
    passport.authenticate('local-login', { session: false }),
    (req, res) => {
      res.send(tokenForUser(req.user));
    }
  );

  app.post(
    '/signup',
    passport.authenticate('local-signup'),
    (req, res) => {
      res.send({
        id: req.user.id,
        username: req.user.username,
      });
    }
  );

  app.get(
    '/auth/facebook',
    passport.authenticate(
      'fb-login',
      { authType: 'rerequest' }
    )
  );

  app.get(
    '/auth/facebook/callback',
    passport.authenticate('fb-login', {
      session: false,
      failureFlash: false,
      failureRedirect: '/login',
    }), (req, res) => {
      res.send(setToken(tokenForUser(req.user)));
    }
  );

  app.get(
    '/auth/google',
    passport.authenticate('google-login')
  );

  app.get(
    '/auth/google/callback',
    passport.authenticate('google-login', {
      session: false,
      failureFlas: false,
    }),
    (req, res) => {
      res.send(setToken(tokenForUser(req.user)));
    }
  );

  app.get('/flash', (req, res) => {
    res.json({});
  });

  app.get('/user', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json(req.user);
  });

  app.post(
    '/user',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      if (req.user) {
        res.send({
          /* eslint-disable no-underscore-dangle */
          id: req.user.id,
          username: req.user.username,
        });
      } else {
        res.send(null);
      }
    }
  );

  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });
};
