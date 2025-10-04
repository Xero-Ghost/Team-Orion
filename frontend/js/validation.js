/**
 * validation.js
 * This file provides functions for client-side form validation,
 * such as checking for valid email formats, password strength,
 * and required fields.
 */

const Validation = {
    /**
     * Displays an error message for a specific form field.
     * @param {HTMLInputElement} inputElement - The input element with the error.
     * @param {string} message - The error message to display.
     */
    showError(inputElement, message) {
        const formGroup = inputElement.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');
        formGroup.classList.add('error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    },

    /**
     * Clears the error message for a specific form field.
     * @param {HTMLInputElement} inputElement - The input element to clear.
     */
    clearError(inputElement) {
        const formGroup = inputElement.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');
        formGroup.classList.remove('error');
        if (errorElement) {
            errorElement.style.display = 'none';
            errorElement.textContent = '';
        }
    },

    /**
     * Validates if an email has a valid format.
     * @param {string} email - The email to validate.
     * @returns {boolean}
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    /**
     * Checks password strength based on criteria from the design plan.
     * @param {string} password - The password to check.
     * @returns {{isValid: boolean, strength: string, message: string}}
     */
    checkPasswordStrength(password) {
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        let strength = 'weak';
        if (score >= 5) strength = 'strong';
        else if (score >= 3) strength = 'medium';

        return {
            isValid: password.length >= 8 && score >= 4,
            strength: strength,
            message: 'Password must be at least 8 characters and include uppercase, lowercase, number, and a special character.'
        };
    }
};
