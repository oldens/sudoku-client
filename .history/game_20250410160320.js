// Імпорти зовнішніх функцій
import { checkIfLoggedIn } from './auth.js';
import { checkForActiveGame } from './firebase.js';
import { startNewGame, makeMove } from './api.js';

// Реекспорт функцій, які потрібні в інших модулях
export { 
    checkIfLoggedIn,
    checkForActiveGame,
    startNewGame,
    makeMove 
};

/export function updateGameBoard(gameData) {
    const gameBoardDiv = document.getElementById('game-board');
    gameBoardDiv.innerHTML = '';

    if (!gameData) {
        showNoGameMessage();
        return;
    }

    const board = parseBoard(gameData);
    const players = extractPlayers(gameData);

    if (!isValidBoard(board)) {
        console.error("Невірний формат дошки:", board);
        return;
    }

    renderPlayersInfo(players, gameBoardDiv);
    renderBoard(board, gameBoardDiv);
}



export function displayMessages(messages) {
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML = '';
    messages.forEach(message => {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messagesDiv.appendChild(messageDiv);
    });
}

export async function checkForActiveGameAndUpdateUI() {
    try {
        const user = await checkIfLoggedIn();
        const userInfoDiv = document.getElementById('user-info');
        userInfoDiv.textContent = `👤 Привіт, ${user.displayName}!`;
        
        const gameData = await checkForActiveGame();
        if (!gameData) {
            showNoGameMessage();
            return;
        }
        
        updateGameBoard(gameData);
    } catch (error) {
        const userInfoDiv = document.getElementById('user-info');
        userInfoDiv.textContent = '';
    }
}

// Показати повідомлення про відсутність активної гри
function showNoGameMessage() {
    const gameBoardDiv = document.getElementById('game-board');
    gameBoardDiv.innerHTML = '';
    const noGameMessage = document.createElement('div');
    noGameMessage.className = 'no-game-message';
    noGameMessage.textContent = 'Активної гри не знайдено. Натисніть "Почати нову гру", щоб створити її.';
    gameBoardDiv.appendChild(noGameMessage);
}

function parseBoard(gameData) {
    if (Array.isArray(gameData)) {
        return gameData;
    }

    if (gameData && gameData.board) {
        return typeof gameData.board === 'string'
            ? JSON.parse(gameData.board)
            : gameData.board;
    }

    console.error("Невірний формат даних гри:", gameData);
    return null;
}

function extractPlayers(gameData) {
    return Array.isArray(gameData) ? [] : gameData.players || [];
}

function isValidBoard(board) {
    return Array.isArray(board) && board.every(row => Array.isArray(row));
}