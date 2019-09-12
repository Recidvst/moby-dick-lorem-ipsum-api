const express = require('express');
const router = express.Router({mergeParams: true});
const mongoose = require('mongoose');
const UserModels = require('../models/usersModel');
// encryption
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const verifyToken = require('./auth');
// validation
const validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

// CREATE USER (MOBY) ( POST )
router.post('/signup', (req, res) => {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(req.body.password, salt, (err, hash) => {
      // hash worked?
      if(err) {
        return res.status(500).json({
        error: err + ' | password not present or badly formed'
        });
      }
      else {
        // does the email already exist?
        UserModels.MobyUserModel.findOne({email: req.body.email}, function(err, foundUser) {
          if ( !foundUser ) {
            if ( !validateEmail( req.body.email ) ) {
              res.status(500).json({
                error: "Please provide a valid email"
              });
            }
            // create
            UserModels.MobyUserModel.create( {
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            }, (err, user) => {
              if (err) res.send(err);
              res.status(200).send(user);
            });
          }
          else {
            res.status(500).json({
              error: "This email has already been registered"
            });
          }
        });
      }
    });
  });
});
router.post('/moby-dick/signup', (req, res) => {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(req.body.password, salt, (err, hash) => {
      // hash worked?
      if(err) {
        return res.status(500).json({
        error: err + ' | password not present or badly formed'
        });
      }
      else {
        // does the email already exist?
        UserModels.MobyUserModel.findOne({email: req.body.email}, function(err, foundUser) {
          if ( !foundUser ) {
            if ( !validateEmail( req.body.email ) ) {
              res.status(500).json({
                error: "Please provide a valid email"
              });
            }
            // create
            UserModels.MobyUserModel.create( {
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            }, (err, user) => {
              if (err) res.send(err);
              res.status(200).send(user);
            });
          }
          else {
            res.status(500).json({
              error: "This email has already been registered"
            });
          }
        });
      }
    });
  });
});
// CREATE USER (ALICE) ( POST )
router.post('/alice/signup', (req, res) => {
   bcrypt.genSalt(10, function(err, salt) {
     bcrypt.hash(req.body.password, salt, (err, hash) => {
       // hash worked?
       if(err) {
         return res.status(500).json({
         error: err + ' | password not present or badly formed'
         });
       }
       else {
         // does the email already exist?
         UserModels.AliceUserModel.findOne({email: req.body.email}, function(err, foundUser) {
           if ( !foundUser ) {
             if ( !validateEmail( req.body.email ) ) {
               res.status(500).json({
                 error: "Please provide a valid email"
               });
             }
             // create
             UserModels.AliceUserModel.create( {
               _id: new mongoose.Types.ObjectId(),
               email: req.body.email,
               password: hash
             }, (err, user) => {
               if (err) res.send(err);
               res.status(200).send(user);
             });
           }
           else {
             res.status(500).json({
               error: "This email has already been registered"
             });
           }
         });
       }
     });
   });
});

// SIGN IN USER (MOBY) (POST)
router.post('/signin', (req, res, next) => {
  UserModels.MobyUserModel.findOne({email: req.body.email})
  .then( (user) => {
    bcrypt.compare(req.body.password, user.password, function(err, result) {
      if (err) {
        return res.status(401).json({
        failed: 'Unauthorized Access'
        });
      }
      // login and pass back JWT
      if (result) {
        const JWTToken = jwt.sign({
          email: user.email,
          _id: user._id
        },
        process.env.JWT_ENCRYPTION || 'secret');
        return res.status(200).json({
          success: 'Welcome to the Moby Dick Lorem Ipsum API',
          token: JWTToken
        });
      }
      return res.status(401).json({
        failed: 'Unauthorized Access'
      });
    });
  })
  .catch(error => {
    res.status(500).json({
    error: error
    });
  });
});
router.post('/moby-dick/signin', (req, res, next) => {
  UserModels.MobyUserModel.findOne({email: req.body.email})
  .then( (user) => {
    bcrypt.compare(req.body.password, user.password, function(err, result) {
      if (err) {
        return res.status(401).json({
        failed: 'Unauthorized Access'
        });
      }
      // login and pass back JWT
      if (result) {
        const JWTToken = jwt.sign({
          email: user.email,
          _id: user._id
        },
        process.env.JWT_ENCRYPTION || 'secret');
        return res.status(200).json({
          success: 'Welcome to the Moby Dick Lorem Ipsum API',
          token: JWTToken
        });
      }
      return res.status(401).json({
        failed: 'Unauthorized Access'
      });
    });
  })
  .catch(error => {
    res.status(500).json({
    error: error
    });
  });
});
// SIGN IN USER (ALICE) (POST)
router.post('/alice/signin', (req, res, next) => {
  UserModels.AliceUserModel.findOne({email: req.body.email})
  .then( (user) => {
    bcrypt.compare(req.body.password, user.password, function(err, result) {
      if (err) {
        return res.status(401).json({
        failed: 'Unauthorized Access'
        });
      }
      // login and pass back JWT
      if (result) {
        const JWTToken = jwt.sign({
          email: user.email,
          _id: user._id
        },
        process.env.JWT_ENCRYPTION || 'secret');
        return res.status(200).json({
          success: 'Welcome to the Moby Dick Lorem Ipsum API',
          token: JWTToken
        });
      }
      return res.status(401).json({
        failed: 'Unauthorized Access'
      });
    });
  })
  .catch(error => {
    res.status(500).json({
    error: error
    });
  });
});

// GET ALL USERS (MOBY) ( GET )
router.get('/', verifyToken, (request, response, next) => {
  UserModels.MobyUserModel.find( {}, function(err, users) {
    if (err) response.send(err);
    response.status(200).json(users);
  });
});
router.get('/moby-dick/', verifyToken, (request, response, next) => {
  UserModels.MobyUserModel.find( {}, function(err, users) {
    if (err) response.send(err);
    response.status(200).json(users);
  });
});
// GET ALL USERS (ALICE) ( GET )
router.get('/alice/', verifyToken, (request, response, next) => {
 UserModels.AliceUserModel.find( {}, function(err, users) {
   if (err) response.send(err);
   response.status(200).json(users);
 });
});

module.exports = router;
