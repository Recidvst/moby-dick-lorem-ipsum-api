// get mongoose to work with mongodb
const mongoose = require('mongoose');
const connections = require('../db.js');

// define a schema
const Schema = mongoose.Schema;
let titleschema = new Schema({
  content: {
    type: String,
    required: 'A chapter title is required'
  },
  identifier: {
    type: Number,
  },
}, {
  timestamps: true
});

// moby dick db title model
var MobyTitleModel = connections.mobyMongooseConnection.model('Title', titleschema, 'titles');

// alice in wonderland db title model
var AliceTitleModel = connections.aliceMongooseConnection.model('Title', titleschema, 'titles');

// export the models for use in app
module.exports = {
  MobyTitleModel: MobyTitleModel,
  AliceTitleModel: AliceTitleModel
};
