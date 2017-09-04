'use strict';

var wordSearch = function () {
	var HEIGHT = 10;
	var WIDTH  = 10;

	var puzzle = [];
	var alphabet = ("abcdefghijklmnopqrstuvwxyz").split("");

	// Initiate puzzle matrix
	var puzzleInitiate = function() {
		for (var i = 0; i < HEIGHT; i++) {
			puzzle[i] = [];
			for (var j = 0; j < WIDTH; j++) {
				puzzle[i][j] = "";
			}
		}
	};

	// Check if the word is possible in certain direction,
	// because it can collide with an already placed word 
	// in the puzzle.
	var checkWord = function(dir, word, x, y) {
		if (dir) {
			for (var i = x, j = y, k = 0; k < word.length; i++, k++) {
				if (puzzle[i][j] != word[k] && puzzle[i][j] != "")
					return false;
			}
		}
		else {
			for (var i = x, j = y, k = 0; k < word.length; j++, k++) {
				if (puzzle[i][j] != word[k] && puzzle[i][j] != "")
					return false;
			}
		}
		return true;
	};

	// Place a word in the puzzle in a random position and
	// direction (updown or leftright)
	var placeWord = function(word) {
		var dir = Math.random() < 0.5 ? 0 : 1;

		if (dir) { // Vertical = 1
			var maxHeight = HEIGHT - word.length + 1;
			var x = Math.floor(Math.random() * maxHeight); // Max Height
			var y = Math.floor(Math.random() * WIDTH); // y position
			if (checkWord(dir, word, x, y)) {
				for (var i = x, j = y, k = 0; k < word.length; i++, k++) {
					puzzle[i][j] = word[k];
				}
			}
			else placeWord(word);
		}
		else { // Horizontal = 0
			var maxWidth = WIDTH - word.length + 1;
			var x = Math.floor(Math.random() * WIDTH); // Max Width
			var y = Math.floor(Math.random() * maxWidth); // x position
			if (checkWord(dir, word, x, y)) {
				for (var i = x, j = y, k = 0; k < word.length; k++, j++) {
					puzzle[i][j] = word[k];
				}
			}
			else placeWord(word);
		}
	};

	// Fills the empty spaces of the puzzle with random chars.
	var fillPuzzle = function() {
		for (var i = 0; i < HEIGHT; i++) {
			for (var j = 0; j < WIDTH; j++) {
				if(puzzle[i][j] == "")
					puzzle[i][j] = alphabet[Math.floor(Math.random() * 26)]
			}
		}
	};


	return {
		// Return the puzzle matrix
		generatePuzzle: function(wordsArray) {
			// Create a copy of wordsArray sorte by
			// length decrescently, because it makes
			// easier to the algorithm to fit words.
			var words = wordsArray.slice(0).sort(
				function(a,b) {
					return b.length > a.length;
				}
			);

			// Check if the biggest word is possible to
			// fit in the puzzle.
			var max = HEIGHT > WIDTH ? HEIGHT : WIDTH;
			if(words[0].length > max) {
				var alert = $("#alert");
				alert.html("Only words with " + max + " or less characters.");
				alert.animate({opacity:1}, 300);
				alert.animate({opacity:0}, 2000);
				return;
			}

			puzzleInitiate();
			while (words.length > 0){
				var word = words.shift();
				placeWord(word);
			}

			fillPuzzle();
			console.log(puzzle);
			return puzzle;
		}
	};
}

var wordSearchGame = function() {
	
	var words;

	// Draw the words table in the jQuery elem
	var drawWords = function(elem, words) {
		var output = '<ul>';
		for (var i = 0; i < words.length; i++) {
			var word = words[i];
			output += '<li class="word" id="' + word + '">' + word + '</li>';
		}
		output += '</ul>';	
		$(elem).html(output);
	}

	// Draw the puzzle int the jQuery elem
	var drawPuzzle = function(elem, puzzle) {
		var output = "";
		for (var i = 0; i < puzzle.length; i++) {
			output += '<div>';
			for (var j = 0; j < puzzle[i].length; j++) {
				output += '<button class="puzzleSquare" x="' + j
				output += '" y="' + i + '">';
            	output += puzzle[i][j] || '&nbsp;';
            	output += '</button>'; 
			}
			output += "</div>";
		}
		$(elem).html(output);
	}

	var startSquare, selectedSquares = [], curWord = '', curDir = '';

	// Event that starts the boxes selection
	var startSelection = function() {
		$(this).addClass('selected');
		startSquare = this;
		selectedSquares.push(this);
		curWord = $(this).text();
	}

	// Event that handle touching
	var touchMove = function(e) {
		var xPos = e.originalEvent.touches[0].pageX;
		var yPos = e.originalEvent.touches[0].pageY;
		var targetElement = document.elementFromPoint(xPos, yPos);
		selection(targetElement);
	}

	// Event that handle mouse movement
	var mouseMove = function() {
		selection(this);
	}

	// Event that ends boxes selection and checks
	// if the word is valid or not
	var endSelection = function() {
		var found = false;
		for (var i = 0; i < words.length; i++) {
			if(words[i] == curWord) {
				$('.selected').addClass('found');
				words.splice(i,1);
				$('#'+curWord).addClass('wordFound');
				found = true;
				break;
			}
		}

		// Alert a wrong selection
		if(!found) {
			var alert = $("#alert");
			alert.html("Wrong selection!");
			alert.animate({opacity:1}, 100);
			alert.animate({opacity:0}, 1500);
		}

		// If there are no more words in the array
		// than it is finished
		if(words.length === 0) {
			$('.puzzleSquare').addClass('finished');
		}


		$('.selected').removeClass('selected');
		startSquare = null;
		selectedSquares = [];
		curWord = '';
		curDir = null;
	}

	// Function that handle the selection events
	var selection = function(target) {
		if(!startSquare) {
			return;
		}

		var lastSquare = selectedSquares[selectedSquares.length-1];
		if (lastSquare == target) {
			return;
		}

		var deselect;
		for (var i = 0; i < selectedSquares.length; i++) {
			if(selectedSquares[i] == target) {
				deselect = i+1;
				break;
			}
		}

		while (deselect < selectedSquares.length) {
			$(selectedSquares[selectedSquares.length-1]).removeClass('selected');
			selectedSquares.pop();
			curWord = curWord.substr(0, curWord.length-1);
		}
		
		var newDirection = calcDirection(
			$(startSquare).attr('x')-0,
			$(startSquare).attr('y')-0,
			$(target).attr('x')-0,
			$(target).attr('y')-0
		);

		if (newDirection) {
			while (lastSquare !== startSquare) {
				$(lastSquare).removeClass('selected');
				lastSquare = selectedSquares.pop();
			}
			selectedSquares = [startSquare];
			curWord = $(startSquare).text();
			curDir = newDirection;
		}

		var dir = calcDirection(
			$(lastSquare).attr('x')-0,
			$(lastSquare).attr('y')-0,
			$(target).attr('x')-0,
			$(target).attr('y')-0
		);

		if(!dir) {
			return;
		}
		else if (!curDir || curDir == dir){
			$(target).addClass('selected');
			selectedSquares.push(target);
			curWord += $(target).text();
		}
	}

	// Given two words calculate the direction
	// if they are next to each other
	var calcDirection = function(x1,y1,x2,y2) {
		//Up -> 1
		if(x2 == x1 && y2 == y1 -1) {
			return 1;
		}
		//Right -> 2
		else if(x2 == x1 + 1 && y2 == y1) {
			return 2;
		}
		//Down -> 3
		else if(x2 == x1 && y2 == y1 + 1) {
			return 3;
		}
		//Left -> 4
		else if(x2 == x1 - 1 && y2 == y1) {
			return 4;
		}
		return null;
	}

	return {
		newGame: function(elemPuzzle, elemWords, wordsList) {
			words = wordsList.sort();

			console.log(words);
			var puzzle = wordSearch().generatePuzzle(words);
			
			if(puzzle) {
				$("#alert").html("");
				drawPuzzle(elemPuzzle, puzzle);
				drawWords(elemWords, words);
			}
			
			$('.puzzleSquare').mousedown(startSelection);
          	$('.puzzleSquare').mouseenter(mouseMove);
          	$('.puzzleSquare').mouseup(endSelection);
          	$('.puzzleSquare').on("touchstart", startSelection);
          	$('.puzzleSquare').on("touchmove", touchMove);
          	$('.puzzleSquare').on("touchend", endSelection);
		}
	}
};

