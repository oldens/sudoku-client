// Імпорти для автентифікації
import { signInWithGoogle } from './auth.js';

// Імпорти для роботи з грою
import { makeMove, startNewGame } from './api.js';
import { checkForActiveGame } from './firebase.js';

// Імпорти для UI
import { 
    updateGameBoard, 
    displayMessages, 
    checkForActiveGameAndUpdateUI 
} from './game.js';

// Обробники подій
document.getElementById('google-login').addEventListener('click', () => 
    signInWithGoogle()
        .then(checkForActiveGameAndUpdateUI)
        .catch(error => console.error("Error during Google login:", error))
);

document.getElementById('start-game').addEventListener('click', () => 
    startNewGame()
        .then(checkForActiveGameAndUpdateUI)
        .catch(error => console.error("Error starting new game:", error))
);

// Add event listeners for making moves on the game board
document.getElementById('game-board').addEventListener('click', async (event) => {
    if (event.target.classList.contains('cell')) {
        const row = event.target.dataset.row;
        const col = event.target.dataset.col;
        const value = prompt('Enter a value:');
        
        if (value) {
            try {
                const user = await signInWithGoogle();
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
