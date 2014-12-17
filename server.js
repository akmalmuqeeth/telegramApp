var express = require('express'), 
  app = express(),
  logger = require('nlogger').logger(module),
  nconf = require('./config'),
  conn = require('./db');

require('./middlewares')(app);
require('./router')(app);

conn.on('error', function(err) {
  logger.error('Error connecting to the database: ', err)
});
conn.once('open', function callback () {
  logger.info("Connected to telegramDb");
  app.listen(3000, function() {
    logger.info('Server started');
  });
});