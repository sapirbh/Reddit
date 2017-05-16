// variables that are visible to the whole script
var displayImages, typingTimer, doneTypingInterval = 1500;
var after;
var before;
var pageNo=0;
var value='cats';
/* a function in JQuery that invoked when the page is loaded */
$(document).ready(function() {
	
	// fetch the newest posts on /r/cats as default
	getSubRedditByText(value);	
});


/* search for a subreddit given a text */
function getSubRedditByText(value) {
	
	// fetch the hottest posts on /r/cats as default
	reddit.new(value).limit(50).fetch(function(response) {
		
		if (response !== undefined && response !== null && response.error === undefined) {
			console.log(response.data.children.length);
			// the response contains JSON parsed response from Reddit
			displayImages = response.data.children;//.concat();
			
			console.log(displayImages);
			// iterate the objects from the response and build a list of html images
			refreshImagesList(displayImages);
		}
	});
}


/* build the html list from array */
function refreshImagesList(array) {
	
	$(".cats-list").empty();
	var len = array.length;
	console.log(len);
	$ul = $('<ul></ul>');
	var counter = 0;
	var imageTypes = ['jpg','jpeg','tiff','png','gif','bmp'];
	for (var index = 0; counter < 9 && index < len; index++) {
		var imageUrl = array[index].data.url;
		
		// add only the images that their url has a valid image file
		
		
		if (imageUrl.indexOf(".jpg") >= 0) {
			var imageTitle = array[index].data.title;
			var imageId = array[index].data.id;
			$('<img></img>', {
src: imageUrl,
title: imageTitle,
id: imageId, 	// give the element the id of the corresponding object from displayImages
				//that way when the element is clicked we will know where to find the url in the array
click: function() { window.open("https://reddit.com" + getPostById($(this).attr("id")), "_blank"); },
class: 'cats-list-item img-thumbnail'
			}).appendTo($ul);
			counter++;
		}
		else console.log(imageUrl);
		if (counter == 1) {
			before="t3_"+imageId;
		}
		if (counter == 9) {
			after="t3_"+imageId;
		}
	}
	
	// wrap each image in a list item
	$ul.find('img').wrap('<li></li');
	$ul.appendTo('.cats-list');
};


function getPostById(id) {
	for (var index = 0; index < displayImages.length; index ++) {
		if (displayImages[index].data.id === id) {
			return displayImages[index].data.permalink;
		};
	}
};


/* function that invoked when the user type something */
$(document).ready(function() {

	// start a timer when the user releases a key
	$('#user-input').keyup(function() {
		clearTimeout(typingTimer);
		typingTimer = setTimeout(doneTyping, doneTypingInterval);
	});

	// clear the timeout when they press a key
	$('#user-input').keydown(function() {
		clearTimeout(typingTimer);
	});

	//user is finished typing
	function doneTyping () {
		getSubRedditByText($('#user-input').val());
	}
	
	$('#prev').click(function () {
		
		if (pageNo==0) {
			alert('This is the first page');
			return;
		}
		pageNo--;
		reddit.new(value).limit(50).before(before).fetch(function(response) {
		
		if (response !== undefined && response !== null && response.error === undefined) {
			console.log(response.data.children.length);
			displayImages = response.data.children;
		// iterate the objects from the response and build a list of html images
			refreshImagesList(displayImages);
		}
	});
	});
	
	$('#next').click(function () {
		pageNo++;
		reddit.new(value).limit(50).after(after).fetch(function(response) {
		
		if (response !== undefined && response !== null && response.error === undefined) {
			console.log(response.data.children.length);
			displayImages = response.data.children;
		// iterate the objects from the response and build a list of html images
			refreshImagesList(displayImages);
		}
	});
	});
});