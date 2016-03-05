let {
  GraphQLString,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLEnumType,
} = require('graphql');

// let { getYoutubeId } = require('../lib/string-util');

let { globalIdField } = require('graphql-relay');

// Type Registry
let { register } = require('../../registry');

// Interfaces
let { nodeInterface } = require('../Interface/Node');

// Sub-types
let { PageQuery } = require('./Page');


let MediumQuery = new GraphQLObjectType({
  name: 'Medium',
  fields: () => ({
    id: globalIdField('Medium', ({ _id }) => _id),
    type: {
      type: new GraphQLEnumType({
        name: 'MediaType',
        values: {
          hero: { value: 0 },
          profile: { value: 1 },
          background: { value: 2 },
          ad: { value: 3 },
          video: { value: 4 },
          other: { value: 5 },
        },
      }),
    },
    subtype: {
      type: GraphQLString,
    },
    filetype: {
      type: GraphQLString,
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    source: {
      type: new GraphQLNonNull(GraphQLString),
      resolve(medium) {
        return medium.source || medium.src;
      },
    },
    description: {
      type: GraphQLString,
    },
    embed: {
      type: GraphQLString,
      resolve(medium) {
        if (medium.type !== 'video') return undefined;
        let id = getYoutubeId(medium.src);
        if (id) return `https://www.youtube.com/embed/${id}`;
      },
    },
  }),
  interfaces: [ nodeInterface ],
});

register(MediumQuery);

module.exports = { MediumQuery };

/* lifecycle: {
    beforeCreate: (ins) => {
      if (!ins.filetype && ins.type !== 'video') ins.filetype = mime.lookup(ins.src);
      if (ins.type === 'video') {
        let id = getYoutubeId(ins.src);
        if (id) ins.thumbnail = `http://img.youtube.com/vi/${id}/0.jpg`;
      }
    },
    afterCreate: (ins, req) => {
      if (ins.type === 'video') return ins;
      return assign(ins.src, ins.id, req.flex.site.host)
        .then(({ to }) => {
          ins.src = to;
          transform(ins);
          return ins;
        })
        .then(() => getModels('medium'))
        .then(Media => Media.update({ _id: ins._id || ins.id }, ins))
        .then(() => ins);
    },
    afterDelete: (ins) => {
      let { host, pathname } = url.parse(ins.src, false, true);
      if (host !== 'uploads.flexsites.io') return ins;
      return find(path.dirname(pathname).substr(1))
        .then(remove);
    },
  },*/
