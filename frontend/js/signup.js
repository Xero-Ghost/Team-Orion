import { Api } from './api.js';
import { Auth } from './auth.js';
import { Validation } from './validation.js';
import { Notification } from './notification.js';

document.addEventListener('DOMContentLoaded', () => {
    Auth.checkAuthState();

    const signupForm = document.getElementById('signupForm');
    const countrySelect = document.getElementById('country');
    const currencyInput = document.getElementById('currency');
    const passwordInput = document.getElementById('password');

    // --- THIS IS THE MISSING LOGIC ---
    async function populateCountries() {
        if (!countrySelect) return;
        try {
            const countries = await Api.getCountries();
            countries.forEach(country => {
                const option = document.createElement('option');
                option.value = country.code;
                option.textContent = country.name;
                // Store the currency code in a data attribute
                option.dataset.currency = country.currency;
                countrySelect.appendChild(option);
            });
        } catch (error) {
            console.error("Failed to load countries:", error);
            Notification.showToast('Could not load country data.', 'error');
        }
    }

    // Event listener to update currency when country changes
    countrySelect?.addEventListener('change', () => {
        const selectedOption = countrySelect.options[countrySelect.selectedIndex];
        if (currencyInput && selectedOption) {
            currencyInput.value = selectedOption.dataset.currency || '';
        }
    });
    
    // --- End of missing logic ---

    signupForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        // ... (rest of your form submission logic remains the same)
    });
    
    // Initial call to populate the dropdown when the page loads
    populateCountries();
});