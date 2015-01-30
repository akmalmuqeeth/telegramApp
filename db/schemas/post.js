var mongoose = require('mongoose')
  , postSchema = new mongoose.Schema ({
    author : String,
    body : String,
    date : Date
  });

module.exports = postSchema;