var mongoose = require('mongoose');
var nconf = require('../config');
var conn = mongoose.createConnection(nconf.get('localDatabase'));

conn.model('user', require('./schemas/user'));
conn.model('post', require('./schemas/post'))

module.exports = conn;