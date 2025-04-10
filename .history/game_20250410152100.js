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

// UI функції
export function updateGameBoard(gameData) {
    const gameBoardDiv = document.getElementById('game-board');
    gameBoardDiv.innerHTML = '';

    // Якщо гри немає, показуємо повідомлення
    if (!gameData) {
        showNoGameMessage();
        return;
    }

    // Перевіряємо формат даних
    let board;
    let players = [];

    if (Array.isArray(gameData)) {
        // Якщо gameData - це масив (дошка)
        board = gameData;
    } else if (gameData && gameData.board) {
        // Якщо gameData - це об'єкт з полем board
        board = typeof gameData.board === 'string' ? JSON.parse(gameData.board) : gameData.board;
        players = gameData.players || [];
    } else {
        console.error("Невірний формат даних гри:", gameData);
        return;
    }

    // Перевіряємо, чи board - це двовимірний масив
    if (!Array.isArray(board) || !board.every(row => Array.isArray(row))) {
        console.error("Невірний формат дошки:", board);
        return;
    }

    // Показуємо інформацію про гравців
    const playersInfo = document.createElement('div');
    playersInfo.className = 'players-info';
    
    if (players.length > 0) {
        // Сортуємо гравців за рахунком
        const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
        
        const playersList = document.createElement('div');
        playersList.className = 'players-list';
        
        sortedPlayers.forEach((player, index) => {
            const playerDiv = document.createElement('div');
            playerDiv.className = 'player-item';
            
            const rankDiv = document.createElement('div');
            rankDiv.className = 'player-rank';
            rankDiv.textContent = `${index + 1}.`;
            
            const nameDiv = document.createElement('div');
            nameDiv.className = 'player-name';
            nameDiv.textContent = player.userName;
            
            const scoreDiv = document.createElement('div');
            scoreDiv.className = 'player-score';
            scoreDiv.textContent = `🏆 ${player.score}`;
            
            playerDiv.appendChild(rankDiv);
            playerDiv.appendChild(nameDiv);
            playerDiv.appendChild(scoreDiv);
            playersList.appendChild(playerDiv);
        });
        
        playersInfo.appendChild(playersList);
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