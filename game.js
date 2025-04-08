/**
 * @file game.js
 * @description This file contains the main game logic and initialization code.
 * It includes functions to initialize the game and handle user interactions.
 */

import { auth, provider, db, ref, set, onValue, signInWithPopup } from './firebase-config.js';
import { checkIfLoggedIn, signInWithGoogle } from './auth.js';
import { checkForActiveGame, startNewGame, makeMove } from './gameState.js';
import { updateGameBoard, displayMessages, checkForActiveGameAndUpdateUI } from './ui.js';

// Add comments to explain the purpose and functionality of the remaining code
// This function initializes the game and sets up event listeners
function initializeGame() {
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
            const gameData = await startNewGame();
            updateGameBoard(gameData);
        } catch (error) {
            console.error("Error starting new game:", error);
        }
    });

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
}

// Call the initializeGame function to start the game
initializeGame();
