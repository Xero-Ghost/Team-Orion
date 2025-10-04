// employee-dashboard.js (Example)
import { Api } from './api.js';
import { Utils } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const stats = await Api.getEmployeeDashboardStats();
        
        // Update dashboard cards
        document.getElementById('totalSubmitted').textContent = `$${stats.totalSubmitted.toFixed(2)}`;
        document.getElementById('pendingCount').textContent = stats.pendingCount;
        // ... and so on

        // Populate recent expenses table
        const recentExpensesBody = document.getElementById('recentExpensesBody');
        recentExpensesBody.innerHTML = '';
        stats.recentExpenses.forEach(expense => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${expense.date}</td>
                <td>$${expense.amount}</td>
                <td>${Utils.escapeHTML(expense.category)}</td>
                <td><span class="badge badge-${expense.status.toLowerCase()}">${Utils.escapeHTML(expense.status)}</span></td>
                <td><a href="/common/expense-details.html?id=${expense.id}">View</a></td>
            `;
            recentExpensesBody.appendChild(tr);
        });
    } catch (error) {
        console.error("Failed to load dashboard data:", error);
    }
});