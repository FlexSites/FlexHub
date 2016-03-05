let {
  GraphQLString,
  GraphQLObjectType,
} = require('graphql');

let { globalIdField } = require('graphql-relay');

// Type Registry
let { register } = require('../../registry');

// Interfaces
let { nodeInterface } = require('../Interface/Node');

// Sub-types
let { SeatQuery } = require('./Seat');


let SectionQuery = new GraphQLObjectType({
  name: 'Section',
  fields: () => ({
    id: globalIdField('Section', ({ _id }) => _id),
    type: {
      type: GraphQLString,
    },
    name: {
      type: GraphQLString,
    },
    color: {
      type: GraphQLString,
    },
    seat: {
      type: SeatQuery,
      resolve: (section) => query('Seat', { section: section.id }),
    },
  }),
  interfaces: [ nodeInterface ],
});

register(SectionQuery);

module.exports = { SectionQuery };
