var bodyParser = require('body-parser')
  , passport = require('../auth')
  , cookieParser = require('cookie-parser')
  , expressSession = require('express-session')
  , nconf = require('../config')
  , MongoStore = require('connect-mongostore')(expressSession);

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