export async function startNewGame() {
    try {
        const response = await fetch('https://sudoku-378406934320.us-central1.run.app/game/active', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        window.location.reload();
        
        return null;
    } catch (error) {
        console.error("Error creating new game:", error);
        throw error;
    }
}

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
        console.error("Error making move:", error);
        throw error;
    }
}
