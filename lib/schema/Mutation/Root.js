let { GraphQLInt, GraphQLObjectType } = require('graphql');
let { createSite, updateSite, deleteSite } = require('./Site');

module.exports = new GraphQLObjectType({
  name: 'RootMutationType',
  fields: {
    createSite,
    updateSite,
  },
});
