/**
 * sidebar.js
 * Handles the dynamic creation and management of the role-based sidebar.
 */

const Sidebar = {
    // Corrected templates with absolute paths for SPA links
    navItems: {
        admin: `
            <a href="/admin/admin_dashboard.html" class="nav-item" data-section="dashboard">
                <span class="nav-icon">📊</span> <span class="nav-text">Dashboard</span>
            </a>
            <a href="/admin/admin_dashboard.html#user-management" class="nav-item" data-section="user-management">
                <span class="nav-icon">👥</span> <span class="nav-text">User Management</span>
            </a>
            <a href="/admin/approval-flow.html" class="nav-item">
                <span class="nav-icon">✓</span> <span class="nav-text">Approval Rules</span>
            </a>
            <a href="/admin/reports.html" class="nav-item">
                <span class="nav-icon">📈</span> <span class="nav-text">Reports & Analytics</span>
            </a>
            <a href="/common/settings.html" class="nav-item">
                <span class="nav-icon">⚙️</span> <span class="nav-text">Settings</span>
            </a>
        `,
        manager: `
            <a href="/frontend/managerd/manager/manager-dashboard.html" class="nav-item" data-section="dashboard">
                <span class="nav-icon">📊</span> <span class="nav-text">Dashboard</span>
            </a>
            <a href="/frontend/managerd/manager/pending-approvals.html" class="nav-item">
                <span class="nav-icon">⏳</span> <span class="nav-text">Pending Approvals</span>
            </a>
            <a href="/frontend/managerd/manager/team-expenses.html" class="nav-item">
                <span class="nav-icon">💰</span> <span class="nav-text">Team Expenses</span>
            </a>
            <a href="/employee/my-expenses.html" class="nav-item">
                <span class="nav-icon">📄</span> <span class="nav-text">My Expenses</span>
            </a>
             <a href="/admin/reports.html" class="nav-item">
                <span class="nav-icon">📈</span> <span class="nav-text">Reports</span>
            </a>
            <a href="/common/settings.html" class="nav-item">
                <span class="nav-icon">⚙️</span> <span class="nav-text">Settings</span>
            </a>
        `,
        employee: `
            <a href="/employee/employee_dashboard.html" class="nav-item">
                <span class="nav-icon">📊</span> <span class="nav-text">Dashboard</span>
            </a>
            <a href="/employee/submit-expense.html" class="nav-item">
                <span class="nav-icon">➕</span> <span class="nav-text">Submit Expense</span>
            </a>
            <a href="/employee/my-expenses.html" class="nav-item">
                <span class="nav-icon">📄</span> <span class="nav-text">My Expenses</span>
            </a>
            <a href="/common/settings.html" class="nav-item">
                <span class="nav-icon">⚙️</span> <span class="nav-text">Settings</span>
            </a>
        `,
    },

    init() {
        const sidebarElement = document.getElementById('sidebar');
        if (!sidebarElement) return;

        const user = Auth.getCurrentUser();
        if (!user || !user.role) {
            console.warn("No user role found, cannot build sidebar.");
            return;
        }

        // *** CRITICAL FIX: Changed Storage.get() to Storage.getDashboardUrl() ***
        const dashboardUrl = Storage.getDashboardUrl();
        if (!dashboardUrl) {
            console.error("Dashboard URL not found in storage. Cannot build sidebar correctly.");
            // As a fallback, try to build a default path.
            const fallbackUrl = `/${user.role}/${user.role}_dashboard.html`.replace('_','-');
            console.warn(`Using fallback dashboard URL: ${fallbackUrl}`);
            Storage.setDashboardUrl(fallbackUrl);
        }

        let navHtml = this.navItems[user.role.toLowerCase()];

        if (!navHtml) {
            console.error(`No sidebar template defined for role: ${user.role}`);
            return;
        }

        sidebarElement.innerHTML = `<nav class="sidebar-nav">${navHtml}</nav>`;

        this.highlightActiveLink();
    },

    highlightActiveLink() {
        const navItems = document.querySelectorAll('.sidebar .nav-item');
        const currentPath = window.location.pathname;
        const currentHash = window.location.hash;

        navItems.forEach(item => {
            const itemUrl = new URL(item.href, window.location.origin);
            const itemPath = itemUrl.pathname;
            const itemHash = itemUrl.hash;

            item.classList.remove('active');

            // Logic to highlight the correct link, now checking both path and hash
            if (itemPath === currentPath) {
                if (itemHash && itemHash === currentHash) {
                    item.classList.add('active'); // e.g., on dashboard, #user-management matches
                } else if (!itemHash && !currentHash) {
                    item.classList.add('active'); // e.g., on settings.html page
                } else if (itemPath.includes('dashboard') && !itemHash && !currentHash){
                    // Special case for the main dashboard link
                    const dashboardLink = document.querySelector(`.sidebar .nav-item[data-section="dashboard"]`);
                    if(dashboardLink) dashboardLink.classList.add('active');
                }
            }
        });
    }
};

