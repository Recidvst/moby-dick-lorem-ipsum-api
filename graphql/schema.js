var {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLError,
} = require('graphql');
// mongoose
const mongoose = require('mongoose');
// models
const titlesMongoModels = require('./../models/titlesModel');
const paragraphsMongoModels = require('./../models/paragraphsModel');
// types
const Types = require('./types.js');
// encryption
const authFuncs = require('./../routes/auth');
const verifyToken = authFuncs.graphqlVerifyToken;

// graphql integration
const RootQueryType = new GraphQLObjectType({ // root query
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    titles: {
      type: new GraphQLList(Types.TitleType),
      description: 'Chapter Titles',
      args: {
        book: { type: GraphQLString },
        _id: { type: GraphQLID },
        count: { type: GraphQLInt },
        random: { type: GraphQLBoolean },
      },
      resolve: (obj, args, context, info) => {
        // AUTH //
        return verifyToken(context)
        // token checked OK
        .then( () => {
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
        })
        // token checked NOT OK
        .catch( (err) => {
          throw new GraphQLError (`Auth error:  ${err}`);
        })
      },
    },
    paragraphs: {
      type: new GraphQLList(Types.ParagraphType),
      description: 'Paragraphs',
      args: {
        book: { type: GraphQLString },
        _id: { type: GraphQLID },
        count: { type: GraphQLInt },
        random: { type: GraphQLBoolean },
      },
      resolve: (obj, args, context, info) => {
        // AUTH //
        return verifyToken(context)
        // token checked OK
        .then( () => {
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
        })
        // token checked NOT OK
        .catch( (err) => {
          throw new GraphQLError (`Auth error:  ${err}`);
        })
      },
    }
  })
})

// schema
const schema = new GraphQLSchema({
  query: RootQueryType
})

module.exports = schema;
