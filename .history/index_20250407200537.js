import { checkIfLoggedIn, signInWithGoogle, checkForActiveGame, startNewGame, updateGameBoard, displayMessages } from './game.js';

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
        updateGameBoard(gameData.board);
    } catch (error) {
        console.error("Error starting new game:", error);
    }
});

// Check if the player is logged in and display the appropriate UI
async function checkForActiveGameAndUpdateUI() {
    try {
        const user = await checkIfLoggedIn();
        const gameData = await checkForActiveGame();
        if (gameData) {
            updateGameBoard(gameData.board);
        }
    } catch (error) {
        console.log("No active game");
    }
}

// Add event listeners for making moves on the game board
document.getElementById('game-board').addEventListener('click', async (event) => {
    if (event.target.tagName === 'DIV') {
        const row = event.target.dataset.row;
        const col = event.target.dataset.col;
        const value = prompt('Enter a value:');
        if (value) {
            try {
                const user = await checkIfLoggedIn();
                await makeMove(row, col, parseInt(value), user.uid, user.displayName);
                const gameData = await checkForActiveGame();
                updateGameBoard(gameData.board);
            } catch (error) {
                console.error("Error making move:", error);
            }
        }
    }
});

// Initial check for active game and update UI
checkForActiveGameAndUpdateUI();
