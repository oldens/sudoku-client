import { auth, provider, signInWithPopup } from './firebase-config.js';

// Перевірити, чи користувач увійшов
export function checkIfLoggedIn() {
    return new Promise((resolve, reject) => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            unsubscribe();
            if (user) {
                resolve(user);
            } else {
                reject(new Error('No user logged in'));
            }
        });
    });
}

// Увійти через Google
// Log in with Google
export async function signInWithGoogle() {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("Успішний вхід:", user.displayName);
    // Оновлюємо UI після успішного входу
    await checkForActiveGameAndUpdateUI();
    return user;
}
