const passport = require('passport');
const jwt = require('jwt-simple');
const mongoose = require('mongoose');
const configPassport = require('./passport');
const blueBird = require('bluebird');

const tokenForUser = (user) =>
  jwt.encode({
    sub: user.id,
    iat: new Date().getTime(),
    username: user.username,
  }, process.env.SECRET);

module.exports = (app) => {
  mongoose.Promise = blueBird;
  mongoose.connect(process.env.MONGODB_URL);

  configPassport(passport);

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

  app.post(
    '/user',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      if (req.user) {
        res.send({
          /* eslint-disable no-underscore-dangle */
          id: req.user._id,
          username: req.user.username,
        });
      } else {
        res.send(null);
      }
    }
  );
};
