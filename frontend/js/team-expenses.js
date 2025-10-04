document.addEventListener('DOMContentLoaded', () => {
    const teamExpensesBody = document.getElementById('teamExpensesBody');
    const searchInput = document.getElementById('teamExpenseSearch');
    const statusFilter = document.getElementById('statusFilter');

    let allExpenses = [];

    const renderTeamExpenses = (expensesToRender) => {
        if (!teamExpensesBody) return;
        teamExpensesBody.innerHTML = '';

        if (!expensesToRender || expensesToRender.length === 0) {
            teamExpensesBody.innerHTML = '<tr><td colspan="6" class="table-empty">No team expenses found.</td></tr>';
            return;
        }

        expensesToRender.forEach(expense => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${Utils.escapeHTML(expense.employeeName)}</td>
                <td>$${expense.amount.toFixed(2)}</td>
                <td>${Utils.escapeHTML(expense.category)}</td>
                <td>${expense.date}</td>
                <td><span class="badge badge-${expense.status.toLowerCase()}">${Utils.escapeHTML(expense.status)}</span></td>
                <td class="action-buttons">
                     <a href="../common/expense-details.html?id=${expense.id}" class="action-btn view" title="View Details">👁️</a>
                </td>
            `;
            teamExpensesBody.appendChild(tr);
        });
    };

    const filterAndRender = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const status = statusFilter.value;

        let filteredExpenses = allExpenses;

        if (status) {
            filteredExpenses = filteredExpenses.filter(exp => exp.status.toLowerCase() === status);
        }

        if (searchTerm) {
            filteredExpenses = filteredExpenses.filter(exp => 
                exp.employeeName.toLowerCase().includes(searchTerm) ||
                exp.category.toLowerCase().includes(searchTerm)
            );
        }

        renderTeamExpenses(filteredExpenses);
    };
    
    const initializePage = async () => {
        teamExpensesBody.innerHTML = '<tr><td colspan="6" class="table-loading">Loading expenses...</td></tr>';
        allExpenses = await Api.getTeamExpenses(); // Using mock API
        renderTeamExpenses(allExpenses);
    };

    // --- EVENT LISTENERS ---
    if(searchInput) {
        searchInput.addEventListener('input', filterAndRender);
    }
    if(statusFilter) {
        statusFilter.addEventListener('change', filterAndRender);
    }


    // --- INITIALIZE ---
    initializePage();
});
