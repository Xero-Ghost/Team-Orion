document.addEventListener('DOMContentLoaded', () => {
    const myExpensesBody = document.getElementById('myExpensesBody');
    const searchInput = document.getElementById('myExpenseSearch');
    const statusFilter = document.getElementById('statusFilter');

    // Pagination elements
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const currentPageSpan = document.getElementById('currentPage');
    const totalPagesSpan = document.getElementById('totalPages');

    let allMyExpenses = [];
    let currentPage = 1;
    const rowsPerPage = 10; // Or get from a selector if you have one

    const renderMyExpenses = (expensesToRender) => {
        if (!myExpensesBody) return;
        myExpensesBody.innerHTML = '';

        if (!expensesToRender || expensesToRender.length === 0) {
            myExpensesBody.innerHTML = '<tr><td colspan="5" class="table-empty">You have no expenses matching the criteria.</td></tr>';
            return;
        }

        const paginatedExpenses = expensesToRender.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

        paginatedExpenses.forEach(expense => {
            const tr = document.createElement('tr');

            let actions = `<a href="../common/expense-details.html?id=${expense.id}" class="action-btn view" title="View">👁️</a>`;
            if (expense.status.toLowerCase() === 'pending') {
                actions += `<button class="action-btn edit" title="Edit" data-id="${expense.id}">✏️</button>`;
            }
            if (expense.status.toLowerCase() === 'rejected') {
                actions += `<button class="action-btn resubmit" title="Resubmit" data-id="${expense.id}">🔄</button>`;
            }

            tr.innerHTML = `
                <td>${expense.date}</td>
                <td>$${expense.amount.toFixed(2)}</td>
                <td>${Utils.escapeHTML(expense.category)}</td>
                <td><span class="badge badge-${expense.status.toLowerCase()}">${Utils.escapeHTML(expense.status)}</span></td>
                <td class="action-buttons">${actions}</td>
            `;
            myExpensesBody.appendChild(tr);
        });
    };

    const setupPagination = (totalItems) => {
        const totalPages = Math.ceil(totalItems / rowsPerPage);
        totalPagesSpan.textContent = totalPages > 0 ? totalPages : 1;
        currentPageSpan.textContent = currentPage;

        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
    };

    const filterAndRender = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const status = statusFilter.value;

        let filteredExpenses = allMyExpenses;

        if (status) {
            filteredExpenses = filteredExpenses.filter(exp => exp.status.toLowerCase() === status);
        }

        if (searchTerm) {
            filteredExpenses = filteredExpenses.filter(exp =>
                exp.category.toLowerCase().includes(searchTerm) ||
                (exp.description && exp.description.toLowerCase().includes(searchTerm))
            );
        }

        currentPage = 1; // Reset to first page on filter change
        renderMyExpenses(filteredExpenses);
        setupPagination(filteredExpenses.length);
    };

    const initializePage = async () => {
        myExpensesBody.innerHTML = '<tr><td colspan="5" class="table-loading">Loading your expenses...</td></tr>';
        allMyExpenses = await Api.getMyExpenses(); // Using correct mock API function
        renderMyExpenses(allMyExpenses);
        setupPagination(allMyExpenses.length);
    };

    // --- EVENT LISTENERS ---
    if (searchInput) searchInput.addEventListener('input', filterAndRender);
    if (statusFilter) statusFilter.addEventListener('change', filterAndRender);

    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                filterAndRender();
            }
        });
    }

    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', () => {
            const totalPages = Math.ceil(allMyExpenses.length / rowsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                filterAndRender();
            }
        });
    }


    // --- INITIALIZE ---
    initializePage();
});