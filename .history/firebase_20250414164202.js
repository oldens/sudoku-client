import { db, ref, onValue } from './firebase-config.js';



export function initFirebaseListener(clb) {
    const gameRef = ref(db, 'games/active');
    onValue(gameRef, (snapshot) => {

        const data = snapshot.val();
            console.log("Дані з бази даних:", data);
            
            if (!data) {
                return ;
            }
        
            if (data.board) {
                const board = typeof data.board === 'string' 
                    ? JSON.parse(data.board) 
                    : data.board;
                    
                    clb({
                        board,
                        players: data.players || [],
                        moves: data.moves || [],
                        isActive: data.isActive
                    });
            }
    
        console.log("Firebase listener triggered", snapshot.val());
    });
}