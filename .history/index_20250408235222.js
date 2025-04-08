/**
 * @file index.js
 * @description This file handles event listeners and UI updates for the Sudoku Multiplayer Game.
 * It includes functions to handle user interactions such as logging in with Google, starting a new game, and making moves on the game board.
 */

import { checkIfLoggedIn, signInWithGoogle } from './auth.js';
import { checkForActiveGame, startNewGame, makeMove } from './gameState.js';
import { updateGameBoard, displayMessages, checkForActiveGameAndUpdateUI } from './ui.js';
import { ref, onValue } from 'firebase/database';
import { db } from './firebase.js';

// Add event listeners for the Google login and start game buttons
document.getElementById('google-login').addEventListener('click', async () => {
    try {
        await signInWithGoogle();
        checkForActiveGameAndUpdateUI();
    } catch (error) {
        console.error("Error during Google login:", error);
    }
});

document.getElementById('start-game').addEventListener('click', async () => {
    try {
        await startNewGame();
    } catch (error) {
        console.error("Error starting new game:", error);
        const gameBoardDiv = document.getElementById('game-board');
        gameBoardDiv.innerHTML = '<div class="error">Помилка при створенні нової гри</div>';
    }
});

// Add event listeners for making moves on the game board
document.getElementById('game-board').addEventListener('click', async (event) => {
    if (event.target.classList.contains('cell')) {
        const row = event.target.dataset.row;
        const col = event.target.dataset.col;
        const value = prompt('Enter a value:');
        if (value) {
            try {
                const user = await checkIfLoggedIn();
                await makeMove(row, col, parseInt(value), user.uid, user.displayName);
                const gameData = await checkForActiveGame();
                updateGameBoard(gameData);
            } catch (error) {
                console.error("Error making move:", error);
            }
        }
    }
});

// Initial check for active game and update UI
checkForActiveGameAndUpdateUI();

// Додаємо слухача змін в базі даних
const gameRef = ref(db, 'game/active');
onValue(gameRef, (snapshot) => {
    const data = snapshot.val();
    if (data && Array.isArray(data.board)) {
        updateGameBoard(data.board);
    }
});
