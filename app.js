// get core
const express = require('express');
// get middleware
const Sentry = require('@sentry/node');
const morgan = require('morgan')
const pretty = require('express-prettify');
const cors = require('cors')
const bodyParser = require('body-parser');
const gnuHeader = require('node-gnu-clacks');
const graphqlHTTP = require('express-graphql');
const graphQLRootQuery = require('./graphql/query.js');
const { GraphQLSchema } = require('graphql');

// config/env
require('dotenv').config();

// error tracking
Sentry.init({ dsn: 'https://03f680301d6c463f81cd754997f26087@sentry.io/1463713' });
Sentry.configureScope((scope) => {
  scope.setUser({"username": "moby-dick-user"});
});

// declare app
const app = express();
const router = express.Router({ mergeParams: true });
const port = (process.env.NODE_ENV === 'production') ? process.env.PORT : 3000;

// middleware
app.use(Sentry.Handlers.requestHandler());
app.use(morgan('combined'))
app.use(cors());
app.use(pretty({ always: true, spaces: 2 }));

// use graphql
const schema = new GraphQLSchema({ // schema
  query: graphQLRootQuery
})
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));

app.use(bodyParser.json()); // don't use for graphql endpoint
app.use(bodyParser.urlencoded({ extended: true }));
app.use(gnuHeader());

// define routes
const paragraphsRouter = require('./routes/paragraphs');
const titlesRouter = require('./routes/titles');
const usersRouter = require('./routes/users');
const indexRouter = require('./routes/index');

// get routes
app.use('/paragraphs', paragraphsRouter);
app.use('/titles', titlesRouter);
app.use('/users', usersRouter);
app.use('/', indexRouter);

// sentry
app.use(Sentry.Handlers.errorHandler());
app.use(function onError(err, req, res, next) {
  res.statusCode = 500;
  res.end(res.sentry + '\n');
});

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
