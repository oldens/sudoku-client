const API_URL = 'https://sudoku-378406934320.us-central1.run.app';

// Створити нову гру
export async function createNewGame() {
    try {
        const response = await fetch(`${API_URL}/game/active`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return null;
    } catch (error) {
        console.error("Помилка при створенні нової гри:", error);
        throw error;
    }
}

export async function startNewGame() {
    const response = await fetch(`${API_URL}/game/active`, {
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
}

export async function makeMove(row, col, value, userId, userName) {
    const move = { row, col, value, userId, userName };
    const response = await fetch(`${API_URL}/game/move`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(move)
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
} 