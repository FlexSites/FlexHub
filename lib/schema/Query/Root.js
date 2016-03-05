let {
  GraphQLString,
  GraphQLObjectType,
  GraphQLList,
} = require('graphql');

let Inflect = require('i');

let i = new Inflect();

let { nodeField } = require('../Interface/Node');

let { PlatformQuery } = require('./Platform');
let { VenueQuery } = require('./Venue');
let { EventQuery } = require('./Event');
let { EntertainerQuery } = require('./Entertainer');
let { MediumQuery } = require('./Medium');
let { SiteQuery } = require('./Site');

module.exports = new GraphQLObjectType({
  name: 'Root',
  fields: () => {
    const fields = {
      node: nodeField,
      platforms: {
        type: PlatformQuery,
        args: {
          id: {
            name: 'id',
            type: GraphQLString,
          },
        },
        resolve: ({ tenant }, { id }) => {
          return tenant.connection('mongo')
            .findById(id);
        },
      },
    };

    return [ SiteQuery, EventQuery, MediumQuery, VenueQuery, EntertainerQuery ]
      .reduce((prev, curr) => ({ ...connection(curr), ...prev }), fields);
  },
});


function connection(QueryType) {
  const { name } = QueryType;
  const plural = i.pluralize(name).toLowerCase();
  return {
    [plural]: {
      type: new GraphQLList(QueryType),
      description: `List of ${plural}`,
      resolve: ({ tenant, tenantId }) =>
        tenant
          .connection('mongo')
          .find(name, { tenant: tenantId }),
    },
  };
}
