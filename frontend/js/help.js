/**
 * help.js
 * Handles logic for the help.html page, including the FAQ accordion.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Ensure user is authenticated before showing the page
    Auth.checkAuthState();

    const currentUser = Auth.getCurrentUser();
    const faqAccordion = document.getElementById('faqAccordion');
    const managerFaqSection = document.getElementById('manager-faq');
    const adminFaqSection = document.getElementById('admin-faq');

    // --- Accordion Logic ---
    // This allows only one FAQ item to be open at a time.
    if (faqAccordion) {
        const allDetails = faqAccordion.querySelectorAll('details');
        allDetails.forEach(details => {
            details.addEventListener('toggle', (event) => {
                if (details.open) {
                    allDetails.forEach(d => {
                        if (d !== details) {
                            d.open = false;
                        }
                    });
                }
            });
        });
    }

    // --- Role-based UI ---
    // Show/hide FAQ sections based on the user's role.
    function setupRoleBasedFAQs() {
        if (!currentUser) return;

        // Managers and Admins can see the Manager FAQs
        if (currentUser.role === 'manager' || currentUser.role === 'admin') {
            if (managerFaqSection) managerFaqSection.classList.remove('hidden');
        }

        // Only Admins can see the Admin FAQs
        if (currentUser.role === 'admin') {
            if (adminFaqSection) adminFaqSection.classList.remove('hidden');
        }
    }

    // --- Initial Load ---
    setupRoleBasedFAQs();
});
