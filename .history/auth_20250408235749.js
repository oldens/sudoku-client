/**
 * @file auth.js
 * @description This file contains functions related to user authentication.
 * It includes functions to check if a user is logged in and to sign in with Google.
 */

import { auth, provider, signInWithPopup } from './firebase-config.js';

/**
 * Check if the player is logged in
 * @returns {Promise} Resolves with the user object if logged in, otherwise rejects with an error message.
 */
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

/**
 * Log in with Google
 * @returns {Promise} Resolves with the user object after successful login, otherwise rejects with an error message.
 */
export async function signInWithGoogle() {
    try {
        const result = await signInWithPopup(auth, provider);
        return result.user;
    } catch (error) {
        console.error("Помилка входу через Google:", error);
        throw error;
    }
}
