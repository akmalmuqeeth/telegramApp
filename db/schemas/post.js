var mongoose = require('mongoose');
var postSchema = mongoose.Schema (
  {
    author : String,
    body : String,
    date : Date
  });
module.exports = postSchema;