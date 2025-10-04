import { Auth } from './auth.js';
import { Storage } from './storage.js';

export const Sidebar = {
    navItems: {
        admin: `
            <a href="/frontend/admin/admin_dashboard.html" class="nav-item">Dashboard</a>
            <a href="/frontend/admin/user-management.html" class="nav-item">User Management</a>
            <a href="/frontend/admin/approval-flow.html" class="nav-item">Approval Rules</a>
            <a href="/frontend/admin/reports.html" class="nav-item">Reports</a>
        `,
        manager: `
            <a href="/frontend/manager/manager-dashboard.html" class="nav-item">Dashboard</a>
            <a href="/frontend/manager/pending-approvals.html" class="nav-item">Pending Approvals</a>
            <a href="/frontend/manager/team-expenses.html" class="nav-item">Team Expenses</a>
        `,
        employee: `
            <a href="/frontend/employee/employee_dashboard.html" class="nav-item">Dashboard</a>
            <a href="/frontend/employee/submit-expense.html"="nav-item">Submit Expense</a>
            <a href="/frontend/employee/my-expenses.html" class="nav-item">My Expenses</a>
        `,
    },

    init() {
        const sidebarElement = document.getElementById('sidebar');
        if (!sidebarElement) return;

        const user = Auth.getCurrentUser();
        if (!user || !user.role) return;

        const roleNav = this.navItems[user.role.toLowerCase()];
        const commonNav = `<a href="/frontend/common/settings.html" class="nav-item">Settings</a>`;
        
        sidebarElement.innerHTML = `<nav class="sidebar-nav">${roleNav}${commonNav}</nav>`;
        this.highlightActiveLink();
    },

    highlightActiveLink() {
        const navItems = document.querySelectorAll('.sidebar .nav-item');
        const currentPath = window.location.pathname;

        navItems.forEach(item => {
            if (item.getAttribute('href') === currentPath) {
                item.classList.add('active');
            }
        });
    }
};