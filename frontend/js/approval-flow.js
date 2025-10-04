/**
 * approval-flow.js
 * Handles the logic for the approval-flow.html page, making the
 * rule builder interface interactive.
 */
document.addEventListener('DOMContentLoaded', () => {
    // App.init() is removed as it's now handled by app.js
    Auth.checkAuthState(); // Ensure user is logged in

    const approvalTypeSelect = document.getElementById('approvalType');
    const sequentialConfig = document.getElementById('sequentialConfig');
    const addApproverBtn = document.getElementById('addApproverBtn');
    const approverList = document.getElementById('approverList');
    const approvalRuleForm = document.getElementById('approvalRuleForm');

    // --- Logic to show/hide config sections based on selection ---
    function handleApprovalTypeChange() {
        // Hide all config sections first
        document.querySelectorAll('.config-section').forEach(section => {
            section.style.display = 'none';
        });

        // Show the relevant section
        const selectedType = approvalTypeSelect.value;
        if (selectedType === 'sequential') {
            if (sequentialConfig) sequentialConfig.style.display = 'block';
        }
        // Add else-if blocks for other types ('conditional', 'specific', etc.) here
    }

    if (approvalTypeSelect) {
        approvalTypeSelect.addEventListener('change', handleApprovalTypeChange);
        // Initial call to set the correct view
        handleApprovalTypeChange();
    }

    // --- Logic for adding a new approver step ---
    if (addApproverBtn && approverList) {
        addApproverBtn.addEventListener('click', () => {
            const stepCount = approverList.children.length + 1;
            const newStep = document.createElement('li');
            newStep.className = 'approver-item';

            // In a real app, this would be a more complex component with a dropdown of users
            newStep.innerHTML = `
                <span class="drag-handle">☰</span>
                <span>${stepCount}. New Approver Step</span>
                <button type="button" class="btn btn-sm btn-danger-outline">Remove</button>
            `;

            newStep.querySelector('button').addEventListener('click', () => newStep.remove());

            approverList.appendChild(newStep);
        });
    }

    // Add event listeners to existing remove buttons
    document.querySelectorAll('.approver-list .btn-danger-outline').forEach(button => {
        button.addEventListener('click', (e) => {
            e.target.closest('.approver-item').remove();
        });
    });


    // --- Form Submission ---
    if (approvalRuleForm) {
        approvalRuleForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const saveBtn = approvalRuleForm.querySelector('button[type="submit"]');
            if (saveBtn.classList.contains('loading')) return;

            saveBtn.textContent = 'Saving...';
            saveBtn.classList.add('loading');

            // Mock API call
            try {
                const result = await Api.saveApprovalRule({}); // Pass real form data here
                if (result.success) {
                    Notification.showToast('Approval rule saved successfully!', 'success');
                } else {
                    Notification.showToast(result.message || 'Failed to save rule.', 'error');
                }
            } catch (error) {
                Notification.showToast('An error occurred.', 'error');
            } finally {
                saveBtn.textContent = 'Save Rule';
                saveBtn.classList.remove('loading');
            }
        });
    }
});