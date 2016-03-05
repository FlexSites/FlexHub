let { graph } = require('./lib');
let app = require('express')();
let { text } = require('body-parser');

app.use(text());
app.post('/graph', (req, res, next) => {
  let query = {
    environment: req.get('Flexhub-Environment') || 'staging',
    tenant: req.get('FlexHub-Tenant'),
    // query: 'query { platform(id: "56cd52da064aa15644e241f8") { id, name, tenant(id: "VGVuYW50OjU2Y2Q1MzdlMDY0YWExNTY0NGUyNDFmOQ==") { id, sites { id, hosts, analytics } } } }'
    query: req.body,
  };
  console.log(query);
  graph(query)
    .then(res.send.bind(res))
    .catch(next);
});

app.listen(8080, () => {
  console.log('Listening on port 8080');
})
