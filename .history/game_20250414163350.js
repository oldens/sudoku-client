// Імпорти зовнішніх функцій
import { checkIfLoggedIn } from './auth.js';
import { initFirebaseListener } from './firebase.js';
import { startNewGame, makeMove } from './api.js';

// Реекспорт функцій, які потрібні в інших модулях
export { 
    checkIfLoggedIn,
    startNewGame,
    makeMove 
};

export function updateGameBoard(gameData) {
    const gameBoardDiv = document.getElementById('game-board');
    gameBoardDiv.innerHTML = '';

    if (!gameData) {
        showNoGameMessage();
        return;
    }

    const { board, players } = parseGameData(gameData);

    if (!isValidBoard(board)) {
        console.error("Невірний формат дошки:", board);
        displayMessages(["Невірний формат дошки"]);
        return;
    }

    renderPlayersInfo(players, gameBoardDiv);
    renderBoard(board, gameBoardDiv);
}

initFirebaseListener(updateGameBoard);

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
    console.log("checkForActiveGameAndUpdateUI");
    try {
        const user = await checkIfLoggedIn();
        updateUserInfo(user);

        console.log("checkForActiveGameAndUpdateUI");
        
      
    } catch (error) {
        updateUserInfo(null);
    }
}

function updateUserInfo(user) {
    const userInfoDiv = document.getElementById('user-info');
    userInfoDiv.textContent = user ? `👤 Привіт, ${user.displayName}!` : '';
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

function parseGameData(gameData) {
    if (Array.isArray(gameData)) {
        return { board: [], players: [] };
    }

    if (gameData && gameData.board) {
        const board = typeof gameData.board === 'string'
            ? JSON.parse(gameData.board)
            : gameData.board;
        const players = gameData.players || [];
        return { board, players };
    }

    console.error("Невірний формат даних гри:", gameData);
    return { board: null, players: [] };
}

function isValidBoard(board) {
    return Array.isArray(board) && board.every(row => Array.isArray(row));
}

function renderPlayersInfo(players, container) {
    if (!players.length) return;

    const playersInfo = document.createElement('div');
    playersInfo.className = 'players-info';

    const playersList = document.createElement('div');
    playersList.className = 'players-list';

    [...players]
        .sort((a, b) => b.score - a.score)
        .forEach((player, index) => {
            const playerDiv = document.createElement('div');
            playerDiv.className = 'player-item';

            playerDiv.innerHTML = `
                <div class="player-rank">${index + 1}.</div>
                <div class="player-name">${player.userName}</div>
                <div class="player-score">🏆 ${player.score}</div>
            `;

            playersList.appendChild(playerDiv);
        });

    playersInfo.appendChild(playersList);
    container.appendChild(playersInfo);
}

function renderBoard(board, container) {
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

    container.appendChild(boardDiv);
}