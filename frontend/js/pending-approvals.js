document.addEventListener('DOMContentLoaded', () => {
    const approvalQueue = document.getElementById('approvalQueue');

    const renderApprovalQueue = async () => {
        if (!approvalQueue) return;
        
        approvalQueue.innerHTML = '<div class="card"><div class="card-body text-center">Loading pending approvals...</div></div>';

        const pendingExpenses = await Api.getPendingExpenses(); // Using mock API

        if (pendingExpenses && pendingExpenses.length > 0) {
            approvalQueue.innerHTML = ''; // Clear loading message
            pendingExpenses.forEach(expense => {
                const card = document.createElement('div');
                card.className = 'card mb-md approval-card';
                card.innerHTML = `
                    <div class="card-body">
                        <div class="approval-card-header">
                            <span class="font-semibold">${Utils.escapeHTML(expense.employee)}</span>
                            <span class="text-gray-600">${expense.date}</span>
                        </div>
                        <div class="approval-card-body">
                            <div class="expense-amount">
                                <span class="amount">$${expense.amount.toFixed(2)}</span>
                                <span class="category">${Utils.escapeHTML(expense.category)}</span>
                            </div>
                            <p class="description">${Utils.escapeHTML(expense.description)}</p>
                        </div>
                        <div class="approval-card-footer">
                            <span class="pending-days">${expense.pendingDays} days pending</span>
                            <div class="action-buttons">
                                <button class="btn btn-sm btn-danger" data-id="${expense.id}" data-action="reject">Reject</button>
                                <button class="btn btn-sm btn-success" data-id="${expense.id}" data-action="approve">Approve</button>
                                <a href="../common/expense-details.html?id=${expense.id}" class="btn btn-sm btn-outline">Details</a>
                            </div>
                        </div>
                    </div>
                `;
                approvalQueue.appendChild(card);
            });
        } else {
            approvalQueue.innerHTML = '<div class="card"><div class="card-body text-center">No pending approvals.</div></div>';
        }
    };

    // --- EVENT LISTENERS ---
    if (approvalQueue) {
        approvalQueue.addEventListener('click', async (e) => {
            const target = e.target;
            const action = target.getAttribute('data-action');
            const expenseId = target.getAttribute('data-id');

            if (!action || !expenseId) return;

            if (action === 'approve') {
                target.textContent = 'Approving...';
                target.disabled = true;
                const result = await Api.approveExpense(expenseId);
                if (result.success) {
                    Notification.show('Expense approved successfully!', 'success');
                    renderApprovalQueue(); // Re-render the list
                } else {
                    Notification.show('Failed to approve expense.', 'error');
                    target.textContent = 'Approve';
                    target.disabled = false;
                }
            } else if (action === 'reject') {
                 target.textContent = 'Rejecting...';
                target.disabled = true;
                const result = await Api.rejectExpense(expenseId);
                 if (result.success) {
                    Notification.show('Expense rejected.', 'success');
                    renderApprovalQueue(); // Re-render the list
                } else {
                    Notification.show('Failed to reject expense.', 'error');
                    target.textContent = 'Reject';
                    target.disabled = false;
                }
            }
        });
    }


    // --- INITIALIZE ---
    renderApprovalQueue();
});
