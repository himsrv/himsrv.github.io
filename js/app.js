var moves = 0, // stores the total moves made
    matched = 0, // stores the total matching pairs found till now
    limit = 10; // the initial breakpoint of star ratings


var classes = document.querySelectorAll('.card .fa');
// List (values) to hold all cards
var values = Array.prototype.map.call(classes, function(el) {
    return el.className;
});

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

shuffle(values); //Cards are shuffled before a new game or on restart

// Reassigning shuffled cards back to the deck
var i = 0;
$(".card").each(function(i) {
    $(this).find('.fa').removeClass().addClass(values[i]);
});

//Array that stores current no of opened cards
var openedCards = [];


/* This function adds the opened card to openedCards array

  #Also, if a match is found lockMatchedCards is called
  #If there is no match, current array of opened cards is cleared
  #In both the above cases, moves is incremented by 1
*/

function addToOpenedCards(card) {
    openedCards.push($(card).find('.fa').attr('class'));
    if (openedCards.length == 2) {
        // check if cards are matching
        if (openedCards[0] === openedCards[1]) {
            // lock the cards in open position
            lockMatchedCards(openedCards[0], openedCards[1]);
            //update the moves count
            updateMoves();
            //update the matching pairs found count
            matched++;
            // check if all pairs are found
            if (matched == 8) {
                // stop the timer
                clearInterval(timerVar);
                //set the time taken by player to be displayed in gameSummary
                $('#timerFinal').html(totalSeconds);
                //set the total moves used by player
                $('#finalMoves').html(moves);
                // display player's game Summary
                $("#gameSummary").modal();
            }
        } else {
            //clear the array when no match is found
            openedCards = [];
            //update the moves count
            updateMoves();
            //when no match is found, hide the cards
            setTimeout(hideCards, 1000);
        }
    }

}

//updates the moves used by the player dynamically
function updateMoves() {
    moves++;
    $('.moves').html(moves);
    updateRating();
}

//update the current Rating of player dynamically
function updateRating() {
    if (moves > limit) {
        $('.stars li:last-child').remove();
        $('.finalRating li:last-child').remove();
        limit = 26;
    }
}

//locks the matched card in open position on the deck
function lockMatchedCards(card1, card2) {
    $('.card').each(function() {
        if ($(this).find('.fa').hasClass(card1)) {
            $(this).addClass('match show open');
        }
    });
    openedCards = [];
}

//Hides the two opened Cards when no match is found
function hideCards() {
    $('.card').each(function() {
        if (!$(this).hasClass('match')) {
            $(this).removeClass('show');
            $(this).removeClass('open');
        }
    });
}

//Opens the card which is being clicked
function displayCard(card) {
    $(card).addClass('show');
    $(card).addClass('open');
}

//Event Listener for click event on the cards
$('.card').click(function() {
    if ($(this).hasClass('show')) {
        return false;
    }
    displayCard(this);
    addToOpenedCards(this);
});

//Restarts the game when prompted by user
function reload() {
    location.reload();
}

//sets a timer when the game starts
var timerVar = setInterval(countTimer, 1000);
var totalSeconds = 0;

function countTimer() {
    ++totalSeconds;
    var hour = Math.floor(totalSeconds / 3600);
    var minute = Math.floor((totalSeconds - hour * 3600) / 60);
    var seconds = totalSeconds - (hour * 3600 + minute * 60);
    document.getElementById("timer").innerHTML = hour + ":" + minute + ":" + seconds;
}
