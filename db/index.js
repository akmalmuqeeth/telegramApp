var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost/telegramDb');

db.model('user', require('./schemas/user'));
db.model('post', require('./schemas/post'))

module.exports = db;