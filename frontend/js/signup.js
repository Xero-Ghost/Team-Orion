/**
 * signup.js
 * Handles the logic for the signup.html page, including form validation,
 * country and currency fetching, and password strength checking.
 */

document.addEventListener('DOMContentLoaded', () => {
    // This call is correct here, as it prevents a logged-in user from seeing the signup page.
    Auth.checkAuthState();

    const signupForm = document.getElementById('signupForm');
    const countrySelect = document.getElementById('country');
    const currencyInput = document.getElementById('currency');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const passwordStrengthBar = document.querySelector('#passwordStrength .strength-bar');
    const submitBtn = document.getElementById('submitBtn');

    // --- Country and Currency Logic ---
    async function populateCountries() {
        if (!countrySelect) return;
        try {
            const countries = await Api.getCountries();
            countries.forEach(country => {
                const option = document.createElement('option');
                option.value = country.code;
                option.textContent = country.name;
                option.dataset.currency = country.currency;
                countrySelect.appendChild(option);
            });
        } catch (error) {
            console.error("Failed to load countries:", error);
            Notification.showToast('Could not load country data.', 'error');
        }
    }

    if (countrySelect) {
        countrySelect.addEventListener('change', () => {
            const selectedOption = countrySelect.options[countrySelect.selectedIndex];
            if (currencyInput) {
                currencyInput.value = selectedOption.dataset.currency || '';
            }
        });
    }

    // --- Password Strength and Visibility ---
    if (passwordInput && passwordStrengthBar) {
        passwordInput.addEventListener('input', () => {
            const { strength } = Validation.checkPasswordStrength(passwordInput.value);
            passwordStrengthBar.className = `strength-bar ${strength}`;
        });
    }

    function setupPasswordToggle(toggleId, inputId) {
        const toggleBtn = document.getElementById(toggleId);
        const passwordField = document.getElementById(inputId);
        if (toggleBtn && passwordField) {
            toggleBtn.addEventListener('click', () => {
                const isPassword = passwordField.type === 'password';
                passwordField.type = isPassword ? 'text' : 'password';
                toggleBtn.querySelector('.eye-icon').textContent = isPassword ? '🙈' : '👁️';
            });
        }
    }
    setupPasswordToggle('togglePassword', 'password');
    setupPasswordToggle('toggleConfirmPassword', 'confirmPassword');

    // --- Form Submission ---
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (submitBtn.classList.contains('loading')) return;

            // ** THIS IS THE CORRECTED LOGIC **
            // 1. Full validation
            const fields = ['companyName', 'country', 'fullName', 'email', 'password', 'confirmPassword', 'terms'];
            let isValid = true;

            fields.forEach(id => {
                const input = document.getElementById(id);
                Validation.clearError(input);
                if ((input.type === 'checkbox' && !input.checked) || (input.type !== 'checkbox' && !input.value.trim())) {
                    Validation.showError(input, 'This field is required.');
                    isValid = false;
                }
            });

            if (passwordInput.value !== confirmPasswordInput.value) {
                Validation.showError(confirmPasswordInput, 'Passwords do not match.');
                isValid = false;
            }

            if (!isValid) return;

            // 2. Gather data and call API
            submitBtn.classList.add('loading');
            const formData = new FormData(signupForm);
            const signupData = Object.fromEntries(formData.entries());

            try {
                const response = await Api.signup(signupData);
                if (response.success) {
                    Notification.showToast('Account created successfully! Redirecting to login...', 'success');
                    setTimeout(() => {
                        window.location.href = '/login.html';
                    }, 2000);
                } else {
                    Notification.showToast(response.message || 'Signup failed. Please try again.', 'error');
                }
            } catch (error) {
                console.error('Signup Error:', error);
                Notification.showToast('An error occurred during signup.', 'error');
            } finally {
                submitBtn.classList.remove('loading');
            }
        });
    }

    // Initial population of countries
    populateCountries();
});

