document.addEventListener('DOMContentLoaded', () => {
    // --- MOCK DATA ---
    const mockTeamMembers = [
        { id: 'emp-103', name: 'Jane Smith', department: 'Engineering', email: 'jane.smith@example.com', totalExpenses: 1250.50 },
        { id: 'emp-104', name: 'Peter Jones', department: 'Marketing', email: 'peter.jones@example.com', totalExpenses: 875.00 },
    ];

    const mockPendingExpenses = [
        { id: 'exp-003', employee: 'Peter Jones', amount: 85.50, currency: 'USD', category: 'Food', date: '2023-10-25', description: 'Lunch meeting with client', pendingDays: 2 },
        { id: 'exp-004', employee: 'Jane Smith', amount: 120.00, currency: 'USD', category: 'Office Supplies', date: '2023-10-24', description: 'New keyboard and mouse', pendingDays: 3 },
    ];
    
    // --- DOM ELEMENTS ---
    const teamMembersBody = document.getElementById('teamMembersBody');
    const pendingCount = document.getElementById('pendingCount');
    const teamExpenses = document.getElementById('teamExpenses');
    const teamSize = document.getElementById('teamSize');
    const approvalQueue = document.getElementById('approvalQueue');

    // --- RENDER FUNCTIONS ---

    function renderDashboardStats() {
        if (pendingCount) pendingCount.textContent = mockPendingExpenses.length;
        if (teamExpenses) teamExpenses.textContent = '$' + mockTeamMembers.reduce((sum, member) => sum + member.totalExpenses, 0).toFixed(2);
        if (teamSize) teamSize.textContent = mockTeamMembers.length;
    }
    
    function renderTeamMembers() {
        if (!teamMembersBody) return;
        teamMembersBody.innerHTML = ''; // Clear existing content
        if (mockTeamMembers.length === 0) {
            teamMembersBody.innerHTML = '<tr><td colspan="4" class="table-empty">No team members found.</td></tr>';
            return;
        }
        mockTeamMembers.forEach(member => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${Utils.escapeHTML(member.name)}</td>
                <td>${Utils.escapeHTML(member.department)}</td>
                <td>${Utils.escapeHTML(member.email)}</td>
                <td>$${member.totalExpenses.toFixed(2)}</td>
            `;
            teamMembersBody.appendChild(tr);
        });
    }

    function renderApprovalQueue() {
        if (!approvalQueue) return;
        approvalQueue.innerHTML = ''; // Clear existing content
        if (mockPendingExpenses.length === 0) {
            approvalQueue.innerHTML = '<div class="card"><div class="card-body text-center">No pending approvals.</div></div>';
            return;
        }
        mockPendingExpenses.forEach(expense => {
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
                            <button class="btn btn-sm btn-danger">Reject</button>
                            <button class="btn btn-sm btn-success">Approve</button>
                            <a href="../common/expense-details.html?id=${expense.id}" class="btn btn-sm btn-outline">Details</a>
                        </div>
                    </div>
                </div>
            `;
            approvalQueue.appendChild(card);
        });
    }

    // --- INITIALIZE PAGE ---
    renderDashboardStats();
    renderTeamMembers();
    renderApprovalQueue();
    // The SPA navigation logic is handled by app.js, which is also loaded on this page.
});