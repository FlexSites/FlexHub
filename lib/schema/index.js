let { graphql, GraphQLSchema } = require('graphql');
let Bluebird = require('bluebird');

let query = require('./Query/Root');
let mutation = require('./Mutation/Root');

let schema = new GraphQLSchema({
  query,
  mutation,
});

module.exports = {
  schema,
  execute(query, rootValue) {
    return Bluebird.resolve(
      graphql(schema, query, rootValue)
    );
  },
}
