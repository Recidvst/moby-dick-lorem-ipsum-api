const express = require('express');
const router = express.Router({mergeParams: true});
const paragraphsModels = require('../models/paragraphsModel');
// encryption
const verifyToken = require('./auth');

// GET ALL MOBY ( GET )
router.get('/', verifyToken, (request, response, next) => {
  paragraphsModels.MobyParagraphModel.find( {}, function(err, paragraphs) {
    if (err) response.send(err);
    response.status(200).json(paragraphs);
  });
});
router.get('/moby-dick/', verifyToken, (request, response, next) => {
  paragraphsModels.MobyParagraphModel.find( {}, function(err, paragraphs) {
    if (err) response.send(err);
    response.status(200).json(paragraphs);
  });
});
// GET ALL ALICE ( GET )
router.get('/alice/', verifyToken, (request, response, next) => {
  paragraphsModels.AliceParagraphModel.find( {}, function(err, paragraphs) {
    if (err) response.send(err);
    response.status(200).json(paragraphs);
  });
});

// GET ONE RANDOM MOBY ( GET )
router.get('/random', verifyToken, (request, response, next) => {
  paragraphsModels.MobyParagraphModel.aggregate( [ { $sample: { size : 1} } ],
    function(err, result){
      if (err) response.status(400).send(err);
      response.status(200).json(result);
    });
});
router.get('/moby-dick/random', verifyToken, (request, response, next) => {
  paragraphsModels.MobyParagraphModel.aggregate( [ { $sample: { size : 1} } ],
    function(err, result){
      if (err) response.status(400).send(err);
      response.status(200).json(result);
    });
});
// GET ONE RANDOM ALICE ( GET )
router.get('/alice/random', verifyToken, (request, response, next) => {
  paragraphsModels.AliceParagraphModel.aggregate( [ { $sample: { size : 1} } ],
    function(err, result){
      if (err) response.status(400).send(err);
      response.status(200).json(result);
    });
});

// GET MULTIPLE RANDOM MOBY ( GET )
router.get('/random/:count', verifyToken, (request, response, next) => {
  let count = parseInt(request.params.count); // param returns string
  paragraphsModels.MobyParagraphModel.aggregate( [ { $sample: { size : count} } ],
    function(err, result){
      if (err) response.status(400).send(err);
      response.status(200).json(result);
    });
});
router.get('/moby-dick/random/:count', verifyToken, (request, response, next) => {
  let count = parseInt(request.params.count); // param returns string
  paragraphsModels.MobyParagraphModel.aggregate( [ { $sample: { size : count} } ],
    function(err, result){
      if (err) response.status(400).send(err);
      response.status(200).json(result);
    });
});
// GET MULTIPLE RANDOM ALICE ( GET )
router.get('/alice/random/:count', verifyToken, (request, response, next) => {
  let count = parseInt(request.params.count); // param returns string
  paragraphsModels.AliceParagraphModel.aggregate( [ { $sample: { size : count} } ],
    function(err, result){
      if (err) response.status(400).send(err);
      response.status(200).json(result);
    });
});

// GET ONE SPECIFIC MOBY ( GET )
router.get('/:id', verifyToken, (request, response, next) => {
  let paragraphID = request.params.id;
  paragraphsModels.MobyParagraphModel.findById( paragraphID, function(err, paragraph) {
      if (err) response.status(400).send(err);
    response.status(200).json(paragraph);
  });
});
router.get('/moby-dick/:id', verifyToken, (request, response, next) => {
  let paragraphID = request.params.id;
  paragraphsModels.MobyParagraphModel.findById( paragraphID, function(err, paragraph) {
      if (err) response.status(400).send(err);
    response.status(200).json(paragraph);
  });
});
// GET ONE SPECIFIC ALICE ( GET )
router.get('/alice/:id', verifyToken, (request, response, next) => {
  let paragraphID = request.params.id;
  paragraphsModels.AliceParagraphModel.findById( paragraphID, function(err, paragraph) {
      if (err) response.status(400).send(err);
    response.status(200).json(paragraph);
  });
});

module.exports = router;
