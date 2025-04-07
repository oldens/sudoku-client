import { db, ref, set, onValue } from './firebase-config.js';

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
                    // Якщо board - це рядок, парсимо його в масив
                    const board = typeof data.board === 'string' ? JSON.parse(data.board) : data.board;
                    console.log("Знайдено активну гру", board);
                    // Створюємо об'єкт з парснутими даними
                    resolve({
                        board: board,
                        players: data.players || [],
                        moves: data.moves || [],
                        isActive: data.isActive
                    });
                } else if (Array.isArray(data)) {
                    // Якщо data - це масив, використовуємо його як дошку
                    resolve({
                        board: data,
                        players: [],
                        moves: [],
                        isActive: true
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
