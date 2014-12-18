var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var userSchema = mongoose.Schema({
    id : String,
    password: String,
    name: String,
    email: String
  });

userSchema.methods.makeEmberUser = function () {
   return {username: this.id, email: this.email};
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