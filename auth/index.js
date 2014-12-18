var passport = require('passport');
var passportLocal = require('passport-local');
var logger = require('nlogger').logger(module);
var User = require('../db').model('user');
var localStrategy = require('./strategy/local');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findOne({id: id}, function(err, doc){
    done(null, doc);
  });
});

passport.use(new passportLocal.Strategy(localStrategy));

module.exports = passport;