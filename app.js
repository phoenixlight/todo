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
// var logger = require('express-logger');
var logger = require('morgan');

var request = require('request');

// var jsdom = require("jsdom");
// var $ = null;

var User = require('./models/userModel');


// require("jsdom").env("", function(err, window) {
// 	if (err) {
// 		console.error(err);
// 		return;
// 	}
 
// 	var $ = require("jquery")(window);
// });

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

app.use(logger('dev')); //log every request to the console
//** NOTE: if there is no index.html file in the client folder, then routes proceed as normal]

//ejs stuff
app.set('view engine', 'ejs');


function getTasks() {
	app.get('/api/todos', function(req, res) {
		return res;
	});
}


// ROUTE FOR THE HOME PAGE
app.get('/', function(req,res) {

	///
console.log('test0.0');

var task = "default";
	var drinks = [
        { name: 'Bloody Mary', drunkness: 3 },
        { name: 'Martini', drunkness: 5 },
        { name: 'Scotch', drunkness: 10 }
    ];
 var tagline = "Any code of your own that you haven't looked at for six or more months might as well have been written by someone else.";

console.log(req.user.username + "over here ");

User.find({'username' : req.user.username}, function(err, docs) {
	console.log(docs[0]._id); // prints out the id

	request('http://localhost:3000/api/users/' + docs[0]._id, function(error, response, body) {
	if (error) throw error;
	
	if (!error && response.statusCode == 200) {
		// console.log(JSON.parse(body)[0]);
		// task = JSON.parse(body);
		// usersTodoList = 
		};

		var i;
		todolist2 = JSON.parse(body).todos;

		todostuff = []
		for (i=0; i<todolist2.length; i++) {
			console.log(todolist2[i].task);
			todostuff.push(todolist2[i].task);
		};

		res.render('todo2', {
		drinks: drinks,
		tagline: tagline,
		tasks: todolist2,
		user: req.user._id,
		username: req.user.username,
		password: req.user.password,
		todos: req.user.todos
		});
		
});

// console.log

	});
// 	console.log("TEST" + task)
// });
// console.log("THIS IS THE TASK" + task);

// console.log($)

	


});

// this is the route to the todo page
app.get('/todolist', function(req, res) {
	res.sendFile(__dirname + '/client/todo.html');
});


app.get('/users', function(req, res) {
	res.sendFile(__dirname + '/client/users.html');
});


// this is the route to the login page
app.get('/login', function(req, res) {
  res.sendFile(__dirname + '/client/login.html');
});


// routes ======================================================================

// The routes for todo api!
require('./routes/todoAPI')(app);

// The routes for the users api!
require('./routes/userAPI')(app);

// THe routes for authentication
require('./routes/auth')(app, passport);

//create a server listening on the port
app.listen(port);
console.log('Listening on port! localhost:3000');


