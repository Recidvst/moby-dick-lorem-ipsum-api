const express = require('express');
const router = express.Router({mergeParams: true});
const db = require('../db');
const mongoose = require('mongoose');
const Title = require('../models/titlesModel');
// mongoose.set('debug', true);
// encryption
const jwt = require('jsonwebtoken');
const verifyToken = require('./auth');

// GET ALL ( GET )
router.get('/', verifyToken, (request, response, next) => {
    console.log('get all');
    mongoose.model( 'Title' ).find( {}, function(err, titles) {
        if (err) response.send(err);
        response.status(200).json(titles);
    });
});

// GET ONE RANDOM ( GET )
router.get('/random', verifyToken, (request, response, next) => {
    Title.aggregate( [ { $sample: { size : 1} } ], 
    function(err, result){ 
        if (err) response.status(400).send(err);
        response.status(200).json(result);
    });
});

// GET MULTIPLE RANDOM ( GET )
router.get('/random/:count', verifyToken, (request, response, next) => {
    let count = parseInt(request.params.count); // param returns string
    Title.aggregate( [ { $sample: { size : count} } ], 
    function(err, result){ 
        if (err) response.status(400).send(err);
        response.status(200).json(result);
    });
});

// GET ONE SPECIFIC ( GET )
router.get('/:id', verifyToken, (request, response, next) => {
    let titleID = request.params.id;
    if ( typeof request.params.id === 'string' ) {
        titleID = parseInt(titleID);
    }
    mongoose.model( 'Title' ).find( {identifier:titleID}, function(err, title) {
        if (err) response.status(400).send(err);
        response.status(200).json(title);
    });
});

module.exports = router;