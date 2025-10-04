import { Api } from './api.js';
import { Utils } from './utils.js';
import { Notification } from './notification.js';
import { Auth } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    Auth.checkAuthState();
    const approvalQueue = document.getElementById('approvalQueue');

    const renderApprovalQueue = async () => {
        if (!approvalQueue) return;
        
        approvalQueue.innerHTML = '<div class="card"><div class="card-body text-center">Loading pending approvals...</div></div>';

        try {
            const pendingExpenses = await Api.getExpenses({ status: 'Pending' });

            if (pendingExpenses && pendingExpenses.length > 0) {
                approvalQueue.innerHTML = '';
                pendingExpenses.forEach(expense => {
                    const card = document.createElement('div');
                    card.className = 'card mb-md approval-card';
                    card.innerHTML = `
                        <div class="card-body">
                            <div class="approval-card-header">
                                <span class="font-semibold">${Utils.escapeHTML(expense.employeeName)}</span>
                                <span class="text-gray-600">${expense.date}</span>
                            </div>
                            <div class="approval-card-body">
                                <div class="expense-amount">
                                    <span class="amount">$${parseFloat(expense.amount).toFixed(2)}</span>
                                    <span class="category">${Utils.escapeHTML(expense.category)}</span>
                                </div>
                                <p class="description">${Utils.escapeHTML(expense.description)}</p>
                            </div>
                            <div class="approval-card-footer">
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
        } catch (error) {
            approvalQueue.innerHTML = '<div class="card"><div class="card-body text-center text-danger">Failed to load approvals.</div></div>';
        }
    };

    // --- EVENT LISTENERS ---
    approvalQueue?.addEventListener('click', async (e) => {
        const button = e.target.closest('button[data-action]');
        if (!button) return;

        const action = button.dataset.action;
        const expenseId = button.dataset.id;
        button.disabled = true;
        
        const newStatus = action === 'approve' ? 'Approved' : 'Rejected';

        try {
            await Api.updateExpenseStatus(expenseId, newStatus);
            Notification.showToast(`Expense has been ${newStatus}.`, 'success');
            
            // --- THIS IS THE FIX ---
            // Re-render the list to show the updated data
            renderApprovalQueue(); 
            
        } catch (error) {
            Notification.showToast('Action failed. Please try again.', 'error');
            button.disabled = false;
        }
    });

    // --- INITIALIZE ---
    renderApprovalQueue();
});