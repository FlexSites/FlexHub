let {
  GraphQLString,
  GraphQLList,
  GraphQLObjectType,
  GraphQLNonNull,
} = require('graphql');

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

let query = () => {};

// let { settings } = require('../index');
// let { data } = require('../plugins');
// let { addDomain, removeDomain } = require('../../lib/heroku/domains');

// export let schemata = new Schema({

//   // Analytics
//   analytics: { type: String, required: true },
//   contact: { email: { type: String }, phone: { type: String }},
//   host: String,
//   repo: { type: String, required: true },
//   type: { type: String, required: true },

//   // // Associations
//   // events: [{ ref: 'Event', type: ObjectId }],
//   // pages: [{ ref: 'Page', type: ObjectId }],
//   // redirects: [{ ref: 'Redirect', type: ObjectId }],
//   // testimonials: [{ ref: 'Testimonial', type: ObjectId }],
// });

let SiteQuery = new GraphQLObjectType({
  name: 'Site',
  description: 'A Site Object',
  fields: () => ({
    id: globalIdField('Site', ({ _id }) => _id),
    analytics: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Google analytics key',
    },
    hosts: {
      type: new GraphQLList(new GraphQLNonNull(GraphQLString)),
      description: 'List of hosts associated with a site',
    },
    repository: {
      type: GraphQLString,
      description: 'Github HTTPS repository URL',
    },
    title: {
      type: GraphQLString,
      description: 'Site title',
    },
    social: {
      type: new GraphQLList(SocialProviderQuery),
    },
    pages: {
      type: new GraphQLList(PageQuery),
      description: 'List of associated pages',
      resolve(site) {
        return query('Page', { site: site.id });
      },
    },
    events: {
      type: new GraphQLList(EventQuery),
      description: 'List of associated events',
      resolve(site) {
        return query('Event', { site: site.id });
      },
    },
    venues: {
      type: new GraphQLList(VenueQuery),
      description: 'List of associated venues',
      resolve: ({ id }, params, { rootValue: { tenant, tenantId }}) =>
        tenant
          .connection('mongo')
          .find('Venue', { tenant: tenantId, site: id }),
    },
  }),
  interfaces: [ nodeInterface ],
});

register(SiteQuery);

module.exports = { SiteQuery };

// schema.plugin(data);

// schema.pre('update', function(){
//   // Look up current domains, remove unused ones

//   // Add non-current domains
// });

// schema.post('save', function(doc) {
//   doc.hosts.map(addDomain.bind(this, 'flex-router'));
// });

// module.exports = mongoose.model('Site', schemata);

// module.exports = function (conn) {
//   return conn.model('Site', schema);
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
