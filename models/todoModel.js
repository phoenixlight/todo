var User = require('../models/userModel');

//create the mongoose object
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Lets create the schema
var todoSchema = mongoose.Schema({
	task: String,
	done: { 
		type: Boolean,
		default: false
		},
	creator: {
		type: Schema.ObjectId,
		ref: 'myusers'
	}
});

// compiling the schema into a Model. First arg is the singular
// name of the collection (todos collection)
var Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;