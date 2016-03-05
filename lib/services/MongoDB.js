let { MongoClient, ObjectId } = require('mongodb');
let Service = require('./Service');
let Bluebird = require('bluebird');
let { fromGlobalId } = require('graphql-relay');
let { getTypes } = require('../registry');
let { get, set } = require('object-path');

let parseQuery = parse.bind(this, true);
let parseBody = parse.bind(this, false);

module.exports = class MongoDB extends Service {
  constructor(url) {
    super();

    // Connect using MongoClient
    this.connection = Bluebird.fromCallback(cb => MongoClient.connect(url, cb));
  }

  disconnect() {
    this.connection
      .then(db => db.close());
  }


  findById(globalId, query = {}) {
    let queryType
      , isBulk = true
      , queryPath = '_id';

    // Just retrieve a single record
    if (!Array.isArray(globalId)) {
      isBulk = false;
      globalId = [globalId];
    }

    if (isBulk) {
      queryPath = `${queryPath}.$in`;
    }

    let $in = globalId.map(gId => {
      let { id, type } = fromGlobalId(gId);

      if (!queryType) queryType = type;
      else if (queryType !== type) throw new Error('Cannot retrieve bulk objects of multiple types.');

      return id;
    });

    query = { _id: { $in }, ...query }

    return this.find(queryType, query)
      .then(results => !isBulk ? results[0] : results)
      .tap(console.log.bind(console, 'success'))
      .catch(console.log.bind(console, 'fail'));
  }
  find(collection, query) {
    console.log('query', collection, parseQuery(query));
    return this.connection
      .then(db => db.collection(collection).find(parseQuery(query)).toArray());
  }
  create(collection, body) {
    return this.connection
      .then(db => db.collection(collection).insertOne(parseBody(body)));
  }
  update(collection, query, body) {
    return this.connection
      .then(db => db.collection(collection).updateOne(parseQuery(query), parseBody(body), { upsert: true}))
  }
  deleteOne(query) {
    let { _id } = query;
    if (!_id) return Bluebird.reject(new TypeError('Expected field "id" to be a string.'));

    let { id, type } = fromGlobalId(_id);
    return this.connection
      .then(db => db.collection(type).removeOne({ _id: id }));
  }
}

function parse(isQuery, payload) {
  const types = Object.keys(getTypes())
    .map(type => type.toLowerCase());

  return Object.keys(payload)
    .reduce((newPayload, key) => {
      let val = get(payload, key);

      // Key is a relation
      if (~types.indexOf(key) || key === 'id') val = toObjectId(val);

      // Primary key replacement
      if (key === 'id') key = '_id';

      // Handling Array values
      if (isQuery && Array.isArray(val)) {
        key = `${key}.$in`
      }

      set(newPayload, key, val);
      return newPayload;
    }, {});
}

function toObjectId(val) {
  if (Array.isArray(val)) return val.map(toObjectId);
  if (val instanceof ObjectId) return val;
  let { id } = fromGlobalId(val);
  return new ObjectId(id);
}
