// get core
const express = require('express');
// get middleware
const Sentry = require('@sentry/node');
const morgan = require('morgan')
const pretty = require('express-prettify');
const cors = require('cors')
const bodyParser = require('body-parser');
const gnuHeader = require('node-gnu-clacks');
var graphqlHTTP = require('express-graphql');
var {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLFloat,
  GraphQLNonNull,
  GraphQLError,
} = require('graphql');
const mongoose = require('mongoose');
const titlesMongoModels = require('./models/titlesModel');
const paragraphsMongoModels = require('./models/paragraphsModel');

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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(gnuHeader());

// graphql integration
const RootQueryType = new GraphQLObjectType({ // root query
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    titles: {
      type: new GraphQLList(TitleType),
      description: 'Chapter Titles',
      args: {
        book: { type: GraphQLString },
        _id: { type: GraphQLID },
      },
      resolve: (obj, args, context, info) => {
        // book must be avail if passed
        if (args.book && args.book.length > 0 && ['moby', 'moby-dick', 'alice'].indexOf(args.book) < 0) {
          throw new GraphQLError ("Book name argument must be valid and available");
        };
        // id must be right format if passed
        if (args._id && !mongoose.Types.ObjectId.isValid(args._id)) {
          throw new GraphQLError ("ID argument name must be a valid Mongoose ObjectId");
        };
        // return moby or alice
        if (args.book && args.book.toLowerCase().trim() === 'alice') {
          if (args._id) {
            return titlesMongoModels.AliceTitleModel.find( {_id: args._id} );
          }
          return titlesMongoModels.AliceTitleModel.find( {} );
        } else {
          if (args._id) {
            return titlesMongoModels.MobyTitleModel.find( {_id: args._id} );
          }
          return titlesMongoModels.MobyTitleModel.find( {} );
        }
      },
    },
    paragraphs: {
      type: new GraphQLList(ParagraphType),
      description: 'Paragraphs',
      args: {
        book: { type: GraphQLString },
        _id: { type: GraphQLID },
      },
      resolve: (obj, args, context, info) => {
        // book must be avail if passed
        if (args.book && args.book.length > 0 && ['moby', 'moby-dick', 'alice'].indexOf(args.book) < 0) {
          throw new GraphQLError ("Book name argument must be valid and available");
        };
        // id must be right format if passed
        if (args._id && !mongoose.Types.ObjectId.isValid(args._id)) {
          throw new GraphQLError ("ID argument name must be a valid Mongoose ObjectId");
        };
        // return moby or alice
        if (args.book && args.book.toLowerCase().trim() === 'alice') {
          if (args._id) {
            return paragraphsMongoModels.AliceParagraphModel.find( {_id: args._id} );
          }
          return paragraphsMongoModels.AliceParagraphModel.find( {} );
        } else {
          if (args._id) {
            return paragraphsMongoModels.MobyParagraphModel.find( {_id: args._id} );
          }
          return paragraphsMongoModels.MobyParagraphModel.find( {} );
        }
      },
    }
  })
})

// TYPES //
// titles
const TitleType = new GraphQLObjectType({
  name: 'Titles',
  description: 'Titles Type',
  fields: () => ({
    _id: {
      type: GraphQLNonNull(GraphQLID),
    },
    identifier: {
      type: GraphQLFloat,
    },
    content: {
      type: GraphQLNonNull(GraphQLString),
    }
  })
})
// titles
const ParagraphType = new GraphQLObjectType({
  name: 'Paragraphs',
  description: 'Paragraphs Type',
  fields: () => ({
    _id: {
      type: GraphQLNonNull(GraphQLID),
    },
    identifier: {
      type: GraphQLFloat,
    },
    content: {
      type: GraphQLNonNull(GraphQLString),
    }
  })
})

// schema
const schema = new GraphQLSchema({
  query: RootQueryType
})

// use graphql
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));

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
