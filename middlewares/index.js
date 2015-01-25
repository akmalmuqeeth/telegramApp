var bodyParser = require('body-parser');
var passport = require('../auth');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var nconf = require('../config');
var MongoStore = require('connect-mongostore')(expressSession);

module.exports = function (app, conn) {
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(expressSession({
    secret : nconf.get('expressSessionSecretKey'),
    store: new MongoStore({'db': 'sessions','mongooseConnection':conn}),
    resave: false,
    saveUninitialized: true
  }));
  app.use(passport.initialize());
  app.use(passport.session());
};