import { auth, provider, signInWithPopup } from './firebase-config.js';

// Перевірити, чи користувач увійшов
export function checkIfLoggedIn() {
    return new Promise((resolve, reject) => {
        auth.onAuthStateChanged(user => {
            if (user) {
                resolve(user);
            } else {
                reject('No user logged in');
            }
        });
    });
}


// Увійти через Google
// Log in with Google
export async function signInWithGoogle() {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log("Успішний вхід:", user.displayName);
        // Оновлюємо UI після успішного входу
        return user;
    } catch (error) {
        console.error("Помилка входу через Google:", error);
        throw error;
    }
}
