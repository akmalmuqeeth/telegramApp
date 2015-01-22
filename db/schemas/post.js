var mongoose = require('mongoose');
var postSchema = new mongoose.Schema ({
    author : String,
    body : String,
    date : Date
  });
module.exports = postSchema;