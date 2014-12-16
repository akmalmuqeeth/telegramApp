var bodyParser = require('body-parser');
var passport = require('../auth');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var nconf = require('../config');


module.exports = function (app) {
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(expressSession({
    secret : nconf.get('expressSessionSecretKey'),
    resave: false,
    saveUninitialized: true
  }));
  app.use(passport.initialize());
  app.use(passport.session());
};