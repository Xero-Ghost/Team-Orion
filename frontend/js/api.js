/**
 * api.js
 * This file serves as a centralized place for all API calls to the backend.
 * In this version, it uses mock data to simulate API responses, allowing for
 * frontend development without a live backend.
 */

const Api = {
    // --- MOCK DATABASE ---
    // In a real application, this data would live on a server.
    mockUsers: [
        { id: 'user001', name: 'Admin User', email: 'admin@example.com', password: 'password', role: 'admin', department: 'Management', companyName: 'Innovate Corp' },
        { id: 'user002', name: 'Manager User', email: 'manager@example.com', password: 'password', role: 'manager', department: 'Engineering', companyName: 'Innovate Corp' },
        { id: 'user003', name: 'Employee User', email: 'employee@example.com', password: 'password', role: 'employee', department: 'Engineering', managerId: 'user002', companyName: 'Innovate Corp' },
        { id: 'user004', name: 'Jane Smith', email: 'jane.smith@example.com', password: 'password', role: 'employee', department: 'Marketing', managerId: 'user002', companyName: 'Innovate Corp' },
    ],
    mockExpenses: [
        { id: 'exp001', userId: 'user003', employeeName: 'Employee User', department: 'Engineering', amount: 150.75, currency: 'USD', category: 'Travel', date: '2025-10-25', description: 'Taxi from airport to hotel for client meeting.', status: 'Pending', approver: 'Manager User', receipts: ['receipt1.jpg'], timeline: [{ status: 'Submitted', date: '2025-10-25', user: 'Employee User' }] },
        { id: 'exp002', userId: 'user004', employeeName: 'Jane Smith', department: 'Marketing', amount: 85.50, currency: 'USD', category: 'Food', date: '2025-10-24', description: 'Lunch with the marketing team to discuss Q4 strategy.', status: 'Pending', approver: 'Manager User', receipts: [], timeline: [{ status: 'Submitted', date: '2025-10-24', user: 'Jane Smith' }] },
        { id: 'exp003', userId: 'user003', employeeName: 'Employee User', department: 'Engineering', amount: 450.00, currency: 'USD', category: 'Travel', date: '2025-10-20', description: 'Flight tickets for conference.', status: 'Approved', approver: 'Manager User', receipts: ['receipt2.pdf'], timeline: [{ status: 'Submitted', date: '2025-10-20', user: 'Employee User' }, { status: 'Approved', date: '2025-10-21', user: 'Manager User' }] },
        { id: 'exp004', userId: 'user004', employeeName: 'Jane Smith', department: 'Marketing', amount: 220.00, currency: 'USD', category: 'Accommodation', date: '2025-10-18', description: 'Hotel stay for Q4 planning summit.', status: 'Rejected', approver: 'Manager User', receipts: [], timeline: [{ status: 'Submitted', date: '2025-10-18', user: 'Jane Smith' }, { status: 'Rejected', date: '2025-10-19', user: 'Manager User', comment: 'Please use the corporate rate.' }] },
    ],
    mockCountries: [
        { name: "United States", code: "US", currency: "USD" },
        { name: "United Kingdom", code: "GB", currency: "GBP" },
        { name: "India", code: "IN", currency: "INR" },
        { name: "Germany", code: "DE", currency: "EUR" },
    ],

    /**
     * Simulates a network request delay.
     * @param {number} ms - Milliseconds to wait.
     */
    _simulateDelay(ms = 500) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    // --- Authentication Endpoints ---
    async login(email, password) {
        await this._simulateDelay();
        const user = this.mockUsers.find(u => u.email === email && u.password === password);
        if (user) {
            console.log('Mock Login Success:', user);
            return { success: true, user: { ...user }, token: `mock_token_for_${user.id}` };
        }
        return { success: false, message: 'Invalid credentials' };
    },

    async signup(data) {
        await this._simulateDelay();
        console.log('Mock Signup with data:', data);
        // Simulate a successful signup and return the new admin user
        const newUser = { id: `user${Date.now()}`, ...data, role: 'admin' };
        this.mockUsers.push(newUser);
        return { success: true, user: newUser, token: `mock_token_for_${newUser.id}` };
    },

    // --- Data Fetching Endpoints ---
    async getCountries() {
        await this._simulateDelay(200);
        return [...this.mockCountries];
    },

    async getAdminDashboardStats() {
        await this._simulateDelay();
        const pendingTotal = this.mockExpenses
            .filter(e => e.status === 'Pending')
            .reduce((sum, e) => sum + e.amount, 0);

        return {
            totalManagers: this.mockUsers.filter(u => u.role === 'manager').length,
            totalEmployees: this.mockUsers.filter(u => u.role === 'employee').length,
            pendingReimbursement: pendingTotal,
            monthExpenses: this.mockExpenses.reduce((sum, e) => sum + e.amount, 0),
        };
    },

    async getManagerDashboardStats(managerId) {
        await this._simulateDelay();
        const teamMemberIds = this.mockUsers.filter(u => u.managerId === managerId).map(u => u.id);
        const teamExpenses = this.mockExpenses.filter(e => teamMemberIds.includes(e.userId));

        return {
            pendingCount: teamExpenses.filter(e => e.status === 'Pending').length,
            teamExpensesThisMonth: teamExpenses.reduce((sum, e) => sum + e.amount, 0),
            teamSize: teamMemberIds.length
        };
    },

    async getEmployeeDashboardStats(userId) {
        await this._simulateDelay();
        const myExpenses = this.mockExpenses.filter(e => e.userId === userId);
        return {
            totalSubmitted: myExpenses.reduce((sum, e) => sum + e.amount, 0),
            pendingCount: myExpenses.filter(e => e.status === 'Pending').length,
            approvedAmount: myExpenses.filter(e => e.status === 'Approved').reduce((sum, e) => sum + e.amount, 0),
            rejectedCount: myExpenses.filter(e => e.status === 'Rejected').length,
            recentExpenses: myExpenses.slice(0, 5)
        };
    },

    async getAllUsers() {
        await this._simulateDelay();
        // Add manager name for display purposes
        return this.mockUsers.map(u => ({
            ...u,
            managerName: u.managerId ? this.mockUsers.find(m => m.id === u.managerId)?.name : 'N/A'
        }));
    },

    async getTeamMembers(managerId) {
        await this._simulateDelay();
        return this.mockUsers.filter(u => u.managerId === managerId);
    },

    async getAllExpenses() {
        await this._simulateDelay();
        return [...this.mockExpenses];
    },

    async getTeamExpenses(managerId) {
        await this._simulateDelay();
        const teamMemberIds = this.mockUsers.filter(u => u.managerId === managerId).map(u => u.id);
        return this.mockExpenses.filter(e => teamMemberIds.includes(e.userId));
    },

    async getMyExpenses(userId) {
        await this._simulateDelay();
        return this.mockExpenses.filter(e => e.userId === userId);
    },

    async getExpenseById(expenseId) {
        await this._simulateDelay();
        const expense = this.mockExpenses.find(e => e.id === expenseId);
        return { ...expense }; // Return a copy
    },

    // --- Data Mutation Endpoints ---
    async submitExpense(expenseData) {
        await this._simulateDelay();
        const newExpense = {
            id: `exp${Date.now()}`,
            ...expenseData,
            status: 'Pending',
            timeline: [{ status: 'Submitted', date: new Date().toISOString().split('T')[0], user: expenseData.employeeName }]
        };
        this.mockExpenses.unshift(newExpense); // Add to the top of the list
        return { success: true, expense: newExpense };
    },

    async updateExpenseStatus(expenseId, newStatus) {
        await this._simulateDelay();
        const expense = this.mockExpenses.find(e => e.id === expenseId);
        if (expense) {
            expense.status = newStatus;
            expense.timeline.push({ status: newStatus, date: new Date().toISOString().split('T')[0], user: 'Current User' });
            return { success: true };
        }
        return { success: false, message: 'Expense not found.' };
    },
};