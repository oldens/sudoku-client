/**
 * @file game.js
 * @description This file contains the main game logic and initialization code.
 * It includes functions to initialize the game and handle user interactions.
 */

import { auth, provider, db, ref, set, onValue, signInWithPopup } from './firebase-config.js';
import { checkIfLoggedIn, signInWithGoogle } from './auth.js';
import { startNewGame } from './gameState.js';
import { updateGameBoard, displayMessages, checkForActiveGameAndUpdateUI } from './ui.js';

// Add comments to explain the purpose and functionality of the remaining code
// This function initializes the game and sets up event listeners
function initializeGame() {
    // Додаємо слухача для кнопки входу через Google
    document.getElementById('google-login').addEventListener('click', async () => {
        try {
            const user = await signInWithGoogle();
            document.getElementById('user-info').textContent = `Привіт, ${user.displayName}!`;
            checkForActiveGameAndUpdateUI();
        } catch (error) {
            console.error("Error during Google login:", error);
        }
    });

    // Додаємо слухача для кнопки початку нової гри
    document.getElementById('start-game').addEventListener('click', async () => {
        try {
            // Створюємо нову гру
            const emptyBoard = Array(9).fill().map(() => Array(9).fill(0));
            await set(ref(db, 'game/active'), {
                board: emptyBoard,
                status: 'active',
                createdAt: Date.now()
            });
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

    // Слухаємо зміни в базі даних
    const gameRef = ref(db, 'game/active');
    onValue(gameRef, (snapshot) => {
        const gameData = snapshot.val();
        if (gameData && gameData.board) {
            updateGameBoard(gameData.board);
        }
    });

    // Перевіряємо початковий стан гри
    checkForActiveGameAndUpdateUI();
}

// Функція для перевірки активної гри та оновлення UI
async function checkForActiveGameAndUpdateUI() {
    try {
        const gameRef = ref(db, 'game/active');
        onValue(gameRef, (snapshot) => {
            const gameData = snapshot.val();
            if (gameData && gameData.board) {
                updateGameBoard(gameData.board);
            }
        });
    } catch (error) {
        console.error("Error checking active game:", error);
    }
}

// Call the initializeGame function to start the game
initializeGame();
