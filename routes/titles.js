const express = require('express');
const router = express.Router({mergeParams: true});
const titlesModels = require('../models/titlesModel');
// encryption
const verifyToken = require('./auth');

// GET ALL MOBY ( GET )
router.get('/', verifyToken, (request, response, next) => {
  titlesModels.MobyTitleModel.find( {}, function(err, titles) {
    if (err) response.send(err);
    response.status(200).json(titles);
  });
});
router.get('/moby-dick/', verifyToken, (request, response, next) => {
  titlesModels.MobyTitleModel.find( {}, function(err, titles) {
    if (err) response.send(err);
    response.status(200).json(titles);
  });
});
// GET ALL ALICE ( GET )
router.get('/alice/', verifyToken, (request, response, next) => {
  titlesModels.AliceTitleModel.find( {}, function(err, titles) {
    if (err) response.send(err);
    response.status(200).json(titles);
  });
});

// GET ONE RANDOM MOBY ( GET )
router.get('/random', verifyToken, (request, response, next) => {
  titlesModels.MobyTitleModel.aggregate( [ { $sample: { size : 1} } ],
  function(err, result){
    if (err) response.status(400).send(err);
    response.status(200).json(result);
  });
});
router.get('/moby-dick/random', verifyToken, (request, response, next) => {
  titlesModels.MobyTitleModel.aggregate( [ { $sample: { size : 1} } ],
  function(err, result){
    if (err) response.status(400).send(err);
    response.status(200).json(result);
  });
});
// GET ONE RANDOM ALICE ( GET )
router.get('/alice/random', verifyToken, (request, response, next) => {
  titlesModels.AliceTitleModel.aggregate( [ { $sample: { size : 1} } ],
  function(err, result){
    if (err) response.status(400).send(err);
    response.status(200).json(result);
  });
});

// GET MULTIPLE RANDOM MOBY ( GET )
router.get('/random/:count', verifyToken, (request, response, next) => {
  let count = parseInt(request.params.count); // param returns string
  titlesModels.MobyTitleModel.aggregate( [ { $sample: { size : count} } ],
  function(err, result){
    if (err) response.status(400).send(err);
    response.status(200).json(result);
  });
});
router.get('/moby-dick/random/:count', verifyToken, (request, response, next) => {
  let count = parseInt(request.params.count); // param returns string
  titlesModels.MobyTitleModel.aggregate( [ { $sample: { size : count} } ],
  function(err, result){
    if (err) response.status(400).send(err);
    response.status(200).json(result);
  });
});
// GET MULTIPLE RANDOM ALICE ( GET )
router.get('/alice/random/:count', verifyToken, (request, response, next) => {
  let count = parseInt(request.params.count); // param returns string
  titlesModels.AliceTitleModel.aggregate( [ { $sample: { size : count} } ],
  function(err, result){
    if (err) response.status(400).send(err);
    response.status(200).json(result);
  });
});

// GET ONE SPECIFIC MOBY ( GET )
router.get('/:id', verifyToken, (request, response, next) => {
  let titleID = request.params.id;
  if ( typeof request.params.id === 'string' ) {
    titleID = parseInt(titleID);
  }
  titlesModels.MobyTitleModel.find( {_id:titleID}, function(err, title) {
    if (err) response.status(400).send(err);
    response.status(200).json(title);
  });
});
router.get('/moby-dick/:id', verifyToken, (request, response, next) => {
  let titleID = request.params.id;
  if ( typeof request.params.id === 'string' ) {
    titleID = parseInt(titleID);
  }
  titlesModels.MobyTitleModel.find( {_id:titleID}, function(err, title) {
    if (err) response.status(400).send(err);
    response.status(200).json(title);
  });
});
// GET ONE SPECIFIC ALICE ( GET )
router.get('/alice/:id', verifyToken, (request, response, next) => {
  let titleID = request.params.id;
  if ( typeof request.params.id === 'string' ) {
    titleID = parseInt(titleID);
  }
  titlesModels.AliceTitleModel.find( {_id:titleID}, function(err, title) {
    if (err) response.status(400).send(err);
    response.status(200).json(title);
  });
});

module.exports = router;
