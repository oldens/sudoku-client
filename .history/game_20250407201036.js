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
        // Оновлюємо UI після успішного входу
        await checkForActiveGameAndUpdateUI();
        return user;
    } catch (error) {
        console.error("Помилка входу через Google:", error);
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
                // Перевіряємо, чи є необхідні поля
                if (data.board && data.players) {
                    resolve({
                        board: data.board,
                        players: data.players
                    });
                } else {
                    console.error("Невірний формат даних гри:", data);
                    resolve(null);
                }
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
        // Спочатку перевіряємо, чи є активна гра
        const activeGame = await checkForActiveGame();
        if (activeGame) {
            console.log("Вже є активна гра");
            return activeGame;
        }

        // Якщо активної гри немає, створюємо нову
        const response = await fetch('https://sudoku-378406934320.us-central1.run.app/game/active', {
            method: 'POST'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
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
export function updateGameBoard(gameData) {
    if (!gameData || !gameData.board || !Array.isArray(gameData.board)) {
        console.error("Невірний формат даних гри:", gameData);
        return;
    }

    const gameBoardDiv = document.getElementById('game-board');
    gameBoardDiv.innerHTML = '';

    // Показуємо інформацію про гравців
    const playersInfo = document.createElement('div');
    playersInfo.className = 'players-info';
    if (gameData.players) {
        const playersList = Object.entries(gameData.players)
            .map(([id, player]) => `${player.name}`)
            .join(', ');
        playersInfo.textContent = `Гравці: ${playersList}`;
    }
    gameBoardDiv.appendChild(playersInfo);

    // Створюємо дошку гри
    const boardDiv = document.createElement('div');
    boardDiv.className = 'board';
    gameData.board.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const cellDiv = document.createElement('div');
            cellDiv.textContent = cell !== 0 ? cell : '';
            cellDiv.dataset.row = rowIndex;
            cellDiv.dataset.col = colIndex;
            boardDiv.appendChild(cellDiv);
        });
    });
    gameBoardDiv.appendChild(boardDiv);
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
            updateGameBoard(gameData);
        }
    } catch (error) {
        const userInfoDiv = document.getElementById('user-info');
        userInfoDiv.textContent = '';
    }
}
