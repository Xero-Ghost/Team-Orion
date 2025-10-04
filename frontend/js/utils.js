// utils.js

export const Utils = {
    /**
     * A simple shorthand for document.querySelector.
     * @param {string} selector - The CSS selector.
     * @returns {Element|null}
     */
    $(selector) {
        return document.querySelector(selector);
    },

    /**
     * A simple shorthand for document.querySelectorAll.
     * @param {string} selector - The CSS selector.
     * @returns {NodeListOf<Element>}
     */
    $$(selector) {
        return document.querySelectorAll(selector);
    },

    /**
     * Debounce function to limit the rate at which a function gets called.
     * @param {Function} func - The function to debounce.
     * @param {number} delay - The delay in milliseconds.
     * @returns {Function} - The debounced function.
     */
    debounce(func, delay = 300) {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    },

    /**
     * Sanitizes a string to prevent XSS attacks.
     * Renamed from sanitizeHTML to escapeHTML for clarity.
     * @param {string} str - The string to sanitize.
     * @returns {string} - The sanitized string.
     */
    escapeHTML(str) {
        const temp = document.createElement('div');
        temp.textContent = String(str); // Ensure input is treated as a string
        return temp.innerHTML;
    }
};