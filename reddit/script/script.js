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
	pageNo=0;
	// fetch the hottest posts on /r/value 
	reddit.new(value).limit(50).fetch(function(response) {
		if (response !== undefined && response !== null && response.error === undefined) {
			// the response contains JSON parsed response from Reddit
			displayImages = response.data.children;
			// iterate the objects from the response and build a list of html images
			refreshImagesList(displayImages);
		}
	});
}


/* build the html list from array usind jQuery*/
function refreshImagesList(array) {
	$(".cats-list").empty();
	var len = array.length;
	$ul = $('<ul></ul>');
	var counter = 0;
	var imageTypes = ['jpg','jpeg','tiff','png','gif','bmp'];
	for (var index = 0; counter < 9 && index < len; index++) {
		var imageUrl = array[index].data.url;
		
		// add only the images that their url has a valid image file
		
		for(var i=0; i< imageTypes.length; i++)
		{
			if((imageUrl.indexOf(imageTypes[i])>=0)&&(imageUrl.indexOf("imgur")<0))
			{
					var imageTitle = array[index].data.title;
					var imageId = array[index].data.id;
					$('<img></img>', {
						src: imageUrl,
						title: imageTitle, //give a title for hovering on images
						id: imageId, 	// give the element the id of the corresponding object from displayImages
						//that way when the element is clicked we will know where to find the url in the array
						click: function() { window.open("https://reddit.com" + getPostById($(this).attr("id")), "_blank"); },
						class: 'cats-list-item img-thumbnail'
					}).appendTo($ul);
					counter++; //in order to make pagination for 9 images per page
			}
				
		}
		//if it is the first image on page - pagination with Reddit
		if (counter == 1) {
			before="t3_"+imageId;
		}
		//if it is the last image on page - pagination with Reddit

		if (counter == 9) {
			after="t3_"+imageId;
		}

	}
	
	// wrap each image in a list item
	$ul.find('img').wrap('<li></li');
	$ul.appendTo('.cats-list');
};

/*make the permalink of an image*/
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
		value=$('#user-input').val();
		getSubRedditByText(value);
	}
	//while user perss on prev button- make pagination if allowed (not in first page)
	$('#prev').click(function () {
		//if we are in the first page- alert 
		if (pageNo==0) {
			alert('This is the first page');
			return;
		}
		pageNo--;
		// fetch the hottest posts on /r/value 
		reddit.new(value).limit(50).before(before).fetch(function(response) {
		
		if (response !== undefined && response !== null && response.error === undefined) {
			displayImages = response.data.children;
		// iterate the objects from the response and build a list of html images
			refreshImagesList(displayImages);
		}
	});
	});
	//while user perss on next button- make pagination
	$('#next').click(function () {
		pageNo++;
		reddit.new(value).limit(50).after(after).fetch(function(response) {
		
		if (response !== undefined && response !== null && response.error === undefined) {
			displayImages = response.data.children;
		// iterate the objects from the response and build a list of html images
			refreshImagesList(displayImages);
		}
	});
	});
});