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
  GraphQLInt,
  GraphQLBoolean,
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
        count: { type: GraphQLInt },
        random: { type: GraphQLBoolean },
      },
      resolve: (obj, args, context, info) => {
        // CHECKS //
        // book must be avail if passed
        if (args.book && args.book.length > 0 && ['moby', 'moby-dick', 'moby_dick', 'alice', 'alice-in-wonderland', 'alice_in_wonderland'].indexOf(args.book) < 0) {
          throw new GraphQLError ("Book name argument must be valid and available");
        };
        // id must be right format if passed
        if (args._id && !mongoose.Types.ObjectId.isValid(args._id)) {
          throw new GraphQLError ("ID argument name must be a valid Mongoose ObjectId");
        };
        // count must be right format if passed (INT)
        if (args.count && (!Number.isInteger(args.count) || args.count < 1)) {
          throw new GraphQLError ("Count argument name must be a positive Integer");
        };
        // random must be right format if passed (BOOL)
        if (args.random && typeof args.random !== "boolean") {
          throw new GraphQLError ("Random argument name must be a Boolean");
        };

        // DETERMINE AMOUNT
        let queryAmount = 1; // default
        if (args.count) {
          queryAmount = args.count;
        }

        // DETERMINE RANDOM
        let random = false; // default
        if (args.random && args.random === true) {
          random = args.random;
        }

        // return moby or alice
        if (args.book && args.book.toLowerCase().trim() === 'alice') {
          if (args._id) {
            return titlesMongoModels.AliceTitleModel.find( {_id: args._id} );
          }
          if (random) {
            return titlesMongoModels.AliceTitleModel.aggregate( [ { $sample: { size : queryAmount} } ]);
          } else {
            return titlesMongoModels.AliceTitleModel.find( {} ).limit(queryAmount);
          }

        } else {
          if (args._id) {
            return titlesMongoModels.MobyTitleModel.find( {_id: args._id} );
          }
          if (random) {
            return titlesMongoModels.MobyTitleModel.aggregate( [ { $sample: { size : queryAmount} } ]);
          } else {
            return titlesMongoModels.MobyTitleModel.find( {} ).limit(queryAmount);
          }
        }
      },
    },
    paragraphs: {
      type: new GraphQLList(ParagraphType),
      description: 'Paragraphs',
      args: {
        book: { type: GraphQLString },
        _id: { type: GraphQLID },
        count: { type: GraphQLInt },
        random: { type: GraphQLBoolean },
      },
      resolve: (obj, args, context, info) => {
        // CHECKS //
        // book must be avail if passed
        if (args.book && args.book.length > 0 && ['moby', 'moby-dick', 'moby_dick', 'alice', 'alice-in-wonderland', 'alice_in_wonderland'].indexOf(args.book) < 0) {
          throw new GraphQLError ("Book name argument must be valid and available");
        };
        // id must be right format if passed
        if (args._id && !mongoose.Types.ObjectId.isValid(args._id)) {
          throw new GraphQLError ("ID argument name must be a valid Mongoose ObjectId");
        };
        // count must be right format if passed (INT)
        if (args.count && (!Number.isInteger(args.count) || args.count < 1)) {
          throw new GraphQLError ("Count argument name must be a positive Integer");
        };
        // random must be right format if passed (BOOL)
        if (args.random && typeof args.random !== "boolean") {
          throw new GraphQLError ("Random argument name must be a Boolean");
        };

        // DETERMINE AMOUNT
        let queryAmount = 1; // default
        if (args.count && Number.isInteger(args.count)) {
          queryAmount = args.count;
        }

        // DETERMINE RANDOM
        let random = false; // default
        if (args.random && args.random === true) {
          random = args.random;
        }

        // return moby or alice
        if (args.book && args.book.toLowerCase().trim() === 'alice') {
          if (args._id) {
            return paragraphsMongoModels.AliceParagraphModel.find( {_id: args._id} );
          }
          if (random) {
            return paragraphsMongoModels.AliceParagraphModel.aggregate( [ { $sample: { size : queryAmount} } ]);
          } else {
            return paragraphsMongoModels.AliceParagraphModel.find( {} ).limit(queryAmount);
          }

        } else {
          if (args._id) {
            return paragraphsMongoModels.MobyParagraphModel.find( {_id: args._id} );
          }
          if (random) {
            return paragraphsMongoModels.MobyParagraphModel.aggregate( [ { $sample: { size : queryAmount} } ]);
          } else {
            return paragraphsMongoModels.MobyParagraphModel.find( {} ).limit(queryAmount);
          }
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
