import { Api } from './api.js';
import { Auth } from './auth.js';
import { Utils } from './utils.js';
import { Modal } from './modal.js';
import { Notification } from './notification.js';

document.addEventListener('DOMContentLoaded', () => {
    Auth.checkAuthState();

    const userTableBody = document.getElementById('userTableBody');
    const addUserBtn = document.getElementById('addUserBtn');

    const renderUsers = async () => {
        if (!userTableBody) return;
        
        userTableBody.innerHTML = '<tr><td colspan="6" class="table-loading">Loading users...</td></tr>';
        
        try {
            // This call will now work correctly
            const users = await Api.getAllUsers();

            userTableBody.innerHTML = '';
            if (users && users.length) {
                users.forEach(user => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${Utils.escapeHTML(user.first_name)}</td>
                        <td><span class="role-badge ${user.role.toLowerCase()}">${Utils.escapeHTML(user.role)}</span></td>
                        <td>${Utils.escapeHTML(user.email)}</td>
                        <td><span class="${user.is_active ? 'text-success' : 'text-danger'}">${user.is_active ? 'Active' : 'Inactive'}</span></td>
                        <td class="action-buttons">
                            <button class="action-btn edit" title="Edit">✏️</button>
                            <button class="action-btn delete" title="Delete">🗑️</button>
                        </td>
                    `;
                    userTableBody.appendChild(tr);
                });
            } else {
                userTableBody.innerHTML = '<tr><td colspan="6" class="table-empty">No users found.</td></tr>';
            }
        } catch (error) {
            userTableBody.innerHTML = '<tr><td colspan="6" class="table-empty text-danger">Failed to load users.</td></tr>';
            Notification.showToast('Could not load user data.', 'error');
        }
    };

    // Add event listeners for modals, etc. here

    renderUsers();
});