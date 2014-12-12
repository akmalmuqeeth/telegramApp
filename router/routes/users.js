var express = require('express');
var router = express.Router();
var passport = require('../../auth');
var logger = require('nlogger').logger(module);
var db = require('../../db');
var userModel = db.model('user');

router.get('/',function(req,res) {
  if(req.query.operation == 'login') {
    logger.info("attempting to login");
    var authenticate = passport.authenticate('local', function(err, user, info) {
      if (err) return res.status(500).end(); 
      if (!user) return res.status(404).send(info);
      logger.info('login successful. user: ', user.makeEmberUser());   
      req.logIn(user, function(err) { 
        if (err) return res.status(500).end();
        var emberuser = user.makeEmberUser();
        return res.send({users : [emberuser]});
      });
    });
    authenticate(req, res);
  } else { //return all users
    logger.info("retrieving all users");
    userModel.find({}, function(err, users) {
      if(err) return res.status(500).end();
      var emberUsers = users.map(function(user) {
        return user.makeEmberUser();
      });
      return res.send({users : emberUsers});
    });
  }     
});

router.get('/:userId', function(req, res) {
  userModel.findOne({id : req.params.userId }, function(err, user) {
    if (err) return res.status(500).send('error getting user by id');
    return res.send({users : [user]});
  });
});

router.post('/', function(req, res) {
  logger.info("attempting to add user with req: ", req.body);
  if (req.body) {
    var user = new userModel({id:req.body.id,password:req.body.password, name: req.body.name, email : req.body.email});
    user.save(function(err, user) {
      if(err) {
        logger.error(err);
        return res.status(500).end();
      }
      logger.info("user saved successfully");
      req.logIn(user, function(err) { 
        if (err) return res.status(500).end();
          return res.send({user: user.makeEmberUser()});
        });
    });
  } else {
    logger.error("failed to add user with req: " , req.body);
    res.status(404).end();    
  }
});

module.exports = router
