import {
  GraphQLString,
  GraphQLObjectType,
} from 'graphql';

const providers = {
  facebook: (id) => `https://www.facebook.com/${id}`,
  twitter: (id) => `https://twitter.com/${id}`,
};

let SocialProviderQuery = new GraphQLObjectType({
  name: 'SocialProvider',
  fields: () => ({
    type: { type: GraphQLString },
    identifier: { type: GraphQLString },
    url: {
      type: GraphQLString,
      resolve: ({ type, identifier }) => {
        let provider = providers[type.toLowerCase()];
        if (provider) return provider(identifier);
        return identifier;
      },
    },
  }),
});

module.exports = { SocialProviderQuery };
