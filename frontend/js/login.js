import { Auth } from './auth.js';
import { Validation } from './validation.js';

document.addEventListener('DOMContentLoaded', () => {
    Auth.checkAuthState();

    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const loginBtn = document.getElementById('loginBtn');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');

        loginBtn.disabled = true;
        loginBtn.textContent = 'Logging In...';

        try {
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();
            // Basic validation can be added here if desired
            await Auth.handleLogin(email, password);
        } catch (error) {
            // Error is already handled in Auth.handleLogin, just reset button
            loginBtn.disabled = false;
            loginBtn.textContent = 'Login';
        }
    });
});