import { db, ref, onValue } from './firebase-config.js';

export function checkForActiveGame() {
    const gameRef = ref(db, 'games/active');
    
    return new Promise((resolve) => {
        const unsubscribe = onValue(gameRef, (snapshot) => {
            unsubscribe();
            
            const data = snapshot.val();
            console.log("Дані з бази даних:", data);
            
            if (!data) {
                return resolve(null);
            }
            
            if (Array.isArray(data)) {
                return resolve({
                    board: data,
                    players: [],
                    moves: [],
                    isActive: true
                });
            }
            
            if (data.board) {
                const board = typeof data.board === 'string' 
                    ? JSON.parse(data.board) 
                    : data.board;
                    
                return resolve({
                    board,
                    players: data.players || [],
                    moves: data.moves || [],
                    isActive: data.isActive
                });
            }
            
            console.error("Невірний формат даних гри:", data);
            resolve(null);
        });
    });
} 


export function initFirebaseListener() {
    const gameRef = ref(db, 'games/active');
    onValue(gameRef, (snapshot) => {
        console.log("Firebase listener triggered", snapshot.val());
    });
} 

ini