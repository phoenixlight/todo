// app.js

// set up ======================================================================
var express = require('express');
var app = express();
var port = process.env.PORT || 3000; //dev port || local port
var mongoose = require('mongoose');
var path = require("path");
var bodyParser = require('body-parser');
var configDB = require('./config/database.js');
var passport = require('passport');
var session = require('express-session');
var logger = require('morgan');
var request = require('request');
var User = require('./models/userModel');

var flash = require('connect-flash');

// configuration ===============================================================

mongoose.connect(configDB.url);

app.use(express.static(path.join(__dirname+'/client')));        //to see client side code
app.use(bodyParser.json());                                     //parsing requests as json
app.use(bodyParser.urlencoded({ extended: true }));             //parsing form requests

require('./config/passport')(passport);                         //pass passport in to config file for configuration


// app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false })); // session secret
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(logger('dev')); //log every request to the console
//** NOTE: if there is no index.html file in the client folder, then routes proceed as normal]

//ejs stuff
app.set('view engine', 'ejs');

// ==============================
// require in the routes ========
// ==============================

// The routes for todo api!
require('./routes/todoAPI')(app);

// The routes for the users api!
require('./routes/userAPI')(app);

// THe routes for authentication
require('./routes/routes')(app, passport);

//create a server listening on the port
app.listen(port);
console.log('Listening on port! localhost:3000');


