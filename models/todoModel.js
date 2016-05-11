
//create the mongoose object
var mongoose = require('mongoose');

//Lets create the schema
var todoSchema = mongoose.Schema({
	task: String
});



// compiling the schema into a Model. First arg is the singular
// name of the collection (todos collection)
var Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;