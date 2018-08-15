// get mongoose to work with mongodb
const mongoose = require('mongoose');
// define a schema
const Schema = mongoose.Schema;
let chapterSchema = new Schema({
    content: {
        type: String,
        required: 'A chapter title is required'
    },
}, {
    timestamps: true
});

// export the schema as a model for use in app
module.exports = mongoose.model('Chapter', chapterSchema, 'Chapters'); // mongo sometimes needs the collection name specifying..