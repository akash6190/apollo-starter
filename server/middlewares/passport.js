/* eslint consistent-return:0 */
const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: FBStrategy } = require('passport-facebook');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { OAuth2Strategy: GoogleStrategy } = require('passport-google-oauth');

const User = require('../models/User');

const localOpts = {
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true,
};

const getEmails = (emails) => emails.map((e) => ({
  email: e.value.toLowerCase(),
  verified: true,
}));

const setUser = (profile, accessToken, service, cb) => {
  User.where({
    'emails.email': {
      $in: profile.emails.map((e) => e.value),
    },
  }).findOne((err, user) => {
    if (err) return cb(err);
    if (user) {
      let setService = false;
      const services = user.services.map((o) => {
        if (o.provider === service && o.id === profile.id) {
          setService = true;
          return Object.assign({}, o, { accessToken });
        }
        return o;
      });

      if (!setService) {
        services.push({
          provider: service,
          id: profile.id,
          accessToken,
        });
      }

      User.findOneAndUpdate({ _id: user._id }, { // eslint-disable-line no-underscore-dangle
        $addToSet: {
          emails: {
            $each: getEmails(profile.emails),
          },
        },
        $set: { services },
      }, cb);
    } else {
      const newUser = new User();
      newUser.emails = getEmails(profile.emails);
      newUser.services = [{
        provider: service,
        id: profile.id,
        accessToken,
      }];
      newUser.save(cb);
    }
  });
};

module.exports = (passport) => {
  passport.use('local-signup', new LocalStrategy(localOpts, (req, username, password, done) => {
    // process.nextTick(() => {
    done(null, false, {
      message: 'SIGNUP_OPTION_NOT_AVAILABLE',
    });
      // User.findOne({ username }, (err) => {
      //   if (err) {
      //     return done(err);
      //   }

        // if (user) {
        //   return done(null, false, {
        //     signupMessage: 'That username is already taken',
        //   });
        // }
        // const newUser = new User();

        // newUser.username = username;
        // newUser.password = newUser.generateHash(password);
        // newUser.save((e) => {
        //   if (e) throw e;
        //   return done(null, newUser);
        // });
      // });
    // });
  }));

  passport.serializeUser((user, done) => {
    done(null, { id: user.id });
  });

  passport.deserializeUser((user, done) => {
    done(null, { id: user.id });
  });

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

  passport.use('fb-login', new FBStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `${process.env.CANONICAL_HOST}/auth/facebook/callback`,
    profileFields: ['emails', 'name', 'displayName'],
    scope: ['email', 'public_profile'],
    enableProof: true,
  }, (accessToken, refreshToken, profile, cb) => {
    process.nextTick(() => {
      if (!profile.emails) {
        cb(null, false, { message: 'FB_EMAIL_PERMISSION_REQUIRED' });
      } else {
        setUser(profile, accessToken, 'fb', cb);
      }
    });
  }));

  passport.use('google-login', new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.CANONICAL_HOST}/auth/google/callback`,
    scope: ['email', 'profile'],
  }, (accessToken, refreshToken, profile, done) => {
    process.nextTick(() => {
      if (!profile.emails) {
        done(null, false, { message: 'GOOGLE_EMAIL_PERMISSION_REQUIRED' });
      } else {
        setUser(profile, accessToken, 'google', done);
      }
    });
  }));

  const jwtOpts = {
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: process.env.SECRET,
    issuer: process.env.JWT_ISSUER,
    audience: process.env.JWT_AUDIENCE,
  };

  passport.use('jwt', new JwtStrategy(jwtOpts, (payload, done) => {
    User.findOne({ _id: payload.uid }, '-password', (err, user) => {
      if (err) return done(err, false);

      return (user ? done(null, user) : done(null, false));
    });
  }));
};
