var express = require('express')
  , router = express.Router()
  , passport = require('../../auth')
  , logger = require('nlogger').logger(module)
  , user = require('../../db').model('user')
  , nconf = require("../../config")
  , mailgun = require('mailgun-js')(nconf.get('mailgun'))
  , fs = require('fs')
  , handlebars = require('handlebars')
  , ensureAuthenticated = require('../../middlewares/ensureAuthentication');


// login and getAllUsers
router.get('/',function(req,res) {
  if(req.query.operation == 'login') {
    return handleLoginRequest(req, res);
  } else if(req.query.operation == 'following') {
    return getFollowingForUser(req, res);
  } else if(req.query.operation == 'followers') {
    return getFollowersForUser(req, res);
  } else {
    logger.info("retrieving all users");
    return handleGetUsersRequest(req, res);
  }
});

// follow user
router.put('/', ensureAuthenticated, function(req,res) {
  var updateCallback = function(err, updatedUser) {
    if (err) {
      return res.sendStatus(500);
    } else {
      return res.send({user : updatedUser.makeEmberUser(req.user)});
    }
  }
  if(req.query.operation == 'follow') {
    return req.user.follow(req.query.userId, updateCallback);
  } if (req.query.operation == 'unfollow') {
      return req.user.unfollow(req.query.userId, updateCallback);
  }else {
    res.status(404).end();
  }
});

// get user by id
router.get('/:userId', function(req, res) {
  user.findOne({id : req.params.userId }, function(err, user) {
    if (err) return res.status(500).send('error getting user by id');
    return res.send({users : [user.makeEmberUser(req.user)]});
  });
});

// add user
router.post('/', function(req, res) {
  logger.info("attempting to add user with req: ", req.body);
  if (req.body) {
    var userPassword = req.body.password;
    user.hashPassword(userPassword, function(err, hashedPassword) {
      if( err ){
        logger.error('Error hashing password. Error: ' ,err);
        return res.status(500).end();
      }
      var user = new user({id:req.body.id,password:hashedPassword,
       name: req.body.name, email : req.body.email});
      return saveUser(user, req, res);
    });

  } else {
    logger.error("failed to add user with req: " , req.body);
    res.status(404).end();
  }
});

// reset password
router.post('/reset-password', function(req, res) {
  if(req.body.email) {
    user.findOne({email : req.body.email }, function(err, user){
      if (err) {
        return res.status(500).send('error while fetching user by email');
      }
      user.resetPassword(function(err, newPassword){
        if (err) {
          return res.status(500).send('error while resetting user password');
        }
        sendPasswordResetEmail(newPassword, function(err){
          return res.status(200).end();
        });
      });
    });
  } else {
    return res.status(404).end();
  }
});

// logout user
router.post('/logout', ensureAuthenticated, function(req, res) {
  req.logout();
  res.status(200).end();
});

function getFollowingForUser(req,res) {
  user.findOne({id : req.query.userID}, function(err, user) {
    if(err) {
      return res.status(500).end();
    }
    if(!user.following || user.following.length == 0) {
      return res.send({followers : []});
    }
    return res.send({following : user.following});
  });
}

function getFollowersForUser(req, res){
  user.find({'following' : {$in : [req.query.userID]} }, function(err, users){
    if(err) {
      return res.status(500).end();
    }
  var followers = users.map(function(user) {
      return user.id;
    });
    return res.send({followers : followers});
  });

}

function sendPasswordResetEmail(newPassword, done) {

  fs.readFile('/Users/akmalmuqeeth/Documents/meantest/telegramApp/templates/reset.hbs', 'utf-8',function (err, data) {
    if (err) throw err;

    var template = handlebars.compile(data);

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

function handleLoginRequest(req, res) {
  logger.info("attempting to login");
    var authenticate = passport.authenticate('local', function(err, user, info) {
      if (err) return res.status(500).end();
      if (!user) return res.status(404).send(info);
      logger.info('login successful. user: ', user.makeEmberUser(req.user));
      req.logIn(user, function(err) {
        if (err) return res.status(500).end();
        var emberuser = user.makeEmberUser(req.user);
        return res.send({users : [emberuser]});
      });
    });
  authenticate(req, res);
}

function handleGetUsersRequest(req, res) {
  user.find({}, function(err, users) {
    if(err) {
      return res.status(500).end();
    }
    var emberUsers = users.map(function(user) {
      return user.makeEmberUser(req.user);
    });
    return res.send({users : emberUsers});
  });
}

function updateUser(req,res,updateData) {
  user.findByIdAndUpdate(req.user._id, updateData, function(err,updatedUser){
      if (err) {
        return res.sendStatus(500);
      } else {
        return res.send({user : updatedUser.makeEmberUser(req.user)});
      }
  });
}

function saveUser(user,req,res) {
  user.save(function(err, user){
    if(err) {
      logger.error(err);
      return res.status(500).end();
    }
    logger.info("user saved successfully");
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).end();
      }
      return res.send({user: user.makeEmberUser(req.user)});
    });
  });
}

module.exports = router;
