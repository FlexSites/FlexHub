require('babel-register')({
  "presets": [
    "es2015"
  ],
  "plugins": [
    "syntax-async-functions",
    "transform-object-rest-spread",
    "transform-regenerator"
  ]
});
require('./server');
