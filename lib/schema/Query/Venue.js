// GraphQL Types
let {
  GraphQLString,
  GraphQLFloat,
  GraphQLObjectType,
  GraphQLNonNull,
} = require('graphql');

let { globalIdField } = require('graphql-relay');

// Type Registry
let { register } = require('../../registry');

// Interfaces
let { nodeInterface } = require('../Interface/Node');

// Helpers
// let { slugify } = require('../lib/string-util');
let { content, belongsToMany, hasMany } = require('../../factories');



// Sub-types
let { AddressQuery } = require('./Address');
let { ContactQuery } = require('./Contact');
let { SectionQuery } = require('./Section');
let { MediumQuery } = require('./Medium');
let { EventQuery } = require('./Event');
let { SocialProviderQuery } = require('./SocialProvider');

let parent = belongsToMany.bind(this, 'venue');

let VenueQuery = new GraphQLObjectType({
  name: 'Venue',
  fields: () => ({
    id: globalIdField('Site', ({ _id }) => _id),
    name: { type: new GraphQLNonNull(GraphQLString) },
    shortName: { type: new GraphQLNonNull(GraphQLString) },
    address: { type: AddressQuery },
    contact: { type: ContactQuery },
    geo: { type: GraphQLFloat },
    brand: { type: GraphQLString },
    description: content('description'),
    identifier: {
      type: GraphQLString,
      resolve: (venue) => slugify(venue.address.city),
    },
    social: {
      type: SocialProviderQuery,
    },
    sections: parent(SectionQuery),
    events: parent(EventQuery),
    media: hasMany('media', MediumQuery),
  }),
  interfaces: [ nodeInterface ],
});

register(VenueQuery);

export { VenueQuery };
