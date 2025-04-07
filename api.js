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