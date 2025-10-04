export const Storage = {
    storage: window.sessionStorage,

    set(key, value) {
        const valueToStore = typeof value === 'object' ? JSON.stringify(value) : value;
        this.storage.setItem(key, valueToStore);
    },

    get(key) {
        const item = this.storage.getItem(key);
        if (!item) return null;
        try {
            // Attempt to parse JSON, fall back to raw string if it fails
            return JSON.parse(item);
        } catch (e) {
            return item;
        }
    },

    setToken(token) { this.set('authToken', token); },
    getToken() { return this.get('authToken'); },

    setUser(user) { this.set('user', user); },
    getUser() { return this.get('user'); },

    setDashboardUrl(url) { this.set('dashboardUrl', url); },
    getDashboardUrl() { return this.get('dashboardUrl'); },

    clear() {
        this.storage.removeItem('authToken');
        this.storage.removeItem('user');
        this.storage.removeItem('dashboardUrl');
    },
};