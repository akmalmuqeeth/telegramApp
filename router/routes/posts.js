var express = require('express')
  , router = express.Router()
  , logger = require('nlogger').logger(module)
  , post = require('../../db').model('post')
  , ensureAuthenticated = require('../../middlewares/ensureAuthentication');

// get posts
router.get('/', ensureAuthenticated, function(req, res) {
  var userId = req.query.userId;
  if (userId) {
    post.find({author: userId}, function(err, posts){
      if(err) return res.status(500).send('Error retrieving users posts');
      return res.send({posts : posts}); 
    });
  } else {
    post.find({}, function(err,posts) {
      if(err) return res.status(500).send('Error retrieving all posts');
      return res.send({posts : posts}); 
    });
  }
});

// add a post
router.post('/', ensureAuthenticated, function(req, res){
  logger.info("attempting to add post : ", req.body);
  if(req.user.id != req.body.author) {
    logger.error("unauthorized post attempt by user: ",req.user.id);
    return res.status(403).end();
  } else {
    var post = new post({author: req.body.author, body:req.body.body,  date: Date.now()});
    post.save(function(err, user){
      if(err) {
       logger.error(err);
       return res.status(500).end();
      }
      logger.info("post successfully added , post : ", post);
      return res.send({post : post});
    });
  }
});

module.exports = router;