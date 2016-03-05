let {
  GraphQLInt,
  GraphQLString,
  GraphQLObjectType,
} = require('graphql');

module.exports.ContactQuery = new GraphQLObjectType({
  name: 'Contact',
  fields: () => ({
    phone: { type: GraphQLInt },
    email: { type: GraphQLString },
  }),
});
