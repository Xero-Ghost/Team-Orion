/**
 * login.js
 * This script handles the specific logic for the login.html page.
 * It adds event listeners to the login form to capture user input
 * and calls the authentication handler.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Check auth state immediately to redirect if already logged in
    Auth.checkAuthState();

    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('loginBtn');
    const togglePasswordBtn = document.getElementById('togglePassword');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (loginBtn.classList.contains('loading')) return;

            loginBtn.classList.add('loading');
            
            // Clear previous errors
            Validation.clearError(emailInput);
            Validation.clearError(passwordInput);

            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();
            let isValid = true;

            if (!Validation.isValidEmail(email)) {
                Validation.showError(emailInput, 'Please enter a valid email address.');
                isValid = false;
            }

            if (!password) {
                Validation.showError(passwordInput, 'Password is required.');
                isValid = false;
            }

            if (isValid) {
                // Call the central authentication handler from auth.js
                await Auth.handleLogin(email, password);
            }
            
            // Use a slight delay to give feedback before removing loading state on failure
            setTimeout(() => loginBtn.classList.remove('loading'), 500);
        });
    }

    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', () => {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            togglePasswordBtn.querySelector('.eye-icon').textContent = isPassword ? '🙈' : '👁️';
        });
    }
});

