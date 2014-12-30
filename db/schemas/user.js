var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var randomstring = require("randomstring");
var userSchema = mongoose.Schema({
    id : String,
    password: String,
    name: String,
    email: String,
    following : []
    
    //followers : []
    // use query to fetch followers, $in
  });

userSchema.methods.makeEmberUser = function () {
   return {username: this.id, email: this.email, following: this.following};
}

userSchema.methods.checkUserPassword = function (userPassword, done) {
  bcrypt.compare(userPassword, this.password, function(err, res) {
    return done(res);
  });
}

userSchema.methods.resetPassword = function(){
  // generate new password
  var newPassword = randomstring.generate(7);
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newPassword, salt, function(err, hashOfPassword) {
      this.password = hashOfPassword;
    });
  });
}

userSchema.statics.hashPassword = function(password, done){
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(password, salt, function(err, hashedPassword){
      if (err) {
        done(err);
      }
      done(null, hashedPassword)
    });
  });
}

module.exports = userSchema;