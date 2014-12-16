var mongoose = require('mongoose');
var nconf = require('../config');
var db = mongoose.createConnection(nconf.get('localDatabase'));

db.model('user', require('./schemas/user'));
db.model('post', require('./schemas/post'))

module.exports = db;