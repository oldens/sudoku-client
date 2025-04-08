/**
 * @file ui.js
 * @description This file contains functions related to updating the UI.
 * It includes functions to update the game board, display messages, and check for an active game and update the UI.
 */

import { checkIfLoggedIn } from './auth.js';
import { checkForActiveGame, makeMove } from './gameState.js';
import { auth } from './firebase-config.js';

/**
 * Update the game board
 * @param {Array} board - The game board array.
 */
export function updateGameBoard(board) {
    const gameBoardDiv = document.getElementById('game-board');
    gameBoardDiv.innerHTML = '';
    
    if (!board) {
        console.error('Board data is missing');
        return;
    }

    if (!Array.isArray(board)) {
        console.error('Invalid board data:', board);
        return;
    }
    
    board.forEach((row, rowIndex) => {
        if (!Array.isArray(row)) {
            console.error('Invalid row data:', row);
            return;
        }
        
        row.forEach((cell, colIndex) => {
            const cellDiv = document.createElement('div');
            cellDiv.className = 'cell';
            cellDiv.dataset.row = rowIndex;
            cellDiv.dataset.col = colIndex;
            cellDiv.textContent = cell !== 0 ? cell : '';
            
            cellDiv.addEventListener('click', () => {
                const value = prompt('Введіть число від 1 до 9:');
                if (value && /^[1-9]$/.test(value)) {
                    cellDiv.textContent = value;
                    // Тут можна додати логіку оновлення гри в базі даних
                }
            });
            
            gameBoardDiv.appendChild(cellDiv);
        });
    });
}

/**
 * Display messages
 * @param {Array} messages - The array of messages to display.
 */
export function displayMessages(messages) {
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML = '';
    messages.forEach(message => {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messagesDiv.appendChild(messageDiv);
    });
}

/**
 * Check if the player is logged in and display the appropriate UI
 */
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
