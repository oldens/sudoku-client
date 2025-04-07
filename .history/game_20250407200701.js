import { auth, provider, db, ref, set, onValue, signInWithPopup } from './firebase-config.js';

// Check if the player is logged in
export function checkIfLoggedIn() {
    return new Promise((resolve, reject) => {
        auth.onAuthStateChanged(user => {
            if (user) {
                resolve(user);
            } else {
                reject('No user logged in');
            }
        });
    });
}

// Log in with Google
export async function signInWithGoogle() {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log("Успішний вхід:", user.displayName);
        alert("👋 Привіт, " + user.displayName);
        return user;
    } catch (error) {
        console.error("Помилка входу через Google:", error);
        alert("❌ " + error.message);
        throw error;
    }
}

// Check for an active game
export function checkForActiveGame() {
    return new Promise((resolve, reject) => {
        const gameRef = ref(db, 'game/active');
        onValue(gameRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                resolve(data);
            } else {
                resolve(null);
            }
        }, (error) => {
            reject(error);
        });
    });
}

// Start a new game
export async function startNewGame() {
    try {
        const response = await fetch('https://sudoku-378406934320.us-central1.run.app/game/active', {
            method: 'POST'
        });
        const data = await response.json();
        await set(ref(db, 'game/active'), data);
        return data;
    } catch (error) {
        console.error("Помилка створення нової гри:", error);
        throw error;
    }
}

// Make a move
export async function makeMove(row, col, value, userId, userName) {
    try {
        const move = { row, col, value, userId, userName };
        const response = await fetch('https://sudoku-378406934320.us-central1.run.app/game/move', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(move)
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Помилка при здійсненні ходу:", error);
        throw error;
    }
}

// Update the game board
export function updateGameBoard(board) {
    const gameBoardDiv = document.getElementById('game-board');
    gameBoardDiv.innerHTML = '';
    board.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const cellDiv = document.createElement('div');
            cellDiv.textContent = cell !== 0 ? cell : '';
            cellDiv.addEventListener('click', () => {
                const value = prompt('Enter a value:');
                if (value) {
                    makeMove(rowIndex, colIndex, parseInt(value), auth.currentUser.uid, auth.currentUser.displayName);
                }
            });
            gameBoardDiv.appendChild(cellDiv);
        });
    });
}

// Display messages
export function displayMessages(messages) {
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML = '';
    messages.forEach(message => {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messagesDiv.appendChild(messageDiv);
    });
}

// Check if the player is logged in and display the appropriate UI
export async function checkForActiveGameAndUpdateUI() {
    try {
        const user = await checkIfLoggedIn();
        const userInfoDiv = document.getElementById('user-info');
        userInfoDiv.textContent = `👤 Привіт, ${user.displayName}!`;
        const gameData = await checkForActiveGame();
        if (gameData) {
            updateGameBoard(gameData.board);
        }
    } catch (error) {
        const userInfoDiv = document.getElementById('user-info');
        userInfoDiv.textContent = '';
    }
}
