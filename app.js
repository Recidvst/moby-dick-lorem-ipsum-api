// get core
const express = require('express');
const db = require('./db');
// get middleware
const morgan = require('morgan')
const pretty = require('express-prettify');
const cors = require('cors')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// config/env
require('dotenv').config();

// declare app
const app = express();
const router = express.Router({mergeParams: true});
const port = ( process.env.NODE_ENV === 'production' ) ? process.env.PORT : 8000;

// middleware
app.use(morgan('combined'))
app.use(cors());
app.use(pretty({ always: true, spaces: 2 }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// define routes
const snippetsRouter = require('./routes/snippets');
const chaptersRouter = require('./routes/chapters');
const usersRouter = require('./routes/users');

// get routes
app.use('/snippets', snippetsRouter);
app.use('/chapters', snippetsRouter);
app.use('/users', usersRouter);
app.use('/', indexRouter);

// set the server listening
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

// error handling?
process.on('uncaughtException', function (err) {
    console.error(err);
    console.error(err.stack);
});

module.exports = app;