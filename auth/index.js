var passport = require('passport');
var passportLocal = require('passport-local');
var logger = require('nlogger').logger(module);

var db = require('../db');
var userModel = db.model('user');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  userModel.findOne({id: id}, function(err, doc){
    done(null, doc);
  });
});

var localStrategy = require('./strategy/local');
passport.use(new passportLocal.Strategy(localStrategy));

module.exports = passport