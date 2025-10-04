document.addEventListener('DOMContentLoaded', () => {
    
    const renderDashboardData = async () => {
        // Fetch data from the mock API
        const dashboardData = await Api.getEmployeeDashboardData(); 

        // Update dashboard cards
        const totalSubmittedEl = document.getElementById('totalSubmitted');
        const pendingCountEl = document.getElementById('pendingCount');
        const approvedAmountEl = document.getElementById('approvedAmount');
        const rejectedCountEl = document.getElementById('rejectedCount');

        if(totalSubmittedEl) totalSubmittedEl.textContent = `$${dashboardData.totalSubmitted.toFixed(2)}`;
        if(pendingCountEl) pendingCountEl.textContent = dashboardData.pendingCount;
        if(approvedAmountEl) approvedAmountEl.textContent = `$${dashboardData.approvedAmount.toFixed(2)}`;
        if(rejectedCountEl) rejectedCountEl.textContent = dashboardData.rejectedCount;

        // Populate the recent expenses table
        const recentExpensesBody = document.getElementById('recentExpensesBody');
        if (recentExpensesBody) {
            recentExpensesBody.innerHTML = ''; // Clear existing content
            
            if (dashboardData.recentExpenses && dashboardData.recentExpenses.length > 0) {
                dashboardData.recentExpenses.forEach(expense => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${expense.date}</td>
                        <td>$${expense.amount.toFixed(2)}</td>
                        <td>${Utils.escapeHTML(expense.category)}</td>
                        <td><span class="badge badge-${expense.status.toLowerCase()}">${Utils.escapeHTML(expense.status)}</span></td>
                        <td class="action-buttons">
                            <a href="../common/expense-details.html?id=${expense.id}" class="action-btn view" title="View Details">👁️</a>
                        </td>
                    `;
                    recentExpensesBody.appendChild(tr);
                });
            } else {
                // Show a message if there are no recent expenses
                recentExpensesBody.innerHTML = '<tr><td colspan="5" class="table-empty">No recent expenses to display.</td></tr>';
            }
        }
    };

    // --- INITIALIZE ---
    // This function runs as soon as the page is loaded
    renderDashboardData();
});