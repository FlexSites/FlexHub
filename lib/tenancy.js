let { Tenancy } = require('tenant');
let MongoDB = require('./services/MongoDB');

module.exports = new Tenancy({
  tenants: {
    staging: {
      mongo: 'mongodb://localhost:27017/flexhub',
    },
    production: {
      mongo: 'mongodb://localhost:27017/flexhub',
    },
  },
  connections: {
    mongo: (config) => new MongoDB(config.mongo),
  },
});

