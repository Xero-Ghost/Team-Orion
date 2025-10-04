import { Auth } from './auth.js';
import { Sidebar } from './sidebar.js';

const App = {
    init() {
        Auth.checkAuthState();
        this.buildHeader();
        Sidebar.init();
        this.addEventListeners();
    },

    buildHeader() {
        const header = document.getElementById('main-header');
        if (!header) return;

        const user = Auth.getCurrentUser();
        const userName = user ? user.first_name : 'User';
        const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase();

        header.innerHTML = `
            <div class="header-left">
                <button class="menu-toggle" id="menuToggle">
                    <span class="hamburger"></span>
                </button>
                <h2 class="company-name">Innovate Corp</h2>
            </div>
            <div class="header-right">
                <div class="user-profile-dropdown">
                    <button class="user-profile-btn" id="userProfileBtn">
                        <div class="user-avatar">
                            <span>${userInitials}</span>
                        </div>
                        <span class="user-name">${userName}</span>
                        <span class="dropdown-arrow">▼</span>
                    </button>
                    <div class="dropdown-menu" id="profileDropdown">
                        <a href="/common/settings.html" class="dropdown-item">Settings</a>
                        <a href="#" class="dropdown-item" id="logoutBtnHeader">Logout</a>
                    </div>
                </div>
            </div>`;
    },

    addEventListeners() {
        document.getElementById('menuToggle')?.addEventListener('click', () => {
            document.getElementById('sidebar')?.classList.toggle('show');
        });

        document.getElementById('userProfileBtn')?.addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('profileDropdown')?.classList.toggle('show');
        });

        document.getElementById('logoutBtnHeader')?.addEventListener('click', (e) => {
            e.preventDefault();
            Auth.handleLogout();
        });

        window.addEventListener('click', () => {
            document.getElementById('profileDropdown')?.classList.remove('show');
        });
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());