var {
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
const titlesMongoModels = require('../models/titlesModel');
const paragraphsMongoModels = require('../models/paragraphsModel');
// types
const Types = require('./types.js');
// encryption
const authFuncs = require('../routes/auth');
const verifyToken = authFuncs.graphqlVerifyToken;
// valid book names
const allowedNames = ['moby', 'moby-dick', 'moby_dick', 'alice', 'alice-in-wonderland', 'alice_in_wonderland'];

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
        books: { type: new GraphQLList(GraphQLString) }, // for querying multiple
        _id: { type: GraphQLID },
        count: { type: GraphQLInt, defaultValue: 0 }, // default to zero which returns all
        random: { type: GraphQLBoolean },
      },
      resolve: (obj, args, context, info) => {
        // AUTH //
        return verifyToken(context)
        // token checked OK
        .then( () => {
          // CHECKS //
          // book must be avail if passed
          if (args.book && args.book.length > 0 && allowedNames.indexOf(args.book) < 0) {
            throw new GraphQLError ("Book name argument must be valid and available");
          };
          // books must be valid arr and avail if passed
          if (args.books && (!Array.isArray(args.books) || args.books.length < 1 || !args.books.some(r=> allowedNames.includes(r)))) {
            throw new GraphQLError ("Books must be a valid array and arguments must be valid and available");
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

          // DETERMINE RANDOM
          let random = false; // default
          if (args.random && args.random === true) {
            random = args.random;
          }

          // return moby or alice
          if ( (args.book && args.book.toLowerCase().trim().indexOf('alice') > -1) || (args.books && args.books.some(element => element.includes("alice"))) ) {
            if (args._id) {
              return titlesMongoModels.AliceTitleModel.find( {_id: args._id} );
            }
            if (random) {
              return titlesMongoModels.AliceTitleModel.aggregate( [ { $sample: { size : args.count || 1} } ]);
            } else {
              return titlesMongoModels.AliceTitleModel.find( {} ).sort({identifier: 1}).limit(args.count); // sort by identifier to show first in line not first uploaded
            }
          } else {
            if (args._id) {
              return titlesMongoModels.MobyTitleModel.find( {_id: args._id} );
            }
            if (random) {
              return titlesMongoModels.MobyTitleModel.aggregate( [ { $sample: { size : args.count || 1} } ]);
            } else {
              return titlesMongoModels.MobyTitleModel.find( {} ).sort({identifier: 1}).limit(args.count);
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
        books: { type: new GraphQLList(GraphQLString) }, // for querying multiple
        _id: { type: GraphQLID },
        count: { type: GraphQLInt, defaultValue: 0 }, // default to zero which returns all
        random: { type: GraphQLBoolean },
      },
      resolve: (obj, args, context, info) => {
        // AUTH //
        return verifyToken(context)
        // token checked OK
        .then( () => {
          // CHECKS //
          // book must be avail if passed
          if (args.book && args.book.length > 0 && allowedNames.indexOf(args.book) < 0) {
            throw new GraphQLError ("Book name argument must be valid and available");
          };
          // books must be valid arr and avail if passed
          if (args.books && (!Array.isArray(args.books) || args.books.length < 1 || !args.books.some(r=> allowedNames.includes(r)))) {
            throw new GraphQLError ("Books must be a valid array and arguments must be valid and available");
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

          // DETERMINE RANDOM
          let random = false; // default
          if (args.random && args.random === true) {
            random = args.random;
          }

          // return moby or alice
          if ( (args.book && args.book.toLowerCase().trim().indexOf('alice') > -1) || (args.books && args.books.some(element => element.includes("alice"))) ) {
            if (args._id) {
              return paragraphsMongoModels.AliceParagraphModel.find( {_id: args._id} );
            }
            if (random) {
              return paragraphsMongoModels.AliceParagraphModel.aggregate( [ { $sample: { size : args.count || 1} } ]);
            } else {
              return paragraphsMongoModels.AliceParagraphModel.find( {} ).sort({identifier: 1}).limit(args.count);
            }

          } else {
            if (args._id) {
              return paragraphsMongoModels.MobyParagraphModel.find( {_id: args._id} );
            }
            if (random) {
              return paragraphsMongoModels.MobyParagraphModel.aggregate( [ { $sample: { size : args.count || 1} } ]);
            } else {
              return paragraphsMongoModels.MobyParagraphModel.find( {identifier: { $gt: 222 }} ).sort({identifier: 1}).limit(args.count); // for moby dick paragraphs specifically start at 'Call me Ishmael' (223) instead of zero index as more artistically appropriate
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

// export query
module.exports = RootQueryType;
