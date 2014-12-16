var bodyParser = require('body-parser');
var passport = require('../auth');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');


module.exports = function (app) {
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(expressSession({
    secret : 'mySecretKey',
    resave: false,
    saveUninitialized: true
  }));
  app.use(passport.initialize());
  app.use(passport.session());
};