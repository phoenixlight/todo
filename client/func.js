


		//this function posts given data to api/database
		// POST REQUEST
			function submitTodo(){
				data2 = $('form').serialize();
				//sending form data2
				$.post("api/todos", data2, function(data) {
			
					console.log("created todo!");
					return false;
					});

				// $('#todoList').empty();
				displayTodos();
			};

		//this function is run every time that a li (*span) element is clicked. 
		//sends a DELETE request to our api
			function delfunc(item){
				var idStr = item.id;
				console.log(item);
				console.log(item.id);
				$.ajax({
					url: '/api/todos/' + idStr,
					type: 'DELETE',
					success: function() {
						console.log('deleted!');
					}
				});
			
			
			// remove current contentes of todo list from web page, then re-display the updated list (with delete)
			displayTodos();
			};

		//This function displayTodos on webpage and is activated during intial load.
			function displayTodos(){
				// $('#todoList').append('<ul>');
				$.get("/api/todos", function(data, status) {
					//ON success of GET request, append each todo to an area of the web page in list format 
					// var table = document.getElementById("todoList");
					$('#todoList').empty();
					console.log('why no empty');
					// var table = document.getElementById("todoTable");

					// $("#todoTable tr").remove(); 
					// //add the headers
					// row = table.insertRow(0);
					
					// var cell0 = row.insertCell(0);
					// var cell1 = row.insertCell(1);
					// var cell2 = row.insertCell(2);
					// var cell3 = row.insertCell(3);


					// cell0.innerHTML = "Delete";
					// cell1.innerHTML = "Task";
					// cell2.innerHTML = "Edit";
					// cell3.innerHTML = "Submit";
					// //add data
						
					// 	var i;
					// 	for (i = 0; i < data.length; i++) {
					// 		var row = table.insertRow(i+1);

					// 		var cell0 = row.insertCell(0);
					// 		var cell1 = row.insertCell(1);
					// 		var cell2 = row.insertCell(2);
					// 		var cell3 = row.insertCell(3);

					// 		console.log(data[i]);

					// 		// Add some text to the new cells:
					// 		cell0.innerHTML = "<span onClick='delfunc(this)'  id='" + data[i]._id + "'>" + "  X  </span>"
					// 		cell1.innerHTML = "<span id='" + data[i]._id + "'>" + data[i].task + "</span>"
					// 		cell2.innerHTML = "<input id='"+ data[i]._id + "' data-userid='" + data[i]._id + "'>" + "</input>"
					// 		cell3.innerHTML = "<input type='submit' value='Submit' onclick='editTodo(this)' id='" + data[i]._id +  "'></input>"
					// 	};
						
					$.each(data, function(){
						//USING STRING Concatenation
						$('#todoList').append(
							//start of list element 
							"<li class='list-group-item'>" +


							//defines the display of the todo element task itself
							"<span style='position:absolute;height:40px;width:300px;overflow:auto;'" + "data-showid='" + this._id + "' id='" + this._id + "'>" + this.task + "</span>" +

							//defines input text box
							"<input style='display:none'  id='"+ this._id + "' data-userid='" + this._id + "'>" + "</input>" + 

							//defines the submit button
							"<input style='display:none' type='submit' value='Submit' onclick='editTodo(this)' id='" + this._id +  "'></input>" +

							"<a onClick='editTodo2(this)' style='margin-left:75%;position:relative' href='#' class='btn btn-warning btn-sm'" +
							"id='" + this._id + 

							"'>Edit</a>" +


							// defines the clickable x which triggers delete function
							//contained within span to define a smaller clickcable width
						
							"<button style='margin-left:1% '  onClick='delfunc(this)'  id='" + this._id + "' type='button' class='btn btn-danger btn-sm'>Delete</button>" +


		

							//end of list element
							"</li>");
					});

				
				});
			
			};


		//function that hides task when edit button is clicked

		function editTodo2(item) {
			console.log('in edit #2');
			console.log(item.id);
			console.log($("[data-showid='"+ item.id + "']"));
			var tohide = $("[data-showid='"+ item.id + "']");
			tohide.style.display = "none";
		}


		//EDIT a todo 
			function editTodo(item){
					

				 	console.log(item.id);
					console.log($(item).attr('data-userid'));
					console.log($(item).val());


					console.log("over here  " + $("[data-userid='"+ item.id + "']").val());

					// selecting for the input field with a data attribute equal to the id of the submit button and grabbing its new value to update the task with
					var newValue = $("[data-userid='"+ item.id + "']").val();

					var upd = false;
					if (newValue) {
						var upd = true;
					}
				

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
		   

