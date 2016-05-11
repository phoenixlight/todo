//create the express object
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//connect to the mongo database @ mlab
mongoose.connect('mongodb://gabriel:master@ds013232.mlab.com:13232/phoenix_db');

// to see the client side code
app.use(express.static(__dirname+'/client'));

//parsing requests as json
app.use(bodyParser.json());

//parsing form requests
app.use(bodyParser.urlencoded({ extended: true }));

// The routes for todo api!
require('./routes/todoAPI')(app);


//using a development port or a local port
var port = process.env.PORT || 3000;

//create a server listening on the port
app.listen(port);
console.log('Listening on port!');


