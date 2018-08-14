const express = require('express');
const router = express.Router({mergeParams: true});
const mongoose = require('mongoose');
// mongoose.set('debug', true);
// encryption
const jwt = require('jsonwebtoken');
const verifyToken = require('./auth');

// GET ALL ( GET )
router.get('/', verifyToken, (request, response, next) => {
    mongoose.model( 'Snippet' ).find( {}, function(err, snippets) {
        if (err) response.send(err);
        response.status(200).json(snippets);
    });
});

// GET ONE ( GET )
router.get('/:id', verifyToken, (request, response, next) => {
    let snippetID = decodeURI(request.params.id);
    mongoose.model( 'Snippet' ).find( {id:snippetID}, function(err, snippet) {
        console.log(snippet);
        if (err) response.send(err);
        response.status(200).json(snippet);
    });
});

module.exports = router;