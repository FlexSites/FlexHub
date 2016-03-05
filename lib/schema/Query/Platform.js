let {
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} = require('graphql');

let { ObjectId } = require('mongodb');

let { globalIdField, fromGlobalId } = require('graphql-relay');

// Type Registry
let { register } = require('../../registry');

// Interfaces
let { nodeInterface } = require('../Interface/Node');

// Sub-types
let { TenantQuery } = require('./Tenant');

let PlatformQuery = new GraphQLObjectType({
  name: 'Platform',
  description: 'A Platform Object',
  fields: () => ({
    id: globalIdField('Platform', ({ _id }) => _id),
    name: {
      type: GraphQLString,
      description: 'Platform name',
    },
    logo: {
      type: GraphQLString,
      description: 'URL of vector logo',
    },
    identifier: {
      type: GraphQLString,
      description: 'Immutable identifier for the platform',
    },
    tenant: {
      type: TenantQuery,
      args: {
        id: {
          name: 'id',
          type: GraphQLString,
        },
      },
      resolve: ({ _id: platformId }, { id }, { rootValue: { tenant } }) => {
        console.log('stuff', platformId, id);
        return tenant.connection('mongo')
          .get('tenants', id, { platform: new ObjectId(platformId) })
      }
    },
    tenants: {
      type: new GraphQLList(TenantQuery),
      resolve: ({ _id }, params, { rootValue: { tenant } }) => {
        return tenant.connection('mongo')
          .query('tenants', { platform: new ObjectId(_id) });
      },
    },
  }),
  interfaces: [ nodeInterface ],
});

register(PlatformQuery);

module.exports = { PlatformQuery };
