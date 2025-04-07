import { checkIfLoggedIn, signInWithGoogle } from './auth.js';
import { startNewGame, makeMove } from './api.js';
import { updateGameBoard, displayMessages, checkForActiveGameAndUpdateUI } from './ui.js';
import { checkForActiveGame } from './database.js';

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
        const gameData = await startNewGame();
        updateGameBoard(gameData);
    } catch (error) {
        console.error("Error starting new game:", error);
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
