// get mongoose to work with mongodb
const mongoose = require('mongoose');
const connections = require('../db.js');

// define a schema
const Schema = mongoose.Schema;
let paragraphSchema = new Schema({
  content: {
    type: String,
    required: 'Paragraph content is required'
  },
}, {
  timestamps: true
});

// moby dick db paragraph model
var MobyParagraphModel = connections.mobyMongooseConnection.model('Paragraph', paragraphSchema, 'paragraphs');

// alice in wonderland db paragraph model
var AliceParagraphModel = connections.aliceMongooseConnection.model('Paragraph', paragraphSchema, 'paragraphs');

// export the models for use in app
module.exports = {
  MobyParagraphModel: MobyParagraphModel,
  AliceParagraphModel: AliceParagraphModel
};
