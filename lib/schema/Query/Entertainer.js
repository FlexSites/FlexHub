let { GraphQLString, GraphQLBoolean, GraphQLObjectType, GraphQLNonNull, GraphQLList } = require('graphql');

let { hasMany, belongsToMany } = require('../../factories');

let { globalIdField } = require('graphql-relay');

// Type Registry
let { register } = require('../../registry');

// Interfaces
let { nodeInterface } = require('../Interface/Node');

// Sub-types
let { MediumQuery } = require('./Medium');
let { EventQuery } = require('./Event');
let { SocialProviderQuery } = require('./SocialProvider');

let EntertainerQuery = new GraphQLObjectType({
  name: 'Entertainer',
  fields: () => ({
    id: globalIdField('Entertainer', ({ _id }) => _id),
    name: { type: new GraphQLNonNull(GraphQLString) },
    credits: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: new GraphQLNonNull(GraphQLString) },
    verified: { type: GraphQLBoolean },
    social: { type: new GraphQLList(SocialProviderQuery) },
    media: hasMany('media', MediumQuery),
    events: belongsToMany('entertainers', EventQuery),
  }),
  interfaces: [ nodeInterface ],
});

register(EntertainerQuery);

module.exports = { EntertainerQuery };
