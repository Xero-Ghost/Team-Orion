/**
 * expense-details.js
 * Handles the logic for the expense-details.html page. It fetches the specific
 * expense data, populates the page, and manages user actions based on their role.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Note: App.init() is called by app.js, so we don't call it here.
    // We just need to make sure the user is authenticated before proceeding.
    Auth.checkAuthState();

    const approveBtn = document.getElementById('approveBtn');
    const rejectBtn = document.getElementById('rejectBtn');
    const editBtn = document.getElementById('editBtn');
    const resubmitBtn = document.getElementById('resubmitBtn');
    const overrideBtn = document.getElementById('overrideBtn');

    let currentExpense = null;

    // --- Data Loading ---
    async function loadExpenseDetails() {
        const urlParams = new URLSearchParams(window.location.search);
        const expenseId = urlParams.get('id');

        if (!expenseId) {
            document.querySelector('.main-content').innerHTML = `<h1>Error: No expense ID provided.</h1>`;
            return;
        }

        try {
            const expense = await Api.getExpenseById(expenseId);
            if (!expense) {
                document.querySelector('.main-content').innerHTML = `<h1>Expense not found.</h1>`;
                return;
            }
            currentExpense = expense;
            populateExpenseData(expense);
            updateActionButtonsVisibility();
        } catch (error) {
            console.error("Failed to load expense details:", error);
            Notification.showToast('Could not load expense details.', 'error');
        }
    }

    function populateExpenseData(expense) {
        document.getElementById('expenseId').textContent = expense.id;
        document.getElementById('submissionDate').textContent = new Date(expense.date).toLocaleDateString();
        document.getElementById('employeeName').textContent = expense.employeeName;
        document.getElementById('employeeDept').textContent = expense.department || 'N/A';
        document.getElementById('expenseAmount').textContent = `${expense.currency} ${expense.amount.toFixed(2)}`;
        document.getElementById('expenseCategory').textContent = expense.category;
        document.getElementById('expenseDescription').textContent = expense.description;

        const statusBadge = document.getElementById('statusBadge');
        statusBadge.textContent = expense.status;
        statusBadge.className = `badge badge-${expense.status.toLowerCase()}`;

        // Populate receipts, timeline, and comments (mocked for now)
        document.getElementById('receiptsContainer').innerHTML = `<p class="text-gray-500">Receipts would be displayed here.</p>`;
        document.getElementById('timelineContainer').innerHTML = `<p class="text-gray-500">Approval timeline would be displayed here.</p>`;
        document.getElementById('commentsContainer').innerHTML = `<textarea class="form-control" rows="3" placeholder="Add a comment..."></textarea><button class="btn btn-secondary mt-sm">Add Comment</button>`;
    }

    // --- Action Button Visibility Logic (This was missing) ---
    function updateActionButtonsVisibility() {
        if (!currentExpense) return;

        const user = Auth.getCurrentUser();
        if (!user) return;

        const { role } = user;
        const { status } = currentExpense;

        // Hide all buttons by default
        [approveBtn, rejectBtn, editBtn, resubmitBtn, overrideBtn].forEach(btn => btn.classList.add('hidden'));

        if (role === 'admin') {
            overrideBtn.classList.remove('hidden');
        }

        if (role === 'manager' && status === 'Pending') {
            approveBtn.classList.remove('hidden');
            rejectBtn.classList.remove('hidden');
        }

        if (role === 'employee') {
            if (status === 'Pending') {
                editBtn.classList.remove('hidden');
            }
            if (status === 'Rejected') {
                resubmitBtn.classList.remove('hidden');
            }
        }
    }

    // --- Action Handlers ---
    async function handleApproval(newStatus) {
        const result = await Api.updateExpenseStatus(currentExpense.id, newStatus);
        if (result.success) {
            Notification.showToast(`Expense has been ${newStatus}.`, 'success');
            loadExpenseDetails(); // Reload to show updated status and hide buttons
        } else {
            Notification.showToast(result.message || 'An error occurred.', 'error');
        }
    }

    approveBtn?.addEventListener('click', () => {
        Modal.showConfirmation({
            title: 'Approve Expense?',
            message: 'Are you sure you want to approve this expense?',
            confirmText: 'Yes, Approve',
            onConfirm: () => handleApproval('Approved')
        });
    });

    rejectBtn?.addEventListener('click', () => {
        Modal.showConfirmation({
            title: 'Reject Expense?',
            message: 'Are you sure you want to reject this expense?',
            confirmText: 'Yes, Reject',
            confirmButtonClass: 'btn-danger',
            onConfirm: () => handleApproval('Rejected')
        });
    });

    // TODO: Add event listeners for edit, resubmit, and override buttons

    // Initial load
    loadExpenseDetails();
});

