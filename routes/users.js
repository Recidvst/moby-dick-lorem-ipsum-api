const express = require('express');
const router = express.Router({mergeParams: true});
const mongoose = require('mongoose');
const User = require('../models/usersModel');
// encryption
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const verifyToken = require('./auth');
// validation
const validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

// CREATE USER ( POST )
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
                User.findOne({email: req.body.email}, function(err, foundUser) {
                    if ( !foundUser ) {

                        if ( !validateEmail( req.body.email ) ) {
                            res.status(500).json({
                                error: "Please provide a valid email"
                            });
                        }
                        // create
                        mongoose.model( 'User' ).create( {
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

 // SIGN IN USER (POST)
 router.post('/signin', (req, res, next) => {
    User.findOne({email: req.body.email})
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
    });;
 });
 
 // GET ALL USERS ( GET )
router.get('/', verifyToken, (request, response, next) => {
    mongoose.model( 'User' ).find( {}, function(err, users) {
        if (err) response.send(err);
        response.status(200).json(users);
    });
});
 
 module.exports = router;