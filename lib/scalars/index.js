let {
  GraphQLScalarType,
} = require('graphql');

let { GraphQLError } = require('graphql/error');
let { Kind } = require('graphql/language');

function stringScalarGenerator(name, regex) {
  return new GraphQLScalarType({
    name,
    serialize: value => value,
    parseValue: value => value,
    parseLiteral: ast => {
      if (ast.kind !== Kind.STRING) {
        throw new GraphQLError(`Query error: Can only parse strings got a: ${ast.kind}`, [ast]);
      }

      if (!regex.test(ast.value)) {
        throw new GraphQLError(`Query error: Not a valid ${name}`, [ast]);
      }

      return ast.value;
    },
  });
}

// Regex taken from: http://stackoverflow.com/a/46181/761555
module.exports.EmailType = stringScalarGenerator('Email', /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i);
module.exports.DateTimeType = stringScalarGenerator('DateTime', /(\d{4})-(\d{2})-(\d{2})T(\d{2})\:(\d{2})\:(\d{2})[+-](\d{2})\:(\d{2})/);
module.exports.ObjectIDType = stringScalarGenerator('ObjectID', /[a-f0-9]{24}/i);
