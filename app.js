const express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

global.q = require('q');
global.fs = require('fs');
global._ = require('underscore');
global.config = require('./config/config.json');
global.ordersPath = './data/orders.json';
global.dbQuery = require('./services/pgdbQuery');
global.queries = require('./services/queryFile');
global.commonFn = require('./services/commonFunctions');


const app = express();
const BASE_URL = config.BASE_URL;


app.use(cors());

app.use(bodyParser.raw({
  limit: '50mb'
}));
app.use(bodyParser.json({
  limit: '50mb'
}));
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true
}));


/* PING FOR TESTING API STATUS */
app.get(BASE_URL + '/ping', (req, res) => {
  res.status(200).send("Pong");
});

/* KITCHEN SYSTEM APIs */
app.post(BASE_URL + '/placeOrder', require('./api/controllers/placeOrder').placeOrder);
app.post(BASE_URL + '/predictValue', require('./api/controllers/predictValue').predictValue);

app.use((err, req, res, next) => {
  console.log('-----Something broke!---', err);
  res.status(500).send('Something broke!');
});

/* 404 ROUTE NOT FOUND */
app.get('*', (req, res) => {
  // console.log("no route found,throwing 404 error." + req.url);
  res.status(404).send({
    code: 404,
    error: "404 PAGE not found >" + req.url + '<<'
  });
});

/* SERVER START */
var port = process.env.PORT || 3000;
global.port = port;
var server = app.listen(port);
server.timeout = 600000;
module.exports = exports;

console.log('API is running on port: ' + port);
console.log('try this: curl http://localhost:' + port + BASE_URL + '/ping');
