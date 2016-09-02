  

// ===============================================================================================================================
// FUNCTIONS that are called from the HTML page, manipulating the view and database (by making API requests) =====================
// ===============================================================================================================================

//Displays todos on initial load as well as clearing old info of todos when called.

function displayTodos(toInsert){

	console.log('Display Todos');

	//Empty #todoList element
	$('#todoList').empty();


	$.get("/api/users/" + toInsert, function(data, status) {
		
		//clear page of current todolist inorder to update
		
		// console.log("HERE IS THE USER: ");

		if (data.todos == null) {
			console.log("totes null brah");
		}

		else {
		//iterate over each todo we get as a response
		$.each(data.todos, function(){
			var creator = this.creator;
			//defines the display of the todo element task itself
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

			var deleteButton = "<button style='margin-left:1% '  onClick='delfunc(this,event)'  id='" + this._id +
			 "' type='button' class='btn btn-danger btn-sm'>Delete</button>";

			 	// var deleteButton = "<button style='margin-left:1% '  onClick='delfunc(this," + creator + ")' ";

			
			// constructing html to append to our todoList list group
			$('#todoList').append(
				"<li class='list-group-item'>" + task + editBox + changeButton + editButton + deleteButton +  "</li>"
				);

			});

		};
	});

};

// POST REQUEST. i.e. the creation of a new todo
	function submitTodo(toInsert){
	
		submitData = $('form').serialize();
		
		// send a get req for currently logged in user ( @id toInsert)
		$.get('/api/users/' + toInsert, function( user ) {

		  // grab said users' todo list of *IDS* and place in updateArr
		  	var i;
		  	var updateArr = [];

		  //check if users todo list is null
		  if (user.todos != null) {
			for (i=0; i<user.todos.length; i++) {
					  		updateArr.push(user.todos[i]._id);
					  	}
		  }

		  	

			// post the new todo to /api/todos
			$.post("api/todos", submitData, function(data) {
						
				// here we push the new todo to updateArr		
				updateArr.push(data._id);
				
				update = { 
					username: user.username,
					password: user.password,
					todos: updateArr
					}

				// this section of code updates the Users personal todo list
				$.ajax({
					url: '/api/users/' + toInsert,
					type: 'PUT',
					data: update,
					success: function() {
						console.log('updated user todo list!');
		 				displayTodos(toInsert);
					}
			});

						
			}); // end of $.post(.....)

		}); // end of $.get(.....)

	}; //end of submit function

//DELETE REQUEST
function delfunc(item, event){
	event.stopPropagation();
	console.log('This here is the user');
	
	var idStr = item.id;

	//getting the right todo so we can find its creators id, and subsequently edit the cretor
	$.get("/api/todos/" + item.id, function(data, status) {
		console.log(data.creator._id);

		//modify this creators todo list!

		updateArr = [];

		// here we are grabbing the specific creator's infromation
		$.get("/api/users/" + data.creator._id, function(data2, status) {
			// console.log(data2);

			// copying creators orignal todo list but excluding the todo that needs to be deleted
			for (i=0; i<data2.todos.length; i++) {
				if (data2.todos[i]._id === data._id) {
					console.log(data2.todos[i]._id)
				}

				else {
					console.log(data2.todos[i]._id + "==" + data._id);
					updateArr.push(data2.todos[i]);
				}
			}

			// new info for the creator
			update = {
				username: data2.username,
				password: data2.password,
				todos: updateArr
			}

			//update with new info with a put request
			$.ajax({
				url: '/api/users/' + data.creator._id,
				type: 'PUT',
				data: update,
				success: function() {
					console.log('adjusted creators todo list!');
				}
			});	

			//delete the todo itself
			$.ajax({
				url: '/api/todos/' + data._id,
				type: 'DELETE',
				success: function() {
					console.log('deleted todo!');
					if (data.creator.todos==null) {
						console.log("So null brah.");
					}

						else {
						displayTodos(data.creator._id);
						}
				}
			});

		});
	//have todisplay logged in user, not hard coded users


	});
	
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
	// console.log('edit requested');
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
		success: function(todoData) {
			// console.log('updated!');
			// console.log("1 = " + todoData.creator)
			// console.log(todoData.task + "here is the todo data");
			displayTodos(todoData.creator);
		}
	});

	
};


// Section that toggles the done status (i.e. line through) of the task

$(document).ready(function() {

	 setInterval(displayTodos(), 500);

console.log('ready');
});
// Function that toggles line through on click of a todo.
// $('body').on("click", 'li', function(event) {

// 	//handles case where we clickj inside the edit text box
//  	if (event.target.nodeName == "INPUT") {
//  		return;
//  	}

//  	//otherwise topggle done value and stroke the task which was clicked
 	
//  	// defining the current task
// 	var currentTask = $(this).children('span');

// 	// toggling its stroked value with CSS class
//  	currentTask.toggleClass('stroked');

// 	// TASK IS DONE i.e. true, therefore  toggle it and change this.done = false
//  	if (currentTask.attr('done') == "true") {

//  		var id = $(currentTask).attr('id');
//  		var task = $(currentTask).text();

//  		var update2;
//  		update2 = {
//  			"task" : task,
//  			"done" : "false"
//  		}

// 		$.ajax({
// 			url: '/api/todos/' + id,
// 			type: 'PUT',
// 			data: update2,
// 			success: function(todoData) {
// 				console.log('updated!');
// 				displayTodos(todoData.creator);
// 			}
// 		});
// 	 	console.log('Updated done status to False');
//  	}


// // TASK IS NOT DONE i.e. false, therefore toggle it and change this.done = true
//  	else {	

//  		var done = $(currentTask).attr('done');
//  		var task = $(currentTask).text();
//  		var id = $(currentTask).attr('id');
 	
//  		var update2;
//  		update2 = {
//  			"task" : task,
//  			"done" : "true"
//  		}

// 		$.ajax({
// 			url: '/api/todos/' + id,
// 			type: 'PUT',
// 			data: update2,
// 			success: function(todoData) {
// 				console.log('updated!');
// 				 displayTodos(todoData.creator);
// 			}
// 		});

// 	 	console.log('Updated done status to True');

//  		}
 	
// 	});

// // displayTodos();
// });	
