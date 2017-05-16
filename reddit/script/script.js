

// variables that are visible to the whole script
var displayImages;


/* a function in JQuery that invoked when the page is loaded */
$(document).ready(function() {
	
	// get the newest posts on /r/cats as default
	getSubRedditByText('cats');	
});


/* search for a subreddit given a text */
function getSubRedditByText(value) {
	
	// fetch the hottest posts on /r/cats as default
	reddit.new(value).fetch(function(response) {
		
		if (response !== undefined && response !== null && response.error === undefined) {

			// get the array of images from the response
			displayImages = response.data.children.concat();
			
			// iterate the objects from the array and build a list of html images
			refreshImagesList(displayImages)	
		}
	});
}


/* build the html list from array */
function refreshImagesList(array) {
	
	$(".cats-list").empty();
	var len = array.length,
	$ul = $('<ul></ul>'), $li;
	for (var index = 0; index < len; index++) {
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
class: 'cats-list-item'
			}).appendTo($ul);
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
	$('#user-input').keyup(function() {
		getSubRedditByText($('#user-input').val());
	});
});