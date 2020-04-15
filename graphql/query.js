var {
  GraphQLObjectType,
  GraphQLString,
} = require('graphql');

// types
const Types = require('./types.js');

// graphql integration
const RootQueryType = new GraphQLObjectType({ // root query
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    book: {
      type: Types.BookType,
      description: 'Book Query',
      args: {
        name: { type: GraphQLString },
      },
      resolve: (obj, args, context, info) => {
        return {
          title: args.name || 'No book name passed',
        };
      },
    },
  })
})

// export query
module.exports = RootQueryType;
