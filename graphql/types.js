var {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLFloat,
  GraphQLNonNull,
} = require('graphql');

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

module.exports = {
  TitleType: TitleType,
  ParagraphType: ParagraphType,
};
