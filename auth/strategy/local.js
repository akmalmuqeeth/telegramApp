
var logger = require('nlogger').logger(module);
var db = require('../../db');
var userModel = db.model('user');

module.exports = function (username, password, done) {
  userModel.findOne({id : username}, function(err, user) {
    if(err) return done(err, null);
    if(!user) return done(null,null, 'user not found');
    if(user.password == password) {
      done(null, user);
    } else {
      logger.debug('authentication failed for u: ',username,' p: ',password ); 
      done(null, null, 'password not matched');
    } 
  });  
};