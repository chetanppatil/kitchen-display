const express = require('express');
const app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
app.io = io;

global.q = require('q');
global.fs = require('fs');
global._ = require('underscore');
global.config = require('./config/config.json');
global.ordersPath = './data/orders.json';
global.dbQuery = require('./services/pgdbQuery');
global.queries = require('./services/queryFile');
global.commonFn = require('./services/commonFunctions');

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

app.use(express.static(__dirname + '/node_modules'));
app.use(express.static(__dirname + '/public'));

/* PING FOR TESTING API STATUS */
app.get(BASE_URL + '/ping', (req, res) => {
  res.status(200).send("Pong");
});

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});


/* KITCHEN SYSTEM APIs */
app.get(BASE_URL + '/getProducts', require('./api/controllers/getProducts').getProducts);
app.post(BASE_URL + '/placeOrder', require('./api/controllers/placeOrder').placeOrder);
app.post(BASE_URL + '/predictValue', require('./api/controllers/predictValue').predictValue);
app.post(BASE_URL + '/orderStatus', require('./api/controllers/orderStatus').orderStatus);

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

io.on('connection', (client) => {
    console.log('Client connected...');

    client.on('join', (data) => {
        console.log(data);
        client.emit('start', data);
        client.broadcast.emit('start',data);
    });

    client.on('statusUpdate', (data) => {
           client.emit('statusUpdate', data);
           client.broadcast.emit('statusUpdate',data);
    });

});

/* SERVER START */
var port = process.env.PORT || 3000;
server.listen(port);
// global.port = port;
// var serve = app.listen(port);
// serve.timeout = 600000;
module.exports = exports;

console.log('API is running on port: ' + port);
console.log('try this: curl http://localhost:' + port + BASE_URL + '/ping');
