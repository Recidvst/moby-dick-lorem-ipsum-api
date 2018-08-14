// get mongoose to work with mongodb
const mongoose = require('mongoose');
// define a schema
const Schema = mongoose.Schema;
let bookSchema = new Schema({
    content: {
        type: String,
        required: 'A snippet is required'
    },
}, {
    timestamps: true
});

// export the schema as a model for use in app
module.exports = mongoose.model('Snippet', bookSchema, 'Snippets'); // mongo sometimes needs the collection name specifying..