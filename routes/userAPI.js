var User = require('../models/userModel');

var sessions = require('client-sessions');



module.exports = function(app) {
		//API CODE


	app.get('/dashboard', function(req, res) {
		if(!req.session) {
				return res.status(401).send();
		}

		return res.status(200).send('Welcome to super secret API');
	})

		//GET users
		app.get('/api/users', function(req, res) {
			//here we call the mongoose find function to grab all users. **don't need to use an array
			User.find(function(err, users){
				if (err) return err;
				res.send(users);
			});
		});

		//GET user @ _id
		app.get('/api/users/:id',function(req, res){
			User
			.findById(req.params.id)
			.populate('todos')
			.exec(function(err, post){
				// console.log(post); 	// here we log the user during its get request
				if (err) return "what";
				res.send(post);
});


			// User.findById(req.params.id, function(err, user){ //other valid syntax { _id : req.params.id}
			// 	if (err) return err;
			// 	res.send(user);
			// });
		});

		//POST or create NEW user
		app.post('/api/users', function(req, res){
			// req.body.todos = ['575587c906d9d1f40c8a6c6c', '575587cc06d9d1f40c8a6c6e'];
			req.body.todos = [];
			User.create(req.body, function(err, user){
				//hard coding a pushed todo id


				res.send("Created new user");
				// res.end();
			});
		});

		//DELETE user @ _id
		app.delete('/api/users/:id', function(req, res){
			User.findByIdAndRemove(req.params.id, function(err){
				if (err) throw err;
				res.send('Deleted todo!');
			});
		});

		//UPDATE post @ _id
		app.put('/api/users/:id', function(req, res){
			var update = {
				username : req.body.username,
				password : req.body.password,
				todos : req.body.todos
			}

			User.findByIdAndUpdate(req.params.id, update, function(err){
				if (err) throw err;
				res.send("Updated!")
			});
		});

}