const express = require('express');
const router = express.Router({mergeParams: true});
const mongoose = require('mongoose');
const Paragraph = require('../models/paragraphsModel');
// mongoose.set('debug', true);
// encryption
const jwt = require('jsonwebtoken');
const verifyToken = require('./auth');

// GET ALL ( GET )
router.get('/', verifyToken, (request, response, next) => {
    mongoose.model( 'Paragraph' ).find( {}, function(err, paragraphs) {
        if (err) response.send(err);
        response.status(200).json(paragraphs);
    });
});

// GET ONE RANDOM ( GET )
router.get('/random', verifyToken, (request, response, next) => {
    Paragraph.aggregate( [ { $sample: { size : 1} } ], 
    function(err, result){ 
        if (err) response.status(400).send(err);
        response.status(200).json(result);
    });
});

// GET MULTIPLE RANDOM ( GET )
router.get('/random/:count', verifyToken, (request, response, next) => {
    let count = parseInt(request.params.count); // param returns string
    Paragraph.aggregate( [ { $sample: { size : count} } ], 
    function(err, result){ 
        if (err) response.status(400).send(err);
        response.status(200).json(result);
    });
});

// GET ONE SPECIFIC ( GET )
router.get('/:id', verifyToken, (request, response, next) => {
    let paragraphID = request.params.id;
    if ( typeof request.params.id === 'string' ) {
        paragraphID = parseInt(paragraphID);
    }
    mongoose.model( 'Paragraph' ).find( {identifier:paragraphID}, function(err, paragraph) {
        if (err) response.status(400).send(err);
        response.status(200).json(paragraph);
    });
});

module.exports = router;