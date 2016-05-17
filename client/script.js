//Displays todos on initial load as well as clearing old info of todos when called.
function displayTodos(){

	$.get("/api/todos", function(data, status) {
		
		//clear page of current todolist inorder to update
		$('#todoList').empty();
		
		//iterate over each todo we get as a response
		$.each(data, function(){
			var task;
			//defines the display of the todo eleme	nt task itself
			if (this.done) {
				 task = "<span style='position:absolute;height:40px;width:300px;overflow:auto;text-decoration:line-through;'" + 
				"data-taskID='" + this._id + "' id='" + this._id + "' done='" + this.done + "'>" + this.task + "</span>";
			}
			else {
				 task = "<span style='position:absolute;height:40px;width:300px;overflow:auto;'" + 
				"data-taskID='" + this._id + "' id='" + this._id + "'done='" + this.done + "'>" + this.task + "</span>";
			}
			//defines input text box for editing. hidden at start
			var editBox = "<input style='display:none; position:absolute; width:50%;' id='"+ this._id + 
			"' data-editBoxID='" + this._id + "'value='" + this.task + "'done='" + this.done + "'></input>";

			//defines confirmation and submission of change. hidden at start
			var changeButton = "<button style='display:none; margin-left: 71%; position:relative' type='button' class='btn btn-success btn-sm' " +
			" onclick='editTodo(this, event)' id='" + this._id +  "' data-changeID='" + this._id + "'> Change</button>";

			//defines the button which brings up editBox and changeButton
			var editButton = "<a onClick='editInit(this, event)' style='margin-left:75%;position:relative' class='btn btn-warning btn-sm'" +
				"id='" + this._id + "'data-editID='" + this._id + "'>Edit</a>"

			var deleteButton = "<button style='margin-left:1% '  onClick='delfunc(this, event)'  id='" + this._id +
			 "' type='button' class='btn btn-danger btn-sm'>Delete</button>";

			
			// constructing html to append to our todoList list group
			$('#todoList').append(
				"<li class='list-group-item'>" + task + editBox + changeButton + editButton + deleteButton + "</li>"
				);

		});
	});

};

// POST REQUEST
	function submitTodo(){
		// console.log('hererere');
		data2 = $('form').serialize();
		//sending form data2
		$.post("api/todos", data2, function(data) {
			console.log("created todo!");
			// console.log('hererere');
			});
		displayTodos();
	};

//DELETE REQUEST
function delfunc(item, event){
	event.stopPropagation();
	var idStr = item.id;
	$.ajax({
		url: '/api/todos/' + idStr,
		type: 'DELETE',
		success: function() {
			console.log('deleted!');
		}
	});
	displayTodos();
};

// Bring up edit box and change button while hiding task data and edit button

function editInit(item, event) {
// console.log('here');
	event.stopPropagation();

	// hide the task data itself
	$("[data-taskID='"+ item.id + "']").css('display', 'none');

	// hide the edit button itself
	$("[data-editID='" + item.id + "']").css('display', 'none');

	// show the edit box
	$("[data-editBoxID='" + item.id + "']").css('display', 'inline');

	// show the input submit edit box 
	$("[data-changeID='" + item.id + "']").css('display', 'inline');

}


// PUT REQUEST
function editTodo(item, event){
	console.log('edit requested');
	event.stopPropagation();

	// selecting new data in editBox
	var newValue = $("[data-editBoxID='"+ item.id + "']").val();
	var done = $("[data-editBoxID='"+ item.id + "']").attr('done');

	// update data containing the new value
	update = {
		"task" : newValue,
		"done" : done
	}

	$.ajax({
		url: '/api/todos/' + item.id,
		type: 'PUT',
		data: update,
		success: function() {
			console.log('updated!');
		}
	});

	displayTodos();
};

$(document).ready(function() {

	 setInterval(displayTodos(), 500);

console.log('ready');

// Function that toggles line through on click of a todo.
$('body').on("click", 'li', function(event) {

	//handles case where we clickj inside the edit text box
 	if (event.target.nodeName == "INPUT") {
 		return;
 	}

 	//otherwise topggle done value and stroke the task which was clicked
 	
 	// defining the current task
	var currentTask = $(this).children('span');

	// toggling its stroked value with CSS class
 	currentTask.toggleClass('stroked');

	// TASK IS DONE i.e. true, therefore  toggle it and change this.done = false
 	if (currentTask.attr('done') == "true") {

 		var id = $(currentTask).attr('id');
 		var task = $(currentTask).text();

 		var update2;
 		update2 = {
 			"task" : task,
 			"done" : "false"
 		}

		$.ajax({
			url: '/api/todos/' + id,
			type: 'PUT',
			data: update2,
			success: function() {
				console.log('updated!');
				 displayTodos();
			}
		});
	 	console.log('Updated done status to False');
 	}


// TASK IS NOT DONE i.e. false, therefore toggle it and change this.done = true
 	else {	

 		var done = $(currentTask).attr('done');
 		var task = $(currentTask).text();
 		var id = $(currentTask).attr('id');
 	
 		var update2;
 		update2 = {
 			"task" : task,
 			"done" : "true"
 		}

		$.ajax({
			url: '/api/todos/' + id,
			type: 'PUT',
			data: update2,
			success: function() {
				console.log('updated!');
				 displayTodos();
			}
		});

	 	console.log('Updated done status to True');

 		}
 	
	});
});	
