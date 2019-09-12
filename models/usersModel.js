// get mongoose to work with mongodb
const mongoose = require('mongoose');
const connections = require('../db.js');

// define a schema
const Schema = mongoose.Schema;
let userSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: {
    type: String,
    required: [true, 'Please provide a valid email.'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
  }
}, {
  timestamps: true
});

// moby dick db user model
var MobyUserModel = connections.mobyMongooseConnection.model('User', userSchema, 'users');

// alice in wonderland db user model
var AliceUserModel = connections.aliceMongooseConnection.model('User', userSchema, 'users');

// export the models for use in app
module.exports = {
  MobyUserModel: MobyUserModel,
  AliceUserModel: AliceUserModel
};
