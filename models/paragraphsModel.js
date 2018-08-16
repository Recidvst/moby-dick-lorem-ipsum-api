// get mongoose to work with mongodb
const mongoose = require('mongoose');
// define a schema
const Schema = mongoose.Schema;
let paragraphSchema = new Schema({
    content: {
        type: String,
        required: 'Content is required'
    },
}, {
    timestamps: true
});

// export the schema as a model for use in app
module.exports = mongoose.model('Paragraph', paragraphSchema, 'paragraphs');