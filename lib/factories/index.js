let content = require('./content');
let foreignKeys = require('./foreign-key');

module.exports = { content, ...foreignKeys };
