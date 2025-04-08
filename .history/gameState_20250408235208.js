/**
 * @file gameState.js
 * @description This file contains functions related to game state management.
 * It includes functions to check for an active game, start a new game, and make a move.
 */

import { db, ref, set, onValue } from './firebase-config.js';

/**
 * Check for an active game
 * @returns {Promise} Resolves with the game data if an active game is found, otherwise resolves with null.
 */
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

/**
 * Start a new game
 * @returns {Promise} Resolves with true if the game is successfully started, otherwise rejects with an error message.
 */
export async function startNewGame() {
    try {
        // Створюємо початкову пусту дошку 9x9
        const emptyBoard = Array(9).fill().map(() => Array(9).fill(0));
        
        // Зберігаємо її в базі даних
        await set(ref(db, 'game/active'), {
            board: emptyBoard,
            status: 'active'
        });
        
        // Дані повернуться через onValue listener
        return true;
    } catch (error) {
        console.error("Помилка створення нової гри:", error);
        throw error;
    }
}

/**
 * Make a move
 * @param {number} row - The row index of the move.
 * @param {number} col - The column index of the move.
 * @param {number} value - The value to be placed in the cell.
 * @param {string} userId - The ID of the user making the move.
 * @param {string} userName - The name of the user making the move.
 * @returns {Promise} Resolves with the updated game data after the move, otherwise rejects with an error message.
 */
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
