// graphql
var {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLFloat,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
  GraphQLError,
} = require('graphql');

// models
const titlesMongoModels = require('../models/titlesModel');
const paragraphsMongoModels = require('../models/paragraphsModel');

// checks
const checkArgs = require('./checks.js');
// encryption
const authFuncs = require('../routes/auth');
const verifyToken = authFuncs.graphqlVerifyToken;
// valid book names
const allowedNames = ['moby', 'moby-dick', 'moby_dick', 'alice', 'alice-in-wonderland', 'alice_in_wonderland'];

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
// paragraphs
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
// books (including title and paragraph sub queries)
const BookType = new GraphQLObjectType({
  name: 'Book',
  description: 'Book Type',
  fields: () => ({
    title: {
      type: GraphQLNonNull(GraphQLID),
    },
    titles: {
      type: new GraphQLList(TitleType),
      description: 'Chapter Titles Query',
      args: {
        _id: { type: GraphQLID },
        count: { type: GraphQLInt, defaultValue: 0 }, // default to zero which returns all
        random: { type: GraphQLBoolean },
      },
      resolve: (obj, args, context, info) => {
        // AUTH //
        return verifyToken(context)
        // token checked OK
        .then( () => {
          // set book name
          const bookName = obj.title || 'moby';
          args.book = bookName;

          // CHECKS //
          checkArgs(args);

          // DETERMINE RANDOM
          let random = false; // default
          if (args.random && args.random === true) {
            random = args.random;
          }

          if ( (args.book && args.book.toLowerCase().trim().indexOf('alice') > -1) ) { // return moby or alice
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
      type: new GraphQLList(ParagraphType),
      description: 'Paragraphs Query',
      args: {
        _id: { type: GraphQLID },
        count: { type: GraphQLInt, defaultValue: 0 }, // default to zero which returns all
        random: { type: GraphQLBoolean },
      },
      resolve: (obj, args, context, info) => {
        // AUTH //
        return verifyToken(context)
        // token checked OK
        .then( () => {
          // set book name
          const bookName = obj.title || 'moby';
          args.book = bookName;

          // CHECKS //
          checkArgs(args);

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
    },
  })
})

module.exports = {
  TitleType: TitleType,
  ParagraphType: ParagraphType,
  BookType: BookType,
};
