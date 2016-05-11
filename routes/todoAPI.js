var Todo = require('../models/todoModel');


module.exports = function(app) {
		//API CODE

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
			Todo.findById(req.params.id, function(err, todo){ //other valid syntax { _id : req.params.id}
				if (err) return err;
				res.send(todo);
			});
		});

		//POST or create NEW post
		app.post('/api/todos', function(req, res){
			Todo.create(req.body, function(err, todo){
				res.send("Created new todo");
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
				task : req.body.task
			}

			Todo.findByIdAndUpdate(req.params.id, update, function(err){
				if (err) throw err;
				res.send("Updated!")
			});
		});

}