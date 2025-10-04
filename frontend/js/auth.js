/**
 * auth.js
 * This file handles all authentication-related logic, including user login,
 * logout, session management, and role-based redirection. It acts as the
 * gatekeeper for the application.
 */

const Auth = {
    /**
     * Handles the user login process.
     * @param {string} email - The user's email.
     * @param {string} password - The user's password.
     */
    async handleLogin(email, password) {
        const loginBtn = document.getElementById('loginBtn');
        if(loginBtn) loginBtn.classList.add('loading');

        try {
            const response = await Api.login(email, password);
            if (response.success && response.token && response.user) {
                Notification.showToast('Login successful! Redirecting...', 'success');
                // Store token and user data
                Storage.setToken(response.token);
                Storage.setUser(response.user);

                // Redirect to the appropriate dashboard
                this.redirectToDashboard(response.user.role);
            } else {
                Notification.showToast(response.message || 'Login failed. Please check your credentials.', 'error');
            }
        } catch (error) {
            console.error('Login Error:', error);
            Notification.showToast('An error occurred during login.', 'error');
        } finally {
            if(loginBtn) loginBtn.classList.remove('loading');
        }
    },

    /**
     * Handles the user logout process.
     */
    handleLogout() {
        Storage.clear();
        // Redirect to login page relative to the root
        window.location.href = '/login.html';
    },

    /**
     * Checks the user's authentication state. If the user is not logged in,
     * they are redirected to the login page, unless they are already on an
     * authentication page.
     */
    checkAuthState() {
        const token = Storage.getToken();
        const isAuthPage = window.location.pathname.includes('login.html') || window.location.pathname.includes('signup.html');

        if (!token && !isAuthPage) {
            this.handleLogout(); // Redirects to login if not authenticated and not on an auth page
        } else if (token && isAuthPage) {
            // If logged in and on an auth page, redirect to their dashboard
            const user = this.getCurrentUser();
            if (user && user.role) {
                this.redirectToDashboard(user.role);
            }
        }
    },

    /**
     * Redirects the user to the correct dashboard based on their role.
     * THIS IS THE CRITICAL UPDATE: It now saves the dashboard URL to storage.
     * @param {string} role - The user's role ('admin', 'manager', 'employee').
     */
    redirectToDashboard(role) {
        const rolePaths = {
            admin: '/admin/admin_dashboard.html',
            manager: '/manager/manager-dashboard.html',
            employee: '/employee/employee_dashboard.html',
        };

        const path = rolePaths[role.toLowerCase()];

        if (path) {
            // *** CRITICAL FIX ***
            // Save the user's specific dashboard URL so the smart sidebar can use it.
            Storage.setDashboardUrl(path);
            window.location.href = path;
        } else {
            console.error('Unknown user role:', role);
            Notification.showToast('Invalid user role. Logging out.', 'error');
            this.handleLogout();
        }
    },

    /**
     * Retrieves the current user's data from storage.
     * THIS IS THE CRITICAL NEW FUNCTION.
     * @returns {object|null} The user object or null if not found.
     */
    getCurrentUser() {
        return Storage.getUser();
    },

    /**
     * Checks if a user is currently logged in.
     * @returns {boolean}
     */
    isLoggedIn() {
        return !!Storage.getToken();
    }
};
