var fs    = require('fs');
var nconf = require('nconf');
var path = require ('path');

nconf.argv()
  .env()
  .file({ file:  path.join(__dirname, 'config.json') });

nconf.set('mailgun:apiKey', 'key-3ae5767f884c3c59c9c67c3fd3b883b7');
nconf.set('mailgun:domain', 'sandboxfc9c70ad13464f21ab6a418e1bb974b8.mailgun.org');

module.exports = nconf;