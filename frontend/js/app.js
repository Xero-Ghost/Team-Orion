/**
 * app.js
 * This file contains the main application logic that runs on every authenticated page.
 * Its primary jobs are to build the shared header and initialize the smart sidebar.
 */

// This self-invoking function runs as soon as the file is loaded.
(function App() {
    /**
     * Builds the common header component for all authenticated pages.
     */
    function buildHeader() {
        const header = document.getElementById('main-header');
        if (!header) return;

        const user = Auth.getCurrentUser();
        const userName = user ? user.name : 'User';
        const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase();

        header.innerHTML = `
            <div class="header-left">
                <button class="menu-toggle" id="menuToggle">
                    <span class="hamburger"></span>
                </button>
                <h2 class="company-name" id="companyName">${user ? user.companyName : 'Company'}</h2>
            </div>
            <div class="header-right">
                <a href="../common/notifications.html" class="notification-btn" id="notificationBtn">
                    <span class="notification-icon">🔔</span>
                    <!-- In a real app, this badge would be dynamic -->
                    <span class="notification-badge" id="notificationBadge">3</span>
                </a>
                <div class="user-profile-dropdown">
                    <button class="user-profile-btn" id="userProfileBtn">
                        <div class="user-avatar">
                            <span id="userInitials">${userInitials}</span>
                        </div>
                        <span class="user-name" id="userName">${userName}</span>
                        <span class="dropdown-arrow">▼</span>
                    </button>
                    <div class="dropdown-menu" id="profileDropdown">
                        <a href="../common/settings.html" class="dropdown-item">
                            <span class="icon">⚙️</span> Settings
                        </a>
                        <a href="#" class="dropdown-item" id="logoutBtnHeader">
                            <span class="icon">🚪</span> Logout
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Adds event listeners to the dynamically created header elements.
     */
    function addHeaderEventListeners() {
        const menuToggle = document.getElementById('menuToggle');
        const sidebarEl = document.getElementById('sidebar');
        if (menuToggle && sidebarEl) {
            menuToggle.addEventListener('click', () => {
                sidebarEl.classList.toggle('show');
            });
        }

        const userProfileBtn = document.getElementById('userProfileBtn');
        const profileDropdown = document.getElementById('profileDropdown');
        if (userProfileBtn && profileDropdown) {
            userProfileBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                profileDropdown.classList.toggle('show');
            });
        }

        const logoutBtn = document.getElementById('logoutBtnHeader');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                Auth.handleLogout();
            });
        }
    }

    // --- Global Initialization ---
    // This runs automatically when app.js is included in any HTML file.
    document.addEventListener('DOMContentLoaded', () => {
        // First, check if the user is even logged in.
        Auth.checkAuthState();

        // If they are, build the dynamic parts of the UI.
        buildHeader();
        Sidebar.init(); // Initialize the smart sidebar

        // After building the UI, attach the event listeners.
        addHeaderEventListeners();
    });

    // Add a global click listener to close the dropdown when clicking anywhere else
    window.addEventListener('click', () => {
        const profileDropdown = document.getElementById('profileDropdown');
        if (profileDropdown && profileDropdown.classList.contains('show')) {
            profileDropdown.classList.remove('show');
        }
    });

})(); // The parentheses here execute the function immediately.

