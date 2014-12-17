var express = require('express');
var router = express.Router();
var passport = require('../../auth');
var logger = require('nlogger').logger(module);
var bcrypt = require('bcrypt');
var db = require('../../db');
var userModel = db.model('user');
var randomstring = require("randomstring");
var nconf = require("../../config");
var mailgun = require('mailgun-js')(nconf.get('mailgun'));
var fs = require('fs');
var Handlebars = require('handlebars');


// login and getAllUsers
router.get('/',function(req,res) {
  if(req.query.operation == 'login') {
    return handleLoginRequest(req, res);
  } else { 
    logger.info("retrieving all users");
    return handleGetUsersRequest(req, res);
  }     
});

function handleLoginRequest(req, res) {
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
}

function handleGetUsersRequest(req, res) {
  userModel.find({}, function(err, users) {
    if(err) {
      return res.status(500).end();
    }
    var emberUsers = users.map(function(user) {
      return user.makeEmberUser();
    });
    return res.send({users : emberUsers});
  });
}

// get user by id
router.get('/:userId', function(req, res) {
  userModel.findOne({id : req.params.userId }, function(err, user) {
    if (err) return res.status(500).send('error getting user by id');
    return res.send({users : [user.makeEmberUser()]});
  });
});

// add user
router.post('/', function(req, res) {
  logger.info("attempting to add user with req: ", req.body);
  if (req.body) {
    var userPassword = req.body.password;
    bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(userPassword, salt, function(err, hashOfPassword) {
      var user = new userModel({id:req.body.id,password:hashOfPassword,
       name: req.body.name, email : req.body.email});
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
    });
  });

  } else {
    logger.error("failed to add user with req: " , req.body);
    res.status(404).end();    
  }
});

// reset password
router.post('/reset-password', function(req, res) {
  if(req.body.email) {
    userModel.findOne({email : req.body.email }, function(err, user){
      if (err) {
        return res.status(500).send('error while fetching user by email');
      }
      var newPassword = randomstring.generate(7);
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newPassword, salt, function(err, hashOfPassword) {
          user.password = hashOfPassword;
          userModel.findByIdAndUpdate(user._id, {$set: {password : hashOfPassword }}, function(err, updatedUser){
            if (err) { 
              return res.status(500).send('error saving user after password reset');
            } 
            sendPasswordResetEmail(newPassword, function(err){
              return res.status(200).end();
            });
          });
        });
      });
    });
  } else {
    res.status(404).end();
  }
});

function sendPasswordResetEmail(newPassword, done) {
  
  fs.readFile('/Users/akmalmuqeeth/Documents/meantest/telegramApp/templates/reset.hbs', 'utf-8',function (err, data) {
    if (err) throw err;

    var template = Handlebars.compile(data);

    var context = {password: newPassword}
    var html    = template(context);

    var mailgunData = {
    from: 'Telegram App Team <akmalmuq@gmail.com>',
    to: 'akmalmuqeeth@gmail.com',
    subject: 'Your new password',
    html: html
    };

    mailgun.messages().send(mailgunData, function (error, body) {
      done(error);
    });

  });
}

module.exports = router;
