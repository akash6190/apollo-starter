/* eslint consistent-return:0 */
const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const User = require('../models/User');

const localOpts = {
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true,
};

module.exports = (passport) => {
  passport.use('local-signup', new LocalStrategy(localOpts, (req, username, password, done) => {
    process.nextTick(() => {
      User.findOne({ username }, (err, user) => {
        if (err) {
          return done(err);
        }

        if (user) {
          return done(null, false, {
            signupMessage: 'That username is already taken',
          });
        }
        const newUser = new User();

        newUser.username = username;
        newUser.password = newUser.generateHash(password);
        newUser.save((e) => {
          if (e) throw e;
          return done(null, newUser);
        });
      });
    });
  }));

  passport.use('local-login', new LocalStrategy(localOpts, (req, username, password, done) => {
    process.nextTick(() => {
      User.findOne({ username }, (err, user) => {
        if (err) return done(err);

        if (!user) {
          return done(null, false, {
            loginMessage: 'No user found.',
          });
        }

        if (!user.validPassword(password)) {
          return done(null, false, {
            loginMessage: 'Oops! wrong password.',
          });
        }

        return done(null, user);
      });
    });
  }));

  const jwtOpts = {
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: process.env.SECRET,
  };

  passport.use('jwt', new JwtStrategy(jwtOpts, (payload, done) => {
    User.findOne({ _id: payload.sub }, '-password', (err, user) => {
      if (err) return done(err, false);

      return (user ? done(null, user) : done(null, false));
    });
  }));
};
