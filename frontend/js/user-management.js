document.addEventListener('DOMContentLoaded', () => {

    const userTableBody = document.getElementById('userTableBody');
    const addUserBtn = document.getElementById('addUserBtn');

    // --- RENDER USERS ---
    const renderUsers = async () => {
        if (!userTableBody) return;
        
        userTableBody.innerHTML = '<tr><td colspan="7" class="table-loading">Loading users...</td></tr>';
        
        const response = await Api.getUsers(); // Using mock API

        if (response && response.length) {
            userTableBody.innerHTML = '';
            response.forEach(user => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${Utils.escapeHTML(user.name)}</td>
                    <td><span class="role-badge ${user.role.toLowerCase()}">${Utils.escapeHTML(user.role)}</span></td>
                    <td>${Utils.escapeHTML(user.manager || 'N/A')}</td>
                    <td>${Utils.escapeHTML(user.email)}</td>
                    <td>${Utils.escapeHTML(user.department || 'N/A')}</td>
                    <td>$${user.expenseUsed.toFixed(2)}</td>
                    <td class="action-buttons">
                        <button class="action-btn edit" title="Edit">✏️</button>
                        <button class="action-btn delete" title="Delete">🗑️</button>
                        <button class="action-btn" title="Send Password Reset">🔑</button>
                    </td>
                `;
                userTableBody.appendChild(tr);
            });
        } else {
            userTableBody.innerHTML = '<tr><td colspan="7" class="table-empty">No users found.</td></tr>';
        }
    };

    // --- EVENT LISTENERS ---
    if (addUserBtn) {
        addUserBtn.addEventListener('click', () => {
            const modalContent = `
                <form id="addUserForm">
                    <div class="form-group">
                        <label for="userName">User Name</label>
                        <input type="text" id="userName" required>
                    </div>
                    <div class="form-group">
                        <label for="userEmail">Email</label>
                        <input type="email" id="userEmail" required>
                    </div>
                    <div class="form-group">
                        <label for="userRole">Role</label>
                        <select id="userRole" required>
                            <option value="Employee">Employee</option>
                            <option value="Manager">Manager</option>
                        </select>
                    </div>
                </form>
            `;
            Modal.show('Add New User', modalContent, () => {
                console.log('"Add User" logic would run here.');
                Notification.show('User added successfully!', 'success');
                Modal.hide();
            }, 'Add User');
        });
    }

    // --- INITIALIZE ---
    renderUsers();
});
