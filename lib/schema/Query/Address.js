let {
  GraphQLInt,
  GraphQLString,
  GraphQLObjectType,
  GraphQLNonNull,
} = require('graphql');

module.exports.AddressQuery = new GraphQLObjectType({
  name: 'Address',
  fields: () => ({
    street: { type: new GraphQLNonNull(GraphQLString) },
    suite: { type: GraphQLString },
    city: { type: new GraphQLNonNull(GraphQLString) },
    state: { type: new GraphQLNonNull(GraphQLString) },
    zip: { type: new GraphQLNonNull(GraphQLInt) },
  }),
});
