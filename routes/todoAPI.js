var Todo = require('../models/todoModel');

var User = require('../models/userModel');


module.exports = function(app) {
		//API CODE
var Todo = require('../models/todoModel');
// var User = require('../models/userModel');


		//GET posts
		app.get('/api/todos', function(req, res) {
			//here we call the mongoose find function to grab all tasks. **don't need to use an array
			Todo.find(function(err, todos){
				if (err) return err;
				res.send(todos);
			});
		});

		//GET post @ _id
		app.get('/api/todos/:id',function(req, res){

			// Todo.findById(req.params.id, function(err, todo){ //other valid syntax { _id : req.params.id}
			// 	Todo.populate('creator').exec(function, err, todo){
			// 	if (err) return err;
			// 	res.send(todo);
			// }
			// });
			// console.log(req.body);

			//we're finding the given todo and "populating" its user field (which originally contains a user id) with the actual users data	
			Todo
			.findById(req.params.id)
			.populate('creator')
			.exec(function(err, post){
				console.log(post);
				if (err) return "what";
				res.send(post);
			});
		});

		//POST or create NEW post
		app.post('/api/todos', function(req, res){

			User.findById("573dda59c63df44014ca7403")
			req.body.creator = "573dda59c63df44014ca7403"
			Todo.create(req.body, function(err, todo){
				res.send(todo);
				console.log("HOWDY THERE" + todo);
				// res.end();
			});
		});

		//DELETE post @ _id
		app.delete('/api/todos/:id', function(req, res){
			Todo.findByIdAndRemove(req.params.id, function(err){
				if (err) throw err;
				res.send('Deleted todo!');
			});
		});

		//UPDATE post @ _id
		app.put('/api/todos/:id', function(req, res){
			var update = {
				task : req.body.task,
				done : req.body.done
			}

			Todo.findByIdAndUpdate(req.params.id, update, function(err){
				if (err) throw err;
				res.send("Updated!")
			});
		});

}