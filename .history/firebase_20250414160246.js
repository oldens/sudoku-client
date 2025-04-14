import { db, ref, onValue } from './firebase-config.js';

export function checkForActiveGame(callback) {
    if (typeof callback !== 'function') {
        console.error('checkForActiveGame: callback має бути функцією');
        return;
    }

    const gameRef = ref(db, 'games/active');
    
    onValue(gameRef, (snapshot) => {
        const data = snapshot.val();
        console.log("Дані з бази даних:", data);
        
        if (!data) {
            callback(null);
            return;
        }
        
        if (Array.isArray(data)) {
            callback({
                board: data,
                players: [],
                moves: [],
                isActive: true
            });
            return;
        }
        
        if (data.board) {
            const board = typeof data.board === 'string' 
                ? JSON.parse(data.board) 
                : data.board;
                
            callback({
                board,
                players: data.players || [],
                moves: data.moves || [],
                isActive: data.isActive
            });
            return;
        }
        
        console.error("Невірний формат даних гри:", data);
        callback(null);
    });

    // Повертаємо функцію для відписки
    return () => {
        gameRef.off();
    };
}