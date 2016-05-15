//Displays todos on initial load as well as clearing old info of todos when called.
function displayTodos(){

	$.get("/api/todos", function(data, status) {
		
		//clear page of current todolist inorder to update
		$('#todoList').empty();
		
		//iterate over each todo we get as a response
		$.each(data, function(){

			//defines the display of the todo element task itself
			var task = "<span style='position:absolute;height:40px;width:300px;overflow:auto;'" + 
			"data-taskID='" + this._id + "' id='" + this._id + "'>" + this.task + "</span>";

			//defines input text box for editing. hidden at start
			var editBox = "<input style='display:none; position:absolute' id='"+ this._id + 
			"' data-editBoxID='" + this._id + "'value='" + this.task + "'></input>";

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
	// console.log('hererere');
	event.stopPropagation();

	// selecting new data in editBox
	var newValue = $("[data-editBoxID='"+ item.id + "']").val();
	// console.log(newValue);

	// if editBox left empty update stays false
	var upd = false;

	if (newValue) {
		upd = true;
	}

	// update data containing the new value
	update = {
		"task" : newValue
	}

	if (upd) {
    	$.ajax({
			url: '/api/todos/' + item.id,
			type: 'PUT',
			data: update,
			success: function() {
				console.log('updated!');
			}
		});
	}

	displayTodos();
};

// LINE THROUGH on click of a todo
$(document).on("click", 'li', function(event) {
	event.stopPropagation();
 	// $(this).children('span').css('text-decoration', "line-through");
 	$(this).children('span').toggleClass('stroked')
	});
