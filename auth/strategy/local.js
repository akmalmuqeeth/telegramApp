var logger = require('nlogger').logger(module);
var db = require('../../db');
var userModel = db.model('user');

module.exports = function (username, password, done) {
  userModel.findOne({id : username}, function(err, user) {
    if (err) {
      logger.error('Error finding user with id: ', username, ' Err: ', err);
      return done(err);
    }
    if (!user) { 
      return done(null,null, 'user not found');
    }

    return user.checkUserPassword(password, function(res){
      if (res) {
        return done(null, user);
      } else  {
        return done(null, null, 'password not matched');
      }
    });
  });  
};