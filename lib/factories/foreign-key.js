let { GraphQLList } = require('graphql');

// Foreign Key on related object
module.exports.belongsToMany = function (key, QueryType) {
  let name = parseCollection(QueryType);
  if (!key) key = name.toLowerCase();

  return {
    type: new GraphQLList(QueryType),
    resolve: (obj, params, { tenant }) => {
      return tenant.connection(name)
        .query({ [key]: obj.id || obj._id });
    },
  };
}

// Foreign Key on source object
module.exports.hasOne = function (key, QueryType) {
  let name = parseCollection(QueryType);

  return {
    type: QueryType,
    resolve: (obj) => findOne(name, { _id: obj[key] }),
  }
}

// Array of Foreign Keys on source object
module.exports.hasMany = function (key, QueryType) {
  let name = parseCollection(QueryType);

  return {
    type: new GraphQLList(QueryType),
    resolve: (obj) => query(name, { _id: { $in: obj[key] } }),
  };
}

module.exports.hasAndBelongsToMany = function (sourceKey, foreignKey, QueryType) {
  let name = parseCollection(QueryType);

  return {
    type: new GraphQLList(QueryType),
    resolve: (obj) => query(name, { [foreignKey]: { $in: obj[sourceKey] } }),
  }
}

function parseCollection(QueryType) {
  return QueryType.name;
}
