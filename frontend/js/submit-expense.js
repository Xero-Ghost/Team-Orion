import { Auth } from './auth.js';
import { Api } from './api.js';
import { Notification } from './notification.js';
import { Utils } from './utils.js';
// Add other necessary imports like CurrencyConverter, debounce, etc.

document.addEventListener('DOMContentLoaded', () => {
    Auth.checkAuthState(); // This will now work correctly

    const expenseForm = document.getElementById('expenseForm');
    
    // ... (the rest of your file's logic remains the same)

    expenseForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('submitExpenseBtn');
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;

        try {
            const formData = new FormData(expenseForm);
            // The backend's perform_create method assigns the user automatically
            await Api.submitExpense(formData);
            Notification.showToast('Expense submitted successfully!', 'success');
            expenseForm.reset();
            // Clear file previews if you have that logic
            document.getElementById('file-preview-container').innerHTML = '';
        } catch (error) {
            Notification.showToast('Failed to submit expense.', 'error');
        } finally {
            submitBtn.textContent = 'Submit Expense';
            submitBtn.disabled = false;
        }
    });
});