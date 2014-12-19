var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var routes = require('./api')(app);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/', express.static('./client/'));
app.use('/', express.static('./'));

var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})