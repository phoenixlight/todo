
var LocalStrategy = require('passport-local').Strategy; 


var User = require('../models/userModel');

module.exports = function(passport) {


	passport.serializeUser(function(user, done) {
	  done(null, user);
	});

	passport.deserializeUser(function(user, done) {
	  User.findById(user, function(err, user) {
	  	done(err, user);
	  });
	});

	passport.use(new LocalStrategy({
		usernameField: 'username',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, username, password, done) {
		User.findOne({'username': username}, function(err, user){
			if (err) return done(err);

			//if no user is found
			if(!user) return done(null, false);

			//user found but wrong password
			if (user.password != password)
				return done(null, false);

			//all is well
			return done(null, user);


		});
	}));
	  // process.nextTick(function() {
	  //   User.findOne({
	  //     'username': username, 
	  //   }, function(err, user) {
	  //     if (err) {
	  //       return done(err);
	  //     }

	  //     if (!user) {
	  //       return done(null, false);
	  //     }

	  //     if (user.password != password) {
	  //       return done(null, false);
	  //     }

	  //     return done(null, user);
	  //   });
	  // });

}