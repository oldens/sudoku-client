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

//

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