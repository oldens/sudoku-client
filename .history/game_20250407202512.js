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
        const gameRef = ref(db, 'games/active');
        onValue(gameRef, (snapshot) => {
            const data = snapshot.val();
            console.log("Дані з бази даних:", data);
            if (data) {
                // Перевіряємо формат даних
                if (data.board) {
                    console.log("Знайдено активну гру", data.board);
                    // Якщо є поле board, використовуємо його
                    resolve(data);
                } else if (Array.isArray(data)) {
                    // Якщо data - це масив, використовуємо його як дошку
                    resolve({
                        board: data,
                        players: {}
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
    return new Promise((resolve, reject) => {
        const gameRef = ref(db, 'games/active');
        onValue(gameRef, (snapshot) => {
            const data = snapshot.val();
            console.log("Дані з бази даних:", data);
            if (data) {
                // Перевіряємо формат даних
                if (data.board) {
                    console.log("Знайдено активну гру", data.board);
                    // Якщо є поле board, використовуємо його
                    resolve(data);
                } else if (Array.isArray(data)) {
                    // Якщо data - це масив, використовуємо його як дошку
                    resolve({
                        board: data,
                        players: {}
                    });
                } else {
                    console.error("Невірний формат даних гри:", data);
                    resolve(null);
                }
            } else {
                // Якщо гри немає, робимо запит до API для створення нової
                fetch('https://sudoku-378406934320.us-central1.run.app/game/active', {
                    method: 'POST'
                }).catch(error => {
                    console.error("Помилка при створенні нової гри:", error);
                });
                // Не чекаємо відповіді, оскільки дані прийдуть через onValue
                resolve(null);
            }
        }, (error) => {
            reject(error);
        });
    });
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
    // Перевіряємо формат даних
    let board;
    let players = {};

    if (Array.isArray(gameData)) {
        // Якщо gameData - це масив (дошка)
        board = gameData;
    } else if (gameData && gameData.board) {
        // Якщо gameData - це об'єкт з полем board
        board = gameData.board;
        players = gameData.players || {};
    } else {
        console.error("Невірний формат даних гри:", gameData);
        return;
    }

    // Перевіряємо, чи board - це двовимірний масив
    if (!Array.isArray(board) || !board.every(row => Array.isArray(row))) {
        console.error("Невірний формат дошки:", board);
        return;
    }

    const gameBoardDiv = document.getElementById('game-board');
    gameBoardDiv.innerHTML = '';

    // Показуємо інформацію про гравців
    const playersInfo = document.createElement('div');
    playersInfo.className = 'players-info';
    if (Object.keys(players).length > 0) {
        const playersList = Object.entries(players)
            .map(([id, player]) => `${player.name || 'Гравець'}`)
            .join(', ');
        playersInfo.textContent = `Гравці: ${playersList}`;
    }
    gameBoardDiv.appendChild(playersInfo);

    // Створюємо дошку гри
    const boardDiv = document.createElement('div');
    boardDiv.className = 'board';
    board.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const cellDiv = document.createElement('div');
            cellDiv.className = 'cell';
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
