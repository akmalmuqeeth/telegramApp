var logger = require('nlogger').logger(module);
var db = require('../../db');
var userModel = db.model('user');
var bcrypt = require('bcrypt');

module.exports = function (username, password, done) {
  userModel.findOne({id : username}, function(err, user) {
    if (err) return done(err, null);
    if (!user) return done(null,null, 'user not found');

    bcrypt.compare(password, user.password, function(err, res) {
      if (res) {
      done(null, user);
      } else {
        logger.debug('authentication failed for u: ',username,' p: ',password ); 
        done(null, null, 'password not matched');
      } 
    });
    
  });  
};