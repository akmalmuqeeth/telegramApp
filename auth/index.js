var passport = require('passport')
  , passportLocal = require('passport-local')
  , logger = require('nlogger').logger(module)
  , user = require('../db').model('user')
  , localStrategy = require('./strategy/local');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  user.findOne({id: id}, function(err, doc){
    done(null, doc);
  });
});

passport.use(new passportLocal.Strategy(localStrategy));

module.exports = passport;