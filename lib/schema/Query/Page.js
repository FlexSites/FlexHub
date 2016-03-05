let {
  GraphQLString,
  GraphQLList,
  GraphQLObjectType,
  GraphQLNonNull,
} = require('graphql');

let marked = require('marked');

let { globalIdField } = require('graphql-relay');

// Type Registry
let { register } = require('../../registry');

// Interfaces
let { nodeInterface } = require('../Interface/Node');

// Sub-types
let { MediumQuery } = require('./Medium');
let { content } = require('../../factories');


let PageQuery = new GraphQLObjectType({
  name: 'Page',
  description: 'A Page Object',
  fields: () => ({
    id: globalIdField('Page', ({ _id }) => _id),
    content: content('content'),
    description: {
      type: GraphQLString,
    },
    published: {
      type: GraphQLString,
    },
    templateUrl: {
      type: GraphQLString,
    },
    title: {
      type: new GraphQLNonNull(GraphQLString),
    },
    url: {
      type: GraphQLString,
    },
    media: {
      type: new GraphQLList(MediumQuery),
      resolve(page) {
        return query('Medium', { _id: { $in: page.media } });
      },
    },
  }),

  interfaces: [ nodeInterface ],
});

register(PageQuery);

module.exports = { PageQuery };
