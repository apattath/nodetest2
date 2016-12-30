// Userlist data array for fillling in info box
var userListData = [];

// DOM Ready
$(document).ready(function() {
	// Populate the user table on initial page load
	populateTable();

	// Username link click
	$('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

	// Add User button click
	$('#btnAddUser').on('click', addUser);

	// Delete user link click
	$('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
});

// Functions

// Fill table with data
function populateTable() {

	// Empty content string
	var tableContent = '';

	// jQuery AJAX call for JSON
	$.getJSON( '/users/userlist', function(data) {
		 // Stick our user data array into a userlist variable in the global object
		userListData = data;

		// For each item in our JSON, add a table row and cells to the content string
		$.each(data, function() {
			tableContent += '<tr>';
			tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
			tableContent += '<td>' + this.email + '</td>';
			tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
			tableContent += '<td><a href="#" class="linkupdateuser" rel="' + this.username + '">update</a></td>'; 
			tableContent += '</tr>';
		});

		// Inject the whole content string into our existing html table
		$('#userList table tbody').html(tableContent);
	});
};

function showUserInfo(event) {
	// Prevent link from firing
	event.preventDefault();

	// Retrieve username from link rel attribute
	var thisUserName = $(this).attr('rel');

	// Get index of object based on id value
	var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.username; }).indexOf(thisUserName);

	// Get our User object
	var thisUserObject = userListData[arrayPosition];

	// Populate Info Box
	$('#userInfoName').text(thisUserObject.fullname);
	$('#userInfoAge').text(thisUserObject.age);
	$('#userInfoGender').text(thisUserObject.gender);
	$('#userInfoLocation').text(thisUserObject.location);
};

function addUser(event) {
	event.preventDefault();

	// Basic validation - increase error count if any fields are blank
	var errorCount = 0;
	$('#addUser input').each(function(index, val) {
		if ($(this).val() === '') {errorCount++;}
	});

	// Check and make sure errorCount's still at zero
	if (errorCount === 0) {
		// If it is, compile all user info into one oebject
		var newUser = {
			'username': $('#addUser fieldset input#inputUserName').val(),
            'email': $('#addUser fieldset input#inputUserEmail').val(),
            'fullname': $('#addUser fieldset input#inputUserFullname').val(),
            'age': $('#addUser fieldset input#inputUserAge').val(),
            'location': $('#addUser fieldset input#inputUserLocation').val(),
            'gender': $('#addUser fieldset input#inputUserGender').val()		
        }

        // use AJAX to post object to adduser service
        $.ajax({
        	type: 'POST',
        	data: newUser,
        	url: '/users/adduser',
        	dataType: 'JSON'
        }).done(function(response) {
        	// check for successful response
        	if (response.msg === '') {
        		// clear form inputs
        		$('#addUser fieldset input').val('');

        		// Update table
        		populateTable();
        	}
        	else {
        		// if something goes wrong, alert error emssage
        		alert('Error: ' + response.msg);
        	}
        });
	}
	else {
		// If error count is > 0, error out
		alert('Please fill in all fields');
		return false;
	}
};

function deleteUser(event)
{
	event.preventDefault();

	// Pop up confirmation dialog
	var confirmation = confirm('Are you sure you want to delete this user?');

	// Check and make sure the user confirmed
	if (confirmation === true) {
		// If they did, delete
		$.ajax({
			type: 'DELETE',
			url: '/users/deleteuser/' + $(this).attr('rel')
		}).done(function (response) {
			// check for success response
			if (respnose.msg === '') {
				// update table
				populateTable();
			}
			else {
				alert('Error: ' + response.msg);
			}

		});
	}
	else {
		// If they said no to the confirmation dialog, do nothing
		return false;
	}
};