/**
 * submit-expense.js
 * Handles the logic for the submit-expense.html page, including currency
 * conversion previews, file uploads, and form submission.
 */
document.addEventListener('DOMContentLoaded', () => {
    // This file no longer needs App.init(). It's handled by app.js
    Auth.checkAuthState(); // Ensure user is logged in

    const expenseForm = document.getElementById('expenseForm');
    const currencySelect = document.getElementById('currency');
    const convertedAmountInput = document.getElementById('convertedAmount');
    const amountInput = document.getElementById('amount');
    const fileInput = document.getElementById('receipts');
    const fileUploadArea = document.querySelector('.file-upload-area');
    const filePreviewContainer = document.getElementById('file-preview-container');

    // --- Currency Conversion Logic ---
    async function updateConvertedAmount() {
        if (!amountInput || !currencySelect || !convertedAmountInput) return;

        const amount = parseFloat(amountInput.value);
        const fromCurrency = currencySelect.value;
        const user = Auth.getCurrentUser();
        // Fallback to USD if company currency isn't set
        const toCurrency = user?.company?.currency || 'USD';

        convertedAmountInput.placeholder = `Auto-calculated (${toCurrency})`;

        if (amount > 0 && fromCurrency && toCurrency && fromCurrency !== toCurrency) {
            convertedAmountInput.value = "Calculating...";
            const converted = await CurrencyConverter.convert(amount, fromCurrency, toCurrency);
            convertedAmountInput.value = converted !== null ? `${converted.toFixed(2)}` : 'Conversion failed';
        } else {
            convertedAmountInput.value = '';
        }
    }

    if (amountInput) amountInput.addEventListener('input', debounce(updateConvertedAmount, 300));
    if (currencySelect) currencySelect.addEventListener('change', updateConvertedAmount);

    // --- File Upload Logic ---
    function handleFiles(files) {
        if (!filePreviewContainer) return;
        filePreviewContainer.innerHTML = ''; // Clear previous previews

        for (const file of files) {
            const filePreview = document.createElement('div');
            filePreview.className = 'file-preview';
            filePreview.textContent = `${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
            filePreviewContainer.appendChild(filePreview);
        }
    }

    if (fileUploadArea && fileInput) {
        fileUploadArea.addEventListener('click', () => fileInput.click());
        fileUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileUploadArea.classList.add('dragover');
        });
        fileUploadArea.addEventListener('dragleave', () => fileUploadArea.classList.remove('dragover'));
        fileUploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            fileUploadArea.classList.remove('dragover');
            fileInput.files = e.dataTransfer.files;
            handleFiles(e.dataTransfer.files);
        });
    }
    if (fileInput) fileInput.addEventListener('change', () => handleFiles(fileInput.files));

    // --- Form Submission ---
    if (expenseForm) {
        expenseForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('submitExpenseBtn');
            if (submitBtn.classList.contains('loading')) return;

            submitBtn.textContent = 'Submitting...';
            submitBtn.classList.add('loading');

            // In a real app, you would use FormData to handle file uploads
            const formData = new FormData(expenseForm);
            const expenseData = Object.fromEntries(formData.entries());

            const user = Auth.getCurrentUser();
            expenseData.userId = user.id;

            try {
                const result = await Api.submitExpense(expenseData);
                if (result.success) {
                    Notification.showToast('Expense submitted successfully!', 'success');
                    expenseForm.reset();
                    if (filePreviewContainer) filePreviewContainer.innerHTML = '';
                } else {
                    Notification.showToast(result.message || 'Failed to submit expense.', 'error');
                }
            } catch (error) {
                Notification.showToast('An error occurred while submitting.', 'error');
            } finally {
                submitBtn.textContent = 'Submit Expense';
                submitBtn.classList.remove('loading');
            }
        });
    }
});