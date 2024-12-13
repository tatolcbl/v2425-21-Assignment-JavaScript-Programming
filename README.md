# Technical Overview of Front-End Quiz Game

This document provides a concise explanation of the main functions and technical features of the quiz game.

## **1. Game Screens**
- **Player Selection:**
  - `initializeGame()`: Sets up the players based on the selected number.
  - `showScreen(screenToShow)`: Manages navigation between screens.
- **Subject and Difficulty Selection:**
  - Quiz subject and difficulty are captured via button events and configured using `getQuestionsBySubject()`.

## **2. Game Start**
- **Question and Turn Management:**
  - `loadQuestion()`: Dynamically displays a question with four possible answers.
  - `displayPlayerTurn()`: Highlights the current player’s turn and applies their assigned color.
- **Timer Integration:**
  - `startTimer()`: Starts a countdown timer for each player to submit their answer.

## **3. Gameplay**
- **Answer Selection:**
  - `handleNextTurn(isTimeout)`: Processes the selected answer or automatically moves to the next turn if time runs out.
  - Selected answers are highlighted in the player’s color.
- **Scoring:**
  - Correct answers earn points, processed within `handleNextTurn()`.
  - Unanswered or incorrect responses result in no points.

## **4. Game End**
- **Leaderboard:**
  - `displayWinners()`: Sorts players by score and displays their rankings with respective colors.
- **Review Screen:**
  - `displayReview()`: Presents all questions, correct answers, and player choices styled accordingly.

## **5. Technical Features**
- **JSON Data Management:**
  - Questions and answers are stored in a JSON object for easy management and dynamic usage.
- **Player Colors:**
  - Player colors are defined in the `colors` array and consistently applied.
- **Audio Feedback:**
  - Background music and click sound effects are handled with `quizMusic.play()` and `clickSound.play()`.
- **Responsive Design:**
  - Flexbox and Grid layouts ensure compatibility across desktop devices.
- **Dynamic Updates:**
  - Buttons and elements are created dynamically using `answersContainer.appendChild(button)`.
