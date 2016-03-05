let {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
} = require('graphql');

let { globalIdField } = require('graphql-relay');

// Type Registry
let { register } = require('../../registry');

// Interfaces
let { nodeInterface } = require('../Interface/Node');

// Helpers
let { DatetimeType } = require('../../scalars');

let { hasOne, belongsToMany } = require('../../factories');

// Sub-types
let { EventQuery } = require('./Event');
let { TicketQuery } = require('./Ticket');

let ShowtimeQuery = new GraphQLObjectType({
  name: 'Showtime',
  fields: () => ({
    id: globalIdField('Showtime', ({ _id }) => _id),
    datetime: {
      type: new GraphQLNonNull(GraphQLString),
    },
    // tickets: belongsToMany('showtime', TicketQuery),
    // event: hasOne('event', EventQuery),
  }),
  interfaces: [ nodeInterface ],
});

register(ShowtimeQuery);

module.exports = { ShowtimeQuery };
