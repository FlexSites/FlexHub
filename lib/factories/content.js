let { GraphQLString } = require('graphql');
let marked = require('marked');
let striptags = require('striptags');

module.exports = function content (key) {
  return {
    type: GraphQLString,
    args: {
      format: {
        name: 'format',
        type: GraphQLString,
      },
    },
    resolve(obj, { format }) {
      let val = obj[key];
      if (!val) return undefined;

      if (format === 'html' || format === 'text') val = marked(val);
      if (format === 'text') val = striptags(val);
      return val;
    },
  };
}
