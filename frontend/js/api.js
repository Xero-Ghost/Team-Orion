import { Storage } from './storage.js';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const fetchWrapper = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}/${endpoint}`;
    const token = Storage.getToken();
    const headers = options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, { ...options, headers });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `HTTP error! Status: ${response.status}`);
        }
        return response.status === 204 ? null : response.json();
    } catch (error) {
        console.error(`API Error on ${endpoint}:`, error);
        throw error;
    }
};

export const Api = {
    // Auth
    login: (email, password) => fetchWrapper('login/', { method: 'POST', body: JSON.stringify({ email, password }) }),
    signup: (data) => fetchWrapper('register/', { method: 'POST', body: JSON.stringify(data) }),

    // User Profile & Management
    getUserProfile: () => fetchWrapper('users/me/'),
    updateUserProfile: (data) => fetchWrapper('users/me/', { method: 'PATCH', body: JSON.stringify(data) }),
    getAllUsers: () => fetchWrapper('admin/users/'),

    // Dashboards
    getAdminDashboardStats: () => fetchWrapper('dashboard/admin/'),
    getManagerDashboardStats: () => fetchWrapper('dashboard/manager/'),
    getEmployeeDashboardStats: () => fetchWrapper('dashboard/employee/'),

    // Expenses
    getExpenses: (filters = {}) => {
        const params = new URLSearchParams(filters);
        return fetchWrapper(`expenses/?${params.toString()}`);
    },
    getTeamExpenses: () => fetchWrapper('expenses/'), // Backend now handles manager role
    getMyExpenses: () => fetchWrapper('expenses/'), // Backend handles employee role
    getExpenseById: (id) => fetchWrapper(`expenses/${id}/`),
    submitExpense: (formData) => fetchWrapper('expenses/', { method: 'POST', body: formData }),
    updateExpenseStatus: (id, status) => fetchWrapper(`expenses/${id}/update-status/`, { method: 'POST', body: JSON.stringify({ status }) }),

    // Reports & Misc
    getReportData: (filters) => {
        const params = new URLSearchParams(filters);
        return fetchWrapper(`reports/expenses/?${params.toString()}`);
    },
    getCountries: () => fetchWrapper('countries/'),
};