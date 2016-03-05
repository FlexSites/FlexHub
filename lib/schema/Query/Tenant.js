let {
  GraphQLList,
  GraphQLObjectType,
} = require('graphql');

let { ObjectId } = require('mongodb');

let { globalIdField } = require('graphql-relay');

// Type Registry
let { register } = require('../../registry');

// Interfaces
let { nodeInterface } = require('../Interface/Node');

// Sub-types
let { PageQuery } = require('./Page');
let { VenueQuery } = require('./Venue');
let { EventQuery } = require('./Event');
let { SocialProviderQuery } = require('./SocialProvider');
let { EntertainerQuery } = require('./Entertainer');
let { MediumQuery } = require('./Medium');
let { SiteQuery } = require('./Site.js');

let TenantQuery = new GraphQLObjectType({
  name: 'Tenant',
  description: 'A Tenant Object',
  fields: () => ({
    id: globalIdField('Tenant', ({ _id }) => _id),
    social: {
      type: new GraphQLList(SocialProviderQuery),
    },
    sites: {
      type: new GraphQLList(SiteQuery),
      description: 'List of associated sites',
      resolve(obj, params, { rootValue: { tenant, tenantId }}) {
        return tenant.connection('mongo')
          .query('sites', { tenant: tenantId });
      },
    },
    events: {
      type: new GraphQLList(EventQuery),
      description: 'List of associated events',
      resolve({ id }) {
        return query('Event', { tenant: id });
      },
    },
    media: {
      type: new GraphQLList(MediumQuery),
      description: 'List of media for this tenant.',
      resolve: () => {
        // TODO: Resolve all media associated with this tenant.
      },
    },
    venues: {
      type: new GraphQLList(VenueQuery),
      description: 'List of associated venues',
      resolve({ id }) {
        return query('Venue', { tenant: id });
      },
    },
    entertainers: {
      type: new GraphQLList(EntertainerQuery),
      description: 'List of associated entertainers',
      resolve: ({ id }) => query('Entertainer', { tenant: id }),
    },
  }),
  interfaces: [ nodeInterface ],
});

register(TenantQuery);

module.exports = { TenantQuery };


// schema.plugin(data);

// schema.pre('update', function(){
//   // Look up current domains, remove unused ones

//   // Add non-current domains
// });

// schema.post('save', function(doc) {
//   doc.hosts.map(addDomain.bind(this, 'flex-router'));
// });

// module.exports = mongoose.model('Tenant', schemata);

// module.exports = function (conn) {
//   return conn.model('Tenant', schema);
// }

  // lifecycle: {
  //   beforeAccess: (query, { user }) => {
  //     if (!user) return;

  //     let hosts = user.groups.items.map(group => group.name);

  //     if (!~hosts.indexOf('Admin')) objectPath.set(query, 'where.host.$in', hosts);
  //   },

  //   beforeUpdate: (instance) => {
  //     [
  //       'testimonials',
  //       'pages',
  //     ].forEach(key => {
  //       let val = instance[key];
  //       if (!val || !val.length) delete instance[key];
  //     });

  //     return instance;
  //   },
  // },
