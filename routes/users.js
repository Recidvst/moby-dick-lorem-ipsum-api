const express = require('express');
const router = express.Router({mergeParams: true});
const mongoose = require('mongoose');
const User = require('../models/users');
// encryption
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const verifyToken = require('./auth');
// validation
const validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};