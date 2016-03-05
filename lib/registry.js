let { fromGlobalId } = require('graphql-relay');

const types = {};

module.exports.register = function(type) {
  return (types[type.name] = type);
}

module.exports.resolveID = function(globalId, info) {
  const { type, id } = fromGlobalId(globalId);
  const { rootValue: { tenant } } = info;

  return tenant
    .connection(type)
    .get(id)
    .then(obj => {
      obj.__type = type;
      return obj;
    });
}

module.exports.resolveType = function(obj) {
  let type = obj.__type;
  delete obj.__type;
  return types[type];
}

module.exports.getTypes = function() {
  return types;
}

