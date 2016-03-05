let mongoose, { Schema } = require('mongoose');
let bluebird = require('bluebird');
let NodeCache = require('node-cache');
let { get } = require('object-path');

let cache = new NodeCache({ stdTTL: 5 * 60, useClones: false });

let ObjectId = Schema.Types.ObjectId;

mongoose.Promise = bluebird;

const collections = [
  'Site',
  'Page',
  'Entertainer',
  'Event',
  'Medium',
  'Venue',
  'Section',
  'Seat',
  'Showtime',
  'Ticket',
];

module.exports = (url) => {
  // let conn = mongoose.connection(url);
  mongoose.connect(url);
  let conn = mongoose;

  collections.map(collection => {
    let schema = new Schema({
      site: ObjectId,
      venue: ObjectId,
      event: ObjectId,
    }, {
      toJSON: { getters: true, virtuals: true },
      toObject: { getters: true, virtuals: true },
      minimize: true,
      strict: false, collection
    });
    conn.model(collection, schema);
  });

  return conn;
}

export let query = dbCall.bind(cache, 'find');
export let findOne = dbCall.bind(cache, 'findOne');

function getProjection (fieldASTs, source = {}) {
  if (Array.isArray(fieldASTs)) {
    fieldASTs.map(field => getProjection(field, source));
    return source;
  }
  let arr = get(fieldASTs, 'selectionSet.selections', []);
  return arr
    .reduce((projections, selection) => {
      projections[selection.name.value] = 1;

      return projections;
    }, source);
}

function dbCall(type, name, query, fieldASTs) {
  let start = new Date().getTime()
    , key = `${type}|${name}|${JSON.stringify(query)}`
    , cached = this.get(key);

  if (cached) return cached;

  let promise = mongoose
    .model(name)
    [type](query)
    .select(getProjection(fieldASTs))
    .then(res => {
      console.log(`${name} query with "${JSON.stringify(query)}" took ${(new Date()).getTime() - start}ms`);
      if (!Array.isArray(res)) return res.toJSON();
      return res.map(r => r.toJSON());
    });

  this.set(key, promise);
  return promise;
}
