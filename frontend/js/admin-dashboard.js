document.addEventListener('DOMContentLoaded', () => {

    // --- RENDER DASHBOARD DATA ---
    const renderDashboardData = async () => {
        const dashboardData = await Api.getAdminDashboardData(); // Using mock API

        document.getElementById('totalManagers').textContent = dashboardData.totalManagers;
        document.getElementById('totalEmployees').textContent = dashboardData.totalEmployees;
        document.getElementById('pendingReimbursement').textContent = `$${dashboardData.pendingReimbursement.toFixed(2)}`;
        document.getElementById('monthExpenses').textContent = `$${dashboardData.monthExpenses.toFixed(2)}`;

        // Initialize Charts
        ChartHandler.createChart('expenseTrendChart', 'line', dashboardData.charts.expenseTrend);
        ChartHandler.createChart('categoryChart', 'pie', dashboardData.charts.categoryBreakdown);
        ChartHandler.createChart('departmentChart', 'bar', dashboardData.charts.departmentSpending);
    };

    // --- RENDER EXPENSE TABLE ---
    const renderExpenseTable = async (filter = 'all') => {
        const expenseTableBody = document.getElementById('expenseTableBody');
        if (!expenseTableBody) return;

        expenseTableBody.innerHTML = '<tr><td colspan="6" class="table-loading">Loading expenses...</td></tr>';
        
        const expenses = await Api.getExpenses({ filter }); // Using mock API

        if (expenses && expenses.length) {
            expenseTableBody.innerHTML = '';
            expenses.forEach(expense => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${Utils.escapeHTML(expense.employeeName)}</td>
                    <td>$${expense.amount.toFixed(2)}</td>
                    <td>${Utils.escapeHTML(expense.category)}</td>
                    <td>${expense.date}</td>
                    <td><span class="badge badge-${expense.status.toLowerCase()}">${Utils.escapeHTML(expense.status)}</span></td>
                    <td class="action-buttons">
                        <a href="../common/expense-details.html?id=${expense.id}" class="action-btn view" title="View Details">👁️</a>
                        ${expense.status === 'Pending' ? '<button class="action-btn approve" title="Approve">✓</button>' : ''}
                    </td>
                `;
                expenseTableBody.appendChild(tr);
            });
        } else {
            expenseTableBody.innerHTML = '<tr><td colspan="6" class="table-empty">No expenses found for this filter.</td></tr>';
        }
    };
    
    // --- EVENT LISTENERS for TABS ---
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const filter = tab.getAttribute('data-tab');
            renderExpenseTable(filter);
        });
    });

    // --- INITIALIZE ---
    // The SPA navigation logic is now handled in app.js.
    // This script will just render the initial data for the dashboard section.
    renderDashboardData();
    renderExpenseTable(); // Initial load for 'All Expenses'
});

