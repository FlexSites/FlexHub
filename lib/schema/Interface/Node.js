let { nodeDefinitions } = require('graphql-relay');
let { resolveID, resolveType } = require('../../registry');

module.exports = nodeDefinitions( resolveID, resolveType );
