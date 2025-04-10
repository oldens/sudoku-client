import { auth, provider, signInWithPopup } from './firebase-config.js';

// Перевірити, чи користувач увійшов
checkIfLoggedIn()
  .then(user => {
    console.log("Користувач увійшов:", user);
    // Можна тут викликати функцію для завантаження даних користувача
  })
  .catch(error => {
    console.log("Користувач не увійшов:", error);
    // Можна перенаправити на логін-сторінку
  });

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