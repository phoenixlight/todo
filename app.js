//create the express object
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');


var path = require("path");
// var sessions = require('client-sessions');
var session = require('express-session')

var MongoStore = require("connect-mongo")(session);

var passport = require('passport');

var passportLocal = require('passport-local');


app.use(passport.initialize());
app.use(passport.session());

//connect to the mongo database @ mlab
mongoose.connect('mongodb://gabriel:master@ds013232.mlab.com:13232/phoenix_db');

var User = require('./models/userModel');

var router = express.Router(); 


// to see the client side code
app.use(express.static(path.join(__dirname+'/client')));

//parsing requests as json
app.use(bodyParser.json());

//parsing form requests
app.use(bodyParser.urlencoded({ extended: true }));


//** NOTE: if there is no index.html file in the client folder, then routes proceed as normal]




// The routes for todo api!
require('./routes/todoAPI')(app);

// The routes for the users api!
require('./routes/userAPI')(app);




// SESSION STUFF :D:D
app.use(session({
  // cookieName: 'session',
  secret: 'random_string_goes_here',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({mongooseConnection:mongoose.connection})
  // duration: 30 * 60 * 1000,
  // activeDuration: 5 * 60 * 1000,
}));



app.post('/login', function(req, res) {
	var username = req.body.username;
	var password = req.body.password;


	User.findOne({'username': username} , function(err, user) {
		 if (!user) {
     		 // res.render('login.jade', { error: 'Invalid email or password.' });
     		 console.log('invalid user');
     		 console.log(user);
     		 console.log(req.body.username);
     		 			res.end();
    	  	}

    	 else {
  			if (user.password === password) {
    			console.log('Logged in');

    			//sets currently logged in user
    			req.session.user = user;
    			
    			// req.sessions.user = "sdfiojaopweifjpiowef";
    			// res.redirect('/todo.html');

    			console.log(req.session.user);
    			req.session.save();
    			// req.redirect('/')
    			res.end();
  			}	
  			else {
    			// res.render('login.jade', { error: 'Invalid email or password.' });
    			console.log('Invalid pass');
    			res.end();
  			}
		}
	});

	// console.log(req.session);
});



// this is the route to the login page
app.get('/', function(req, res) {
	console.log('requested home page');
	console.log(req.session);
	if (req.session.user) {
		// console.log(req.session.user)
		console.log("state logged in")
		res.sendFile(__dirname+'/client/todo.html');
	}

	else {
		console.log("please login")
		// console.log(req.session.user)
		res.sendFile(__dirname+'/client/login.html');
	}

});

// this is the route to the login page
app.get('/todolist', function(req, res) {
	res.sendFile(__dirname+'/client/todo.html');

});

//using a development port or a local port
var port = process.env.PORT || 3000;

//create a server listening on the port
app.listen(port);
console.log('Listening on port! localhost:3000');


