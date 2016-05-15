


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
					event.stopPropagation();
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

							//defines input text box for editing. hidden @ start
							"<input style='display:none; position:absolute'  id='"+ this._id + "' data-userid='" + this._id + "'value='" + this.task

							+  "'>" + "</input>" + 

							//defines the submit button **Add left padding**
							"<button style='display:none; margin-left: 71%; position:relative' type='button' class='btn btn-success btn-sm' onclick='editTodo(this)' id='" + this._id +  

							"' data-showid2='" + this._id 

							+ "'> Change</button>" +

							"<a onClick='editTodo2(this)' style='margin-left:75%;position:relative' class='btn btn-warning btn-sm'" +
							"id='" + this._id + "'data-edithide='" + this._id +

							"'>Edit</a>" +


							// defines the clickable x which triggers delete function
							//contained within span to define a smaller clickcable width
						
							"<button style='margin-left:1% '  onClick='delfunc(this)'  id='" + this._id + "' type='button' class='btn btn-danger btn-sm'>Delete</button>" +


		

							//end of list element
							"</li>");
					});

				
				});
			
			};


			// this determines if a li element is clicked, excludes buttons within the li element
			$(document).on("click", 'li', function(event) {
					event.stopPropagation();
					// if ($(event.target).is('li')){
			  // 			alert("Handler for .click() called.");
			  //  			console.log("clicked fool");
			  //  			console.log($(this).children('span').attr);
			  //  			//TODO: ADD IN CROSS OUT EFFECT


			  //  		}
			  console.log($(this).children('span').css('text-decoration', "line-through"));
			   		// alert("propogation stopped!");
				});
  

			// function crossOut() {
			// 	event.stopPropagation();
			// 	alert('crossed out!');
			// }

		//function that hides task when edit button is clicked

		function editTodo2(item) {
			event.stopPropagation();
			console.log('in edit #2');
			console.log(item.id);
			console.log($("[data-showid='"+ item.id + "']"));
			var tohide = $("[data-showid='"+ item.id + "']");

			// the input edit box 
			var toshow = $("[data-userid='" + item.id + "']");

			// the input submit edit box 
			var toshow2 = $("[data-showid2='" + item.id + "']");

			//edit button 
			var tohide2 = $("[data-edithide='" + item.id + "']");

			console.log(typeof tohide.style);

			console.log("here " + tohide.css('display', 'none'));
			console.log("here " + toshow.css('display', 'inline'));

			console.log("here " + toshow2.css('display', 'inline'));
			console.log("here " + tohide2.css('display', 'none'));
			// tohide.style.display = "none";

			// displayTodos();
		}


		//EDIT a todo 
			function editTodo(item){
						event.stopPropagation();

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
		   
