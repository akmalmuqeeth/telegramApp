var express = require('express');
var app = express();

require('./middlewares')(app);
require('./router')(app);

var logger = require('nlogger').logger(module);

var database = require('./db');
database.on('error', console.error.bind(console, 'connection error:'));
database.once('open', function callback () {
  logger.info("Connected to telegramDb");
  app.listen(3000, function() {
    logger.info('Server started');
  });
});


// Route implementations




//add user
// app.post('/api/users/', function addUser(req, res) {
//   logger.info("attempting to add user with req: ", req.body);
//   if (req.body) {
//    var user = new UserModel({id:req.body.id,password:req.body.password, 
//    	name: req.body.name, email : req.body.email});
//    user.save(function(err, user){
//      if(err) {
//       logger.error(err);
//       return res.status(500).end();
//      }
//      console.log("user saved successfully");
//      //login the user
//      req.logIn(user, function(err) { 
//           if (err) { 
//             return res.status(500).end();
//           }
//           return res.send({user: user.makeEmberUser()});
//         });
//    });
//   } else {
//     logger.error("failed to add user with req: " , req.body);
//     res.status(404).end();    
//   }
// });

/* get all posts for user - if request has userId param then returns posts for
   the user */
// app.get('/api/posts/', ensureAuthenticated, function getAllPosts(req,res){
//   var userId = req.query.userId;
//   if (userId) {
//     PostModel.find({author: userId}, function(err, posts){
//       if(err) return res.status(500).send('Error retrieving users posts');
//       logger.info("retrieved user:", userId, "posts : ", posts);
//       return res.send({posts : posts}); 
//     });
//   } else { //return all posts from all users
//     PostModel.find({}, function(err, posts){
//       if(err) return res.status(500).send('Error retrieving all posts');
//       return res.send({posts : posts}); 
//     });     
//   }
// });

//add a post
// app.post('/api/post', ensureAuthenticated, function addPost(req, res){
//   logger.info("attempting to add post : ", req.body);
//   if(req.user.id != req.body.author) {
//       logger.error("unauthorized post attempt by user: ",req.user.id);
//     return res.status(403).send('you do not have permission to add post for ' +req.body.author);
//   }
//   var post = new PostModel({author: req.body.author, body:req.body.body, 
//               date: Date.now()});
//   post.save(function(err, user){
//     if(err) {
//       logger.error(err);
//       return res.status(500).end();
//      }
//      logger.info("post successfully added , post : ", post);
//      return res.send({post : post});
//   });  
// });



