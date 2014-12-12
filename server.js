var express = require('express');
var app = express();

require('./middlewares')(app);
require('./router')(app);

var logger = require('nlogger').logger(module);

var database = require('./db');
database.on('error', console.error.bind(console, 'connection error:'));
database.once('open', function callback () {
  logger.info("Connected to telegramDb");
  app.listen(3000, function() {
    logger.info('Server started');
  });
});