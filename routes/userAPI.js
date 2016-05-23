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
			User.findById(req.params.id, function(err, user){ //other valid syntax { _id : req.params.id}
				if (err) return err;
				res.send(user);
			});
		});

		//POST or create NEW user
		app.post('/api/users', function(req, res){
			User.create(req.body, function(err, user){
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
				username : req.body.task,
				password : req.body.done,
				firstname : req.body.firstname, 
				lastname : req.body.lastname
			}

			User.findByIdAndUpdate(req.params.id, update, function(err){
				if (err) throw err;
				res.send("Updated!")
			});
		});

}