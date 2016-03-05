let {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLFloat,
} = require('graphql');

let { globalIdField } = require('graphql-relay');

// Type Registry
let { register } = require('../../registry');

// Interfaces
let { nodeInterface } = require('../Interface/Node');

let { ShowtimeQuery } = require('./Showtime');
let { SeatQuery } = require('./Seat');

let { hasOne } = require('../../factories');

let TicketQuery = new GraphQLObjectType({
  name: 'Ticket',
  fields: () => ({
    id: globalIdField('Ticket', ({ _id }) => _id),
    status: {
      type: new GraphQLNonNull(GraphQLString),
    },
    type: {
      type: GraphQLString,
    },
    price: {
      type: GraphQLFloat,
    },
    // seat: hasOne('seat', SeatQuery),
    // showtime: hasOne('showtime', ShowtimeQuery),
  }),
  interfaces: [ nodeInterface ],
});

register(TicketQuery);

module.exports = { TicketQuery };
