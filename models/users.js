// get mongoose to work with mongodb
const mongoose = require('mongoose');

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

// export the schema as a model for use in app
module.exports = mongoose.model('User', userSchema, 'users');