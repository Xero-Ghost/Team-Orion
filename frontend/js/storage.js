/**
 * storage.js
 * A wrapper module for browser storage (sessionStorage) to handle
 * authentication tokens, user data, and the dashboard URL consistently.
 */

const Storage = {
    storage: window.sessionStorage,

    // --- Internal Helper Methods ---
    _setItem(key, value) {
        if (typeof value === 'object') {
            this.storage.setItem(key, JSON.stringify(value));
        } else {
            this.storage.setItem(key, value);
        }
    },

    _getItem(key) {
        return this.storage.getItem(key);
    },

    // --- Token Management ---
    setToken(token) {
        this._setItem('authToken', token);
    },

    getToken() {
        return this._getItem('authToken');
    },

    // --- User Management ---
    setUser(user) {
        this._setItem('user', user);
    },

    getUser() {
        const user = this._getItem('user');
        try {
            return user ? JSON.parse(user) : null;
        } catch (e) {
            console.error("Error parsing user data from storage", e);
            this.clear(); // Clear corrupted data
            return null;
        }
    },

    // --- CRITICAL FIX: Dashboard URL Management ---
    setDashboardUrl(url) {
        this._setItem('dashboardUrl', url);
    },

    getDashboardUrl() {
        return this._getItem('dashboardUrl');
    },

    // --- Generic Get/Set for other data ---
    set(key, value) {
        this._setItem(key, value);
    },

    get(key) {
        return this._getItem(key);
    },

    // --- Cleanup ---
    clear() {
        this.storage.clear();
    }
};