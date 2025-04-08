/**
 * @file index.js
 * @description This file handles event listeners and UI updates for the Sudoku Multiplayer Game.
 * It includes functions to handle user interactions such as logging in with Google, starting a new game, and making moves on the game board.
 */

import { checkIfLoggedIn, signInWithGoogle } from './auth.js';
import { startNewGame, checkForActiveGame } from './gameState.js';
import { updateGameBoard } from './ui.js';
import { db, ref, onValue } from './firebase-config.js';

// Додаємо слухачів подій
document.getElementById('google-login').addEventListener('click', async () => {
    try {
        const user = await signInWithGoogle();
        document.getElementById('user-info').textContent = `Привіт, ${user.displayName}!`;
    } catch (error) {
        console.error("Error during Google login:", error);
    }
});

document.getElementById('start-game').addEventListener('click', async () => {
    try {
        await startNewGame();
    } catch (error) {
        console.error("Error starting new game:", error);
    }
});

// Слухаємо зміни в грі
const gameRef = ref(db, 'game/active');
onValue(gameRef, (snapshot) => {
    const gameData = snapshot.val();
    if (gameData && gameData.board) {
        updateGameBoard(gameData.board);
    }
});

// Перевіряємо початковий стан
checkForActiveGame().then(board => {
    if (board) {
        updateGameBoard(board);
    }
}).catch(error => {
    console.error("Error checking for active game:", error);
});
