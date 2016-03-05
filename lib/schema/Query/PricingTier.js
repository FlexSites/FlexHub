let {
  GraphQLString,
  GraphQLObjectType,
  GraphQLList,
} = require('graphql');

let { globalIdField } = require('graphql-relay');

// Type Registry
let { register } = require('../../registry');

// Interfaces
let { nodeInterface } = require('../Interface/Node');

// Sub-types
let { SectionQuery } = require('./Section');


let PricingTierQuery = new GraphQLObjectType({
  name: 'PricingTier',
  fields: () => ({
    id: globalIdField('PricingTier', ({ _id }) => _id),
    filter: {
      type: GraphQLString,
    },
    sections: {
      type: new GraphQLList(SectionQuery),
      resolve: (...args) => {
        console.log('section resolve', args);
        return { id: 'asdf', name: 'GA' };
      },
    },
  }),
  interfaces: [ nodeInterface ],
});

register(PricingTierQuery);

module.exports = { PricingTierQuery };
