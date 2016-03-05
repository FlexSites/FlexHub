let { GraphQLNonNull, GraphQLString, GraphQLObjectType } = require('graphql');

let { globalIdField } = require('graphql-relay');

// Type Registry
let { register } = require('../../registry');

// Interfaces
let { nodeInterface } = require('../Interface/Node');

// Sub-types
let SectionQuery = require('./Section');

console.log('sectionquery', SectionQuery);

let SeatQuery = new GraphQLObjectType({
  name: 'Seat',
  fields: () => ({
    id: globalIdField('Seat', ({ _id }) => _id),
    row: {
      type: new GraphQLNonNull(GraphQLString),
    },
    number: {
      type: new GraphQLNonNull(GraphQLString),
    },
    // section: {
    //   type: SectionQuery,
    // },
  }),
  interfaces: [ nodeInterface ],
});

register(SeatQuery);

module.exports = { SeatQuery };
