// ==== GLOBAL VARIABLES ==== //


let playerNumber = null;
let quizSubject = null;
let quizDifficulty = null;
let players = []; // Store player information
let maxQuestionsPerPlayer = 0;
let totalRounds = 0;
let currentPlayerIndex = 0;
let currentQuestionIndex = 0;
const colors = ['red', 'green', 'blue', 'orange'];
let timerInterval; // Variable to stock the timer
// Store all the questions presented during the quiz.
// Used to keep track of the questions asked in order to display them later
// on the review screen along with the correct answers and players' responses.
let currentQuestionSet = [];

// Selection of screens
const screen1 = document.querySelector('.screen1');
const screen2 = document.querySelector('.screen2');
const screen3 = document.querySelector('.screen3');
const screen4 = document.querySelector('.screen4');
const screen5 = document.querySelector('.screen5');

// Buttons in screen1
const playerButtons = document.querySelectorAll('.playerNumberButtons button');

// Buttons in screen2
const subjectButtons = document.querySelectorAll('.subjectDifficultyButtons button[subject]');
const difficultyButtons = document.querySelectorAll('.subjectDifficultyButtons button[difficulty]');
const leaveButton = document.getElementById('leaveButton');
const startButton = document.getElementById('startButton');

// Buttons in screen3
const answersContainer = document.querySelector('.answerButtons');
const submitButton = document.getElementById('submitButton');

// Buttons in screen4
const reviewButton = document.getElementById('reviewButton');
const restartButton = document.getElementById('restartButton');

// Buttons in screen5
const leaveReviewButton = document.getElementById('leaveReviewButton');

// References to elements in screen3
const playerTurnElement = document.querySelector('.screen3 h3'); // It's Player 1-4's turn
const questionElement = document.querySelector('.screen3 h2'); // Question?

// References to elements in screen5
const reviewBoard = document.querySelector('.reviewBoard');



// ==== AUDIO & SOUNDS ==== // 

// The managment of the music if made inside the start button & the displayWinners function

const quizMusic = document.getElementById('quizMusic');
const clickSound = document.getElementById('clickSound');

// Makes sound for the all buttons
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
        // Reset the sound and play it
        clickSound.currentTime = 0;
        clickSound.play();
    });
});

// Makes sound for the answers buttons
document.querySelectorAll('.answerButtons').forEach(button => {
    button.addEventListener('click', () => {
        // Reset the sound and play it
        clickSound.currentTime = 0;
        clickSound.play();
    });
});



// ==== BUTTONS ==== //

// Gives the player number
playerButtons.forEach(button => {
    button.addEventListener('click', () =>
      {
        playerNumber = button.getAttribute('playerNumber'); // Get the player number
        showScreen(screen2); // Display screen2 once the player number selected
    });
});

// Manages leave button from the screen2 to go back to screen1
leaveButton.addEventListener('click', () =>
    {
      showScreen(screen1);
});

// Gives the quiz subject
subjectButtons.forEach(button => {
    button.addEventListener('click', () =>
      {
        quizSubject = button.getAttribute('subject');
    });
});

// Gives the quiz difficulty
difficultyButtons.forEach(button => {
    button.addEventListener('click', () =>
      {
        quizDifficulty = button.getAttribute('difficulty');
    });
});

// Let only one subject button and one difficulty button in the clicked color, once clicked
document.querySelectorAll('.subjectDifficultyButtons').forEach(container => {
    container.addEventListener('click', (event) =>
      {
        const button = event.target; // Clicked button
        if (button.tagName === 'BUTTON') {
            // Delete 'active' only for the buttons of the same group
            container.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
            // Add 'active' to the clicked button
            button.classList.add('active');
        }
    });
});

// Plays the music and manages start button from the screen2 to go to screen3 & starting the quiz
startButton.addEventListener('click', () => {
    quizMusic.play();
    if (quizSubject && quizDifficulty) {  // Check if the quiz subject and difficulty have been selected
        initializeGame(); // Initialize the game with the selected options
        showScreen(screen3);
    } else {
        alert('Please select a topic and a difficulty before starting.');
    }
});

// Manages submit button
submitButton.addEventListener('click', () => {
    handleNextTurn(false);
});

// Manages restart button from the leaderboard to go back to screen1
restartButton.addEventListener('click', () => {
    location.reload(); // Reload the page to restart
});

// Manages review button to go to the review screen
reviewButton.addEventListener('click', () => {
    //showScreen(screen5);
    displayReview();
});

// Manages leave button from the review screen to go back to the leaderboard
leaveReviewButton.addEventListener('click', () =>
    {
      showScreen(screen4);
});



// ==== INITIALIZATION OF THE PROGRAM ==== //

showScreen(screen1);



// ==== SECONDARY FUNCTIONS ==== //

// Display a screen and hiding others
function showScreen(screenToShow) {
    [screen1, screen2, screen3, screen4, screen5].forEach(screen =>
      {
        screen.style.display = 'none'; // Hide all screens
    });
    screenToShow.style.display = 'block'; // Display the selected screen
}

// Initialize the quiz
function initializeGame() {
    players = Array.from({ length: parseInt(playerNumber) }, (_, i) => ({
        id: i + 1, // Unique ID for each player
        score: 0, // Initial for of the player
        answers: [] // Array to stock the player's answers
    }));
    maxQuestionsPerPlayer = quizDifficulty === 'easy' ? 3 : quizDifficulty === 'medium' ? 4 : 5;
    totalRounds = players.length * maxQuestionsPerPlayer;
    currentPlayerIndex = 0;
    currentQuestionIndex = 0;
    displayPlayerTurn();
    loadQuestion();
}

// Display the turn of the current player
function displayPlayerTurn() {
    const currentPlayer = players[currentPlayerIndex];
    playerTurnElement.textContent = `It's Player ${currentPlayer.id}'s turn`;
    playerTurnElement.style.color = colors[currentPlayer.id - 1]; // Display It's Player 1-4's turn in the color of the player
}

// Gives questions by subject
function getQuestionsBySubject() {
    if (quizSubject === 'mixed')
      {
      const allQuestions = [...data.HTML, ...data.CSS, ...data.JavaScript];
      return allQuestions;
    }
    return data[quizSubject];
}

// Gives a random integer
function getRandomInt(min, max) {
    min = Math.ceil(min); // Rounded up
    max = Math.floor(max); // Rounded down
    return Math.floor(Math.random() * (max - min + 1)) + min; // Inclusive
}

// Start the timer and start the next turn and the end of it
function startTimer() {
    // Make sure no timer is running
    if (timerInterval) { 
        clearInterval(timerInterval); 
    }
    let timeLeft = 10; // Timer duration
    const timerElement = document.getElementById('timer'); // Element to display the timer

    // Start to count and ending the turn
    timerInterval = setInterval(() => {
        if (timeLeft <= 0) { // If the timer is finished the next turn start
            clearInterval(timerInterval); // Stop the timerInterval to prevent the function from continuing to run
            timerInterval = null; // Reset the variable
            handleNextTurn(true); // Start the next turn, true indicates that the timer is finish
        } else {
            if (timerElement) {
                timerElement.textContent = `Time left: ${timeLeft} seconds`; // Met à jour l'affichage
            }
        }
        timeLeft--;
    }, 1000); // Execute the code in setInterval every 1000 ms
}

// Stop the timer
function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval); // Stop the timer
        timerInterval = null; // Reset the variable
    }
}



// ==== PRIMARY FUNCTIONS ==== //

// Loads a new question, displays it on the screen, tracks displayed questions & prepares the answer buttons
function loadQuestion() {
    const questions = getQuestionsBySubject();
    currentQuestion = questions[getRandomInt(0, questions.length - 1)]; // Select a random question

    // Initialize the global array to stock questions
    if (!window.currentQuestionSet) {
        window.currentQuestionSet = []; // Initialize the global array if it doesn't exist.
    }
    currentQuestionSet.push(currentQuestion); // Ajoute la question actuelle au tableau global

    questionElement.textContent = currentQuestion.Question; // Display the question

    answersContainer.innerHTML = ''; // Reset answers buttons

    // Create answers buttons
    currentQuestion.Answers.forEach((answer, index) => {
        const button = document.createElement('button'); // Create a button for each answer
        button.textContent = answer; // Define the text as the answer
        button.classList.add('answer-button'); // Add CSS
        button.setAttribute('data-answer', index); // Add an attribut for the index of the answer

        // Add a click element to select the answer
        button.addEventListener('click', () => {
            document.querySelectorAll('.answerButtons button').forEach(btn => {
                btn.classList.remove('active'); // Delete the active classe of others button when on is clicked
                btn.style.backgroundColor = ''; // Reset the color
            });

            button.classList.add('active'); // Mark the clicked button as "active" to take this answer as valid if the timer runs out
            button.style.backgroundColor = colors[players[currentPlayerIndex].id - 1]; // Highlight the clicked button in the player's color
        });

        answersContainer.appendChild(button); // Add the button to the container
    });

    startTimer(); // Initialize the timer for the current question
}

// Allocate points and go on to the next question
function handleNextTurn(isTimeout = false) { // By default isTimeout will be false
    const selectedAnswer = document.querySelector('.answerButtons button.active');
    const currentPlayer = players[currentPlayerIndex];

    // Gives point or not to the player
    if (selectedAnswer) { // Check if an answer was selected
        if (!currentPlayer.answers) { 
            currentPlayer.answers = []; // If the answers array does not exist it is initialized to an empty array
        }
        currentPlayer.answers[currentQuestionIndex] = selectedAnswer.textContent; // The selected answer is saved in the array

        if (selectedAnswer.textContent === currentQuestion.CorrectAnswer) {
            currentPlayer.score += 10; // If the text of the selected answer is equal to the correct answer, the player's score is increased by 10 points
        }
    } else {
        if (!currentPlayer.answers) {
            currentPlayer.answers = []; // Idem, if the answers array does not exist it is initialized to an empty array
        }
        currentPlayer.answers[currentQuestionIndex] = "No Answer"; // If no answer was selected, "No Answer" is stored in the array
    }

    currentQuestionIndex++;
    if (currentQuestionIndex >= totalRounds) { // Check if it is the end of the quiz
        stopTimer();
        displayWinners();
        return;
    }

    currentPlayerIndex = (currentPlayerIndex + 1) % players.length; // Increase the player's index with a modulo
    displayPlayerTurn();
    loadQuestion();
    startTimer();
}

// Display the leaderboard
function displayWinners() {
    quizMusic.pause();
    const winnerList = document.querySelector('.leaderBoard');

    // Sort the player by decreasing order
    const sortedPlayers = players.sort((a, b) => b.score - a.score);

    // Generates the HTML content of the podium with the respective colors
    winnerList.innerHTML = sortedPlayers
        .map(
            (player, index) =>
                `<p style="color: ${colors[player.id - 1]};">${index + 1}. Player ${player.id}: ${player.score} points</p>`
        )
        .join('');

    showScreen(screen4);
}

// Display the review page showing each question along with the correct answer and the player's response
function displayReview() {
    reviewBoard.innerHTML = ''; // Reset the review container

    currentQuestionSet.forEach((question, index) => {
        // Dynamically creates a div element for each question and adds a CSS class for styling
        const questionContainer = document.createElement('div');
        questionContainer.classList.add('question-container');

        const questionElement = document.createElement('p'); // Create a paragraph element for the question text
        questionElement.textContent = `Question ${index + 1}: ${question.Question}`; // Set the text content of the paragraph to display the question, with its index
        questionElement.classList.add('question-text'); // Add a CSS class for styling the question text
        questionContainer.appendChild(questionElement); // Append the question paragraph to the question container

        // Creates a paragraph element displaying the correct answer, styles it with the correct-answer class, and appends it to the question container
        const correctAnswerElement = document.createElement('p');
        correctAnswerElement.textContent = `Correct Answer: ${question.CorrectAnswer}`;
        correctAnswerElement.classList.add('correct-answer');
        questionContainer.appendChild(correctAnswerElement);

        // Determine and display player's response
        const player = players[index % players.length]; // Find the player
        const playerAnswer = player.answers[index]; // Player's answer
        const playerAnswerElement = document.createElement('p');
        playerAnswerElement.textContent = `Player ${player.id}: ${playerAnswer || "No Answer"}`; // If the player did not answer "No Answer" is displayed
        playerAnswerElement.classList.add('player-answer'); // CSS styling

        playerAnswerElement.style.color = colors[player.id - 1]; // Display the right color for every player

        // If the answer is incorrect display it in crossed out style
        if (playerAnswer !== question.CorrectAnswer) {
            playerAnswerElement.style.textDecoration = 'line-through'; // Crossed out the incorrect answer
        }

        questionContainer.appendChild(playerAnswerElement);
        reviewBoard.appendChild(questionContainer);
    });

    showScreen(screen5);
}



// Including the JSON's data in the .js file is simplier for a simple and static project
// No asynchronous loading are required
const data = {
    "HTML": [
      {
        "Question": "What is the purpose of the `<div>` element in HTML?",
        "Answers": ["To divide the HTML document into sections", "To style elements", "To create links", "To insert images"],
        "CorrectAnswer": "To divide the HTML document into sections"
      },
      {
        "Question": "What does the `<!DOCTYPE html>` declaration do?",
        "Answers": ["It defines the document type and version of HTML", "It links CSS file", "It creates a new element", "None of the above"],
        "CorrectAnswer": "It defines the document type and version of HTML"
      },
      {
        "Question": "What is the correct HTML element for inserting a line break?",
        "Answers": ["`<br>`", "`<break>`", "`<lb>`", "`<brk>`"],
        "CorrectAnswer": "`<br>`"
      },
      {
        "Question": "What is the purpose of the `<meta>` tag in HTML?",
        "Answers": ["To provide metadata about the HTML document", "To style elements", "To create links", "To insert images"],
        "CorrectAnswer": "To provide metadata about the HTML document"
      },
      {
        "Question": "What is the purpose of the `href` attribute in an `<a>` element in HTML?",
        "Answers": ["To specify the URL or destination that the link should navigate to when clicked", "To style elements", "To create links", "To insert images"],
        "CorrectAnswer": "To specify the URL or destination that the link should navigate to when clicked"
      },
      {
        "Question": "What is the correct HTML element for a list item?",
        "Answers": ["`<li>`", "`<listitem>`", "`<list-item>`", "`<li>`"],
        "CorrectAnswer": "`<li>`"
      },
      {
        "Question": "What is the correct HTML element for a table header?",
        "Answers": ["`<th>`", "`<header>`", "`<tableheader>`", "`<table-header>`"],
        "CorrectAnswer": "`<th>`"
      },
      {
        "Question": "What is the correct HTML element for a table data cell?",
        "Answers": ["`<td>`", "`<data>`", "`<tabledata>`", "`<table-data>`"],
        "CorrectAnswer": "`<td>`"
      },
      {
        "Question": "What is the correct HTML element for a form input field?",
        "Answers": ["`<input>`", "`<field>`", "`<inputfield>`", "`<input-field>`"],
        "CorrectAnswer": "`<input>`"
      },
      {
        "Question": "What is the correct HTML element for a form submit button?",
        "Answers": ["`<input type='submit'>`", "`<button type='submit'>`", "`<input-button type='submit'>`", "`<button-input type='submit'>`"],
        "CorrectAnswer": "`<input type='submit'>`"
      },
      {
        "Question": "What is the correct HTML element for an image?",
        "Answers": ["`<img>`", "`<picture>`", "`<image>`", "`<img-tag>`"],
        "CorrectAnswer": "`<img>`"
      },
      {
        "Question": "What is the correct HTML element for a video?",
        "Answers": ["`<video>`", "`<videotag>`", "`<videoelement>`", "`<video-tag>`"],
        "CorrectAnswer": "`<video>`"
      },
      {
        "Question": "What is the correct HTML element for a script?",
        "Answers": ["`<script>`", "`<scripttag>`", "`<scriptelement>`", "`<script-tag>`"],
        "CorrectAnswer": "`<script>`"
      },
      {
        "Question": "What is the correct HTML element for a style?",
        "Answers": ["`<style>`", "`<styletag>`", "`<styleelement>`", "`<style-tag>`"],
        "CorrectAnswer": "`<style>`"
      },
      {
        "Question": "What is the correct HTML element for a header?",
        "Answers": ["`<header>`", "`<header>`", "`<header>`", "`<header>`"],
        "CorrectAnswer": "`<header>`"
      },
      {
        "Question": "What is the correct HTML element for a footer?",
        "Answers": ["`<footer>`", "`<footer>`", "`<footer>`", "`<footer>`"],
        "CorrectAnswer": "`<footer>`"
      },
      {
        "Question": "What is the correct HTML element for a navigation bar?",
        "Answers": ["`<nav>`", "`<navbar>`", "`<navigation>`", "`<nav-bar>`"],
        "CorrectAnswer": "`<nav>`"
      },
      {
        "Question": "What is the correct HTML element for a section?",
        "Answers": ["`<section>`", "`<section>`", "`<section>`", "`<section>`"],
        "CorrectAnswer": "`<section>`"
      },
      {
        "Question": "What is the correct HTML element for a main content area?",
        "Answers": ["`<main>`", "`<main>`", "`<main>`", "`<main>`"],
        "CorrectAnswer": "`<main>`"
      },
      {
        "Question": "What is the correct HTML element for a sidebar?",
        "Answers": ["`<aside>`", "`<sidebar>`", "`<aside>`", "`<aside>`"],
        "CorrectAnswer": "`<aside>`"
      },
      {
        "Question": "What is the correct HTML element for a details summary?",
        "Answers": ["`<details>`", "`<summary>`", "`<details>`", "`<summary>`"],
        "CorrectAnswer": "`<details>`"
      }
   ],
   
    "CSS": [
        {
            "Question": "What does CSS stand for?",
            "Answers": ["Cascading Style Sheets", "Computer Style Sheets", "Colorful Style Sheets", "Creative Style Sheets"],
            "CorrectAnswer": "Cascading Style Sheets"
          },
          {
            "Question": "Where in an HTML document is the correct place to refer to an external style sheet?",
            "Answers": ["In the `<body>` section", "At the end of the document", "In the `<head>` section", "In the `<footer>` section"],
            "CorrectAnswer": "In the `<head>` section"
          },
          {
            "Question": "What is the correct CSS syntax?",
            "Answers": ["`body:color=black;`", "`body {color: black;}`", "`{body;color:black;}`", "`{body:color=black;}`"],
            "CorrectAnswer": "`body {color: black;}`"
          },
          {
            "Question": "What is the correct way to add a comment in a CSS file?",
            "Answers": ["`/*This is a comment*/`", "`//This is a comment`", "`<!--This is a comment-->`", "`<!This is a comment>`"],
            "CorrectAnswer": "`/*This is a comment*/`"
          },
          {
            "Question": "What does the `!important` rule in CSS do?",
            "Answers": ["It makes a CSS rule more important than other rules", "It makes a CSS rule less important than other rules", "It makes a CSS rule apply to all elements", "It makes a CSS rule apply to no elements"],
            "CorrectAnswer": "It makes a CSS rule more important than other rules"
          },
          {
            "Question": "What is the correct CSS property to change the text color?",
            "Answers": ["`color`", "`text-color`", "`font-color`", "`text-colour`"],
            "CorrectAnswer": "`color`"
          },
          {
            "Question": "What is the correct CSS property to change the background color?",
            "Answers": ["`background-color`", "`bg-color`", "`background-colour`", "`bg-colour`"],
            "CorrectAnswer": "`background-color`"
          },
          {
            "Question": "What is the correct CSS property to change the font size?",
            "Answers": ["`font-size`", "`text-size`", "`font-scale`", "`text-scale`"],
            "CorrectAnswer": "`font-size`"
          },
          {
            "Question": "What is the correct CSS property to change the font family?",
            "Answers": ["`font-family`", "`text-font`", "`font-face`", "`text-face`"],
            "CorrectAnswer": "`font-family`"
          },
          {
            "Question": "What is the correct CSS property to change the font weight?",
            "Answers": ["`font-weight`", "`text-weight`", "`font-strength`", "`text-strength`"],
            "CorrectAnswer": "`font-weight`"
          },
          {
            "Question": "What is the correct CSS property to change the text alignment?",
            "Answers": ["`text-align`", "`align-text`", "`text-position`", "`align-position`"],
            "CorrectAnswer": "`text-align`"
          },
          {
            "Question": "What is the correct CSS property to change the margin?",
            "Answers": ["`margin`", "`space`", "`padding`", "`border`"],
            "CorrectAnswer": "`margin`"
          },
          {
            "Question": "What is the correct CSS property to change the padding?",
            "Answers": ["`padding`", "`space`", "`margin`", "`border`"],
            "CorrectAnswer": "`padding`"
          },
          {
            "Question": "What is the correct CSS property to change the border?",
            "Answers": ["`border`", "`border-style`", "`border-color`", "`border-width`"],
            "CorrectAnswer": "`border`"
          },
          {
            "Question": "What is the correct CSS property to change the width?",
            "Answers": ["`width`", "`size`", "`length`", "`dimension`"],
            "CorrectAnswer": "`width`"
          },
          {
            "Question": "What is the correct CSS property to change the height?",
            "Answers": ["`height`", "`size`", "`length`", "`dimension`"],
            "CorrectAnswer": "`height`"
          },
          {
            "Question": "What is the correct CSS property to change the box-sizing?",
            "Answers": ["`box-sizing`", "`box-size`", "`box-dimension`", "`box-length`"],
            "CorrectAnswer": "`box-sizing`"
          },
          {
            "Question": "What is the correct CSS property to change the position?",
            "Answers": ["`position`", "`location`", "`place`", "`spot`"],
            "CorrectAnswer": "`position`"
          },
          {
            "Question": "What is the correct CSS property to change the display?",
            "Answers": ["`display`", "`show`", "`view`", "`showcase`"],
            "CorrectAnswer": "`display`"
          }
   ],
   
    "JavaScript": [
      {
        "Question": "Inside which HTML element do we put the JavaScript?",
        "Answers": ["`<javascript>`", "`<js>`", "`<scripting>`", "`<script>`"],
        "CorrectAnswer": "`<script>`"
      },
      {
        "Question": "What is the correct syntax for referring to an external script called 'xxx.js'?",
        "Answers": ["`<script href='xxx.js'>`", "`<script name='xxx.js'>`", "`<script src='xxx.js'>`", "`<script file='xxx.js'>`"],
        "CorrectAnswer": "`<script src='xxx.js'>`"
      },
      {
        "Question": "How do you create a function in JavaScript?",
        "Answers": ["`function:myFunction()`", "`function = myFunction()`", "`function myFunction()`", "`myFunction:function()`"],
        "CorrectAnswer": "`function myFunction()`"
      }, {
        "Question": "What does '===' operator do in JavaScript?",
        "Answers": ["Checks if two values are equal", "Checks if two values are not equal", "Checks if two values are the same type", "Checks if two values are not the same type"],
        "CorrectAnswer": "Checks if two values are the same type"
       },
       {
        "Question": "What does '==' operator do in JavaScript?",
        "Answers": ["Checks if two values are equal", "Checks if two values are not equal", "Checks if two values are the same type", "Checks if two values are not the same type"],
        "CorrectAnswer": "Checks if two values are equal"
       },
       {
        "Question": "What does '!=' operator do in JavaScript?",
        "Answers": ["Checks if two values are not equal", "Checks if two values are equal", "Checks if two values are the same type", "Checks if two values are not the same type"],
        "CorrectAnswer": "Checks if two values are not equal"
       },
       {
        "Question": "What does '!==' operator do in JavaScript?",
        "Answers": ["Checks if two values are not equal", "Checks if two values are equal", "Checks if two values are not the same type", "Checks if two values are the same type"],
        "CorrectAnswer": "Checks if two values are not the same type"
       },
       {
        "Question": "What does '&&' operator do in JavaScript?",
        "Answers": ["Performs a logical AND operation", "Performs a logical OR operation", "Performs a logical NOT operation", "Performs a logical XOR operation"],
        "CorrectAnswer": "Performs a logical AND operation"
       },
       {
        "Question": "What does '||' operator do in JavaScript?",
        "Answers": ["Performs a logical OR operation", "Performs a logical AND operation", "Performs a logical NOT operation", "Performs a logical XOR operation"],
        "CorrectAnswer": "Performs a logical OR operation"
       },
       {
        "Question": "What does '!' operator do in JavaScript?",
        "Answers": ["Performs a logical NOT operation", "Performs a logical AND operation", "Performs a logical OR operation", "Performs a logical XOR operation"],
        "CorrectAnswer": "Performs a logical NOT operation"
       },
       {
        "Question": "What does '>>' operator do in JavaScript?",
        "Answers": ["Performs a right shift operation", "Performs a left shift operation", "Performs a bitwise AND operation", "Performs a bitwise OR operation"],
        "CorrectAnswer": "Performs a right shift operation"
       },
       {
        "Question": "What does '<<' operator do in JavaScript?",
        "Answers": ["Performs a left shift operation", "Performs a right shift operation", "Performs a bitwise AND operation", "Performs a bitwise OR operation"],
        "CorrectAnswer": "Performs a left shift operation"
       },
       {
        "Question": "What does '>>>' operator do in JavaScript?",
        "Answers": ["Performs a zero-fill right shift operation", "Performs a left shift operation", "Performs a right shift operation", "Performs a bitwise AND operation"],
        "CorrectAnswer": "Performs a zero-fill right shift operation"
       },
       {
        "Question": "What does '&' operator do in JavaScript?",
        "Answers": ["Performs a bitwise AND operation", "Performs a logical AND operation", "Performs a bitwise OR operation", "Performs a logical OR operation"],
        "CorrectAnswer": "Performs a bitwise AND operation"
       },
       {
        "Question": "What does '|' operator do in JavaScript?",
        "Answers": ["Performs a bitwise OR operation", "Performs a logical OR operation", "Performs a bitwise AND operation", "Performs a logical AND operation"],
        "CorrectAnswer": "Performs a bitwise OR operation"
       },
       {
        "Question": "What does '^' operator do in JavaScript?",
        "Answers": ["Performs a bitwise XOR operation", "Performs a logical XOR operation", "Performs a bitwise AND operation", "Performs a logical AND operation"],
        "CorrectAnswer": "Performs a bitwise XOR operation"
       },
       {
        "Question": "What does '~' operator do in JavaScript?",
        "Answers": ["Performs a bitwise NOT operation", "Performs a logical NOT operation", "Performs a bitwise AND operation", "Performs a logical AND operation"],
        "CorrectAnswer": "Performs a bitwise NOT operation"
       },
       {
        "Question": "What does '+' operator do in JavaScript?",
        "Answers": ["Performs an addition operation", "Performs a subtraction operation", "Performs a multiplication operation", "Performs a division operation"],
        "CorrectAnswer": "Performs an addition operation"
       },
       {
        "Question": "What does '-' operator do in JavaScript?",
        "Answers": ["Performs a subtraction operation", "Performs an addition operation", "Performs a multiplication operation", "Performs a division operation"],
        "CorrectAnswer": "Performs a subtraction operation"
       },
       {
        "Question": "What does '*' operator do in JavaScript?",
        "Answers": ["Performs a multiplication operation", "Performs an addition operation", "Performs a subtraction operation", "Performs a division operation"],
        "CorrectAnswer": "Performs a multiplication operation"
       },
       {
        "Question": "What does '/' operator do in JavaScript?",
        "Answers": ["Performs a division operation", "Performs an addition operation", "Performs a subtraction operation", "Performs a multiplication operation"],
        "CorrectAnswer": "Performs a division operation"
       }
   ]  
}