var mongoose = require('mongoose');
var Todo = require('../models/todoModel');
var Schema = mongoose.Schema;

var userSchema = new mongoose.Schema({
	username: {type: String, unique:true},
	password: {type: String},
	firstname: String,
	lastname: String,
	todos: [{type: Schema.ObjectId, ref:'Todo'}]						//list of todo ids	
});

var User = mongoose.model('myusers', userSchema);

module.exports = User;