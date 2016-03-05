let { execute } = require('./schema');
let { get } = require('object-path');
let tenancy = require('./tenancy');
let Bluebird = require('bluebird');
let wrap = require('./lambda-wrapper');
let { fromGlobalId } = require('graphql-relay');

const VALID_ENVIRONMENTS = [
  'local',
  'staging',
  'production',
];

function graph({
    tenant: tenantId,
    environment,
    query,
    returns,
    token,
  }) {

  console.log(`
    GraphQL query: ${query}
    Expecting to return "${returns}"
    Executing against "${environment}"
    For tenant "${tenantId}"
  `);

  try {

    if (typeof environment !== 'string' || !~VALID_ENVIRONMENTS.indexOf(environment)) throw new TypeError('Expected field "environment" to be type String.');
    if (typeof tenantId !== 'string') throw new TypeError('Expected field "tenant" to be type String.');
    if (typeof query !== 'string') throw new TypeError('Expected field "query" to be type String.');

    return execute(query, { token, tenant: tenancy.tenant(environment), tenantId })
      .then(results => parseReturn(results, returns));
  } catch (ex) {
    console.error(ex);
    return Bluebird.reject(ex);
  }
}

module.exports = {
  graph,
  handle: wrap(graph),
};

function parseReturn(results, path) {
  if (!path) return results;
  return results
    .then(res => get(res, path));
}
