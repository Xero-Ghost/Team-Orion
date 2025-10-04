import { Api } from './api.js';
import { Storage } from './storage.js';
import { Notification } from './notification.js';

export const Auth = {
    async handleLogin(email, password) {
        try {
            const response = await Api.login(email, password);
            Notification.showToast('Login successful! Redirecting...', 'success');
            Storage.setToken(response.access);
            Storage.setUser(response.user);
            this.redirectToDashboard(response.user.role);
        } catch (error) {
            Notification.showToast('Login failed. Please check your credentials.', 'error');
            throw error;
        }
    },

    handleLogout() {
        Storage.clear();
        window.location.href = '/frontend/login.html'; // Also correct this path
    },

    checkAuthState() {
        const token = Storage.getToken();
        const isAuthPage = window.location.pathname.includes('login.html') || window.location.pathname.includes('signup.html');

        if (!token && !isAuthPage) {
            this.handleLogout();
        } else if (token && isAuthPage) {
            const user = this.getCurrentUser();
            if (user && user.role) {
                this.redirectToDashboard(user.role);
            }
        }
    },

    redirectToDashboard(role) {
        // --- THIS IS THE CORRECTED PART ---
        const rolePaths = {
            admin: '/frontend/admin/admin_dashboard.html',
            manager: '/frontend/manager/manager-dashboard.html',
            employee: '/frontend/employee/employee_dashboard.html',
        };
        const path = rolePaths[role.toLowerCase()];
        if (path) {
            Storage.setDashboardUrl(path);
            window.location.href = path;
        } else {
            console.error('Unknown user role:', role);
            this.handleLogout();
        }
    },

    getCurrentUser: () => Storage.getUser(),
    isLoggedIn: () => !!Storage.getToken(),
};