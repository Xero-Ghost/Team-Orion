/**
 * settings.js
 * Handles the logic for the settings.html page.
 */

document.addEventListener('DOMContentLoaded', () => {
    // This function checks if the user is logged in and redirects if not.
    Auth.checkAuthState();

    // Get the currently logged-in user's data from our Auth module
    const currentUser = Auth.getCurrentUser();

    // --- Get references to all the HTML elements we need to work with ---
    const settingsTabs = document.getElementById('settingsTabs');
    const companySettingsTab = document.getElementById('companySettingsTab');

    const profileContent = document.getElementById('profile-content');
    const securityContent = document.getElementById('security-content');
    const preferencesContent = document.getElementById('preferences-content');
    const companyContent = document.getElementById('company-content');

    const profileForm = document.getElementById('profileForm');
    const passwordForm = document.getElementById('passwordForm');

    // --- Tab Handling Logic ---
    // This adds a single event listener to the parent container of the tabs.
    settingsTabs.addEventListener('click', (e) => {
        // Ignore clicks that are not on a button
        if (e.target.tagName !== 'BUTTON') return;

        // Deactivate the currently active tab and hide its content
        const currentActiveTab = settingsTabs.querySelector('.active');
        if (currentActiveTab) {
            currentActiveTab.classList.remove('active');
            const currentContent = document.getElementById(`${currentActiveTab.dataset.tab}-content`);
            if (currentContent) {
                currentContent.classList.add('hidden');
                currentContent.classList.remove('active');
            }
        }

        // Find the currently active content pane and hide it
        const currentActiveContent = document.querySelector('.tab-content.active');
        if(currentActiveContent){
            currentActiveContent.classList.add('hidden');
            currentActiveContent.classList.remove('active');
        }


        // Activate the new tab and show its content
        e.target.classList.add('active');
        const tabName = e.target.dataset.tab;
        const newContent = document.getElementById(`${tabName}-content`);
        if (newContent) {
            newContent.classList.remove('hidden');
            newContent.classList.add('active');
        }
    });

    // --- Role-based UI Logic ---
    // This function checks the user's role and shows/hides UI elements accordingly.
    function setupRoleUI() {
        if (currentUser && currentUser.role === 'admin') {
            companySettingsTab.classList.remove('hidden');
        }
    }

    // --- Data Loading & Form Population ---
    // This function fills the profile form with the user's data.
    function populateProfileForm() {
        if (!currentUser) return;
        profileForm.elements.fullName.value = currentUser.name || '';
        profileForm.elements.email.value = currentUser.email || '';
        profileForm.elements.phone.value = currentUser.phone || '';
        profileForm.elements.department.value = currentUser.department || '';
    }

    // --- Form Submission Handlers ---
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // In a real application, you would gather the form data and call:
        // const updatedUser = await Api.updateUserProfile({ ... });
        // For our test, we just show a success message.
        Notification.showToast('Profile updated successfully!', 'success');
    });

    passwordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newPassword = passwordForm.elements.newPassword.value;
        const confirmPassword = passwordForm.elements.confirmNewPassword.value;

        // Basic validation
        if (newPassword !== confirmPassword) {
            Notification.showToast('New passwords do not match.', 'error');
            return;
        }

        // In a real app, you would call Api.changePassword here
        Notification.showToast('Password changed successfully!', 'success');
        passwordForm.reset();
    });

    // --- Initial Page Load ---
    // We only run the setup functions if a user is actually logged in.
    if (currentUser) {
        setupRoleUI();
        populateProfileForm();
    }
});