let {
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
} = require('graphql');
let { SiteQuery } = require('../Query/Site');
let { fromGlobalId } = require('graphql-relay');

const COLLECTION_NAME = 'Site';

let args = {
  analytics: {
    type: GraphQLString,
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
  // social: {
  //   type: new GraphQLList(SocialProviderQuery),
  // },
};

module.exports.createSite = {
  type: SiteQuery,
  description: 'Updates the count',
  args,
  resolve(mutation, params, { rootValue: { tenant, tenantId } }) {
    let conn = tenant.connection('mongo');

    return conn
      .create(COLLECTION_NAME, { tenant: tenantId, ...params })
      .then(({ insertedId }) => conn.find(COLLECTION_NAME, { _id: insertedId }))
      .then(([ results ]) => results);
  },
}

module.exports.updateSite = {
  type: SiteQuery,
  description: 'Updates the count',
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    ...args,
  },
  resolve(mutation, params, { rootValue: { tenant, tenantId } }) {
    let conn = tenant.connection('mongo');

    let { id } = params;
    delete params.id;

    console.log(params, id);
    return conn
      .update(COLLECTION_NAME, { tenant: tenantId, id }, { $set: params })
      .then(() => conn.find(COLLECTION_NAME, { id }))
      .then(([ results ]) => results);
  },
}

module.exports.deleteSite = {
  type: SiteQuery,
  description: 'Remove a site by ID',
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  resolve(mutation, { id: _id }, { rootValue: { tenant, tenantId } }) {
    return tenant.connection('mongo')
      .deleteOne({ _id, tenant: tenantId });
  },
};
