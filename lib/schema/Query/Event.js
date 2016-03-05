let {
  GraphQLString,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLList,
  GraphQLObjectType,
  GraphQLNonNull,
} = require('graphql');
let { DateTimeType } = require('../../scalars');

let moment = require('moment');

let { content, hasOne, hasMany, belongsToMany } = require('../../factories');

let { globalIdField } = require('graphql-relay');

// Type Registry
let { register } = require('../../registry');

// Interfaces
let { nodeInterface } = require('../Interface/Node');

// Sub-types
let { VenueQuery } = require('./Venue');
let { MediumQuery } = require('./Medium');
let { PricingTierQuery } = require('./PricingTier');
let { ShowtimeQuery } = require('./Showtime');

let EventQuery = new GraphQLObjectType({
  name: 'Event',
  description: 'A Event Object',
  fields: () => ({
    id: globalIdField('Event', ({ _id }) => _id),
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Name of the event',
    },
    type: {
      type: new GraphQLNonNull(GraphQLString),
      default: 'general',
    },
    enabled: {
      type: GraphQLBoolean,
      description: 'Flag used to determine when the show is public',
      resolve(event) {
        return moment(event.enabled).isBefore(new Date());
      },
    },
    day_of_show: {
      type: GraphQLFloat,
      description: '"Day of show" price increase.',
    },
    door_time: {
      type: DateTimeType,
    },
    description: content('description'),
    facebook: {
      type: GraphQLString,
    },
    link: {
      type: GraphQLString,
    },
    pricing_tiers: {
      type: new GraphQLList(PricingTierQuery),
    },
    start: {
      type: DateTimeType,
    },
    end: {
      type: DateTimeType,
    },

    // Associations
    // entertainers: [{
    //   type: ObjectId,
    //   ref: 'Entertainer',
    // }],
    // showtimes: [{
    //   type: ObjectId,
    //   ref: 'Showtime',
    //   required: true,
    // }],
    // showtimes: belongsToMany('event', ShowtimeQuery),
    // venue: hasOne('venue', VenueQuery),
    // media: hasMany('media', MediumQuery),
  }),
  interfaces: [ nodeInterface ],
});

register(EventQuery);

module.exports = { EventQuery };



function getDateRange(ins) {
  if (typeof ins.showtimes[0] === 'object') {
    let shows = ins.showtimes
      .sort((a, b) => moment(a.date).isBefore(b.date));

    ins.start = shows[0].datetime;
    ins.end = shows[shows.length - 1].datetime;

    console.log('added date ranges', ins);
  }
}

function getPriceRange(ins) {

}
