var mongoose = require('mongoose');
var userSchema = mongoose.Schema(
  {
    id : String,
    password: String,
    name: String,
    email: String
  });

userSchema.methods.makeEmberUser = function () {
   return {username: this.id, email: this.email};
}

module.exports = userSchema;