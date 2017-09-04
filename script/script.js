(function(document, $, wordSearch) {
	//Menu toggle
	$("#menu-toggle").click(function(e) {
	    e.preventDefault();

	    $("#wrapper").toggleClass("toggled");
	});

	$("#generate").click(function() {
		//Get array of words of textarea
	 	var words = document.getElementById("words").value.toLowerCase().split(" ");
	 	
	 	var index = words.indexOf("") //Ignore extra space at the end of the textarea
	 	while(words.indexOf("") != -1) {
	 		words.splice(index, 1);
	 		index = words.indexOf("")
	 	}

	 	//Calls function to generate a game
	    wordSearchGame().newGame('#wordSearch', '#wordsBar', words);
	});


} (document, jQuery, wordSearch));