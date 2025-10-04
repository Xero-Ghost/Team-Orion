/**
 * utils.js
 * This file contains generic helper functions that can be reused across
 * the entire application, such as DOM selectors and a debounce function.
 */

/**
 * A simple shorthand for document.querySelector.
 * @param {string} selector - The CSS selector.
 * @returns {Element|null}
 */
const $ = (selector) => document.querySelector(selector);

/**
 * A simple shorthand for document.querySelectorAll.
 * @param {string} selector - The CSS selector.
 * @returns {NodeListOf<Element>}
 */
const $$ = (selector) => document.querySelectorAll(selector);

/**
 * Debounce function to limit the rate at which a function gets called.
 * @param {Function} func - The function to debounce.
 * @param {number} delay - The delay in milliseconds.
 * @returns {Function} - The debounced function.
 */
function debounce(func, delay = 300) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

/**
 * Sanitizes a string to prevent XSS attacks by converting HTML characters
 * into their corresponding entities.
 * @param {string} str - The string to sanitize.
 * @returns {string} - The sanitized string.
 */
function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}
