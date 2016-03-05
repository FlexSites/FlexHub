var Bluebird = require('bluebird');

module.exports = function wrap(fn) {
  fn = Bluebird.method(fn);
  return (event, context) => {
    fn(event)
      .then(data => context.succeed(data))
      .catch(ex => context.fail(ex));
  }
}
