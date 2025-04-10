import { auth, provider, signInWithPopup } from './firebase-config.js';

// Перевірити, чи користувач увійшов
export async function checkIfLoggedIn() {
    try {
        return new Promise((resolve) => {
            auth.onAuthStateChanged(user => {
                if (user) {
                    resolve(user);
                } else {
                    throw new Error('No user logged in');
                }
            });
        });
    } catch (error) {
        console.error("Помилка перевірки авторизації:", error);
        throw error;
    }
}

// Увійти через Google
export async function signInWithGoogle() {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log("Успішний вхід:", user.displayName);
        return user;
    } catch (error) {
        console.error("Помилка входу через Google:", error);
        throw error;
    }
}

/