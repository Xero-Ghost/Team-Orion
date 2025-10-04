import { Api } from './api.js';
import { Auth } from './auth.js';
import { Notification } from './notification.js';

document.addEventListener('DOMContentLoaded', () => {
    Auth.checkAuthState();
    const signupForm = document.getElementById('signupForm');
    
    // Logic to populate country dropdown
    async function populateCountries() {
        const countrySelect = document.getElementById('country');
        if (!countrySelect) return;
        try {
            const countries = await Api.getCountries();
            countries.forEach(country => {
                const option = document.createElement('option');
                option.value = country.code;
                option.textContent = country.name;
                countrySelect.appendChild(option);
            });
        } catch (error) {
            console.error("Failed to load countries:", error);
        }
    }
    
    populateCountries();

    signupForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.disabled = true;

        const formData = new FormData(signupForm);
        const data = Object.fromEntries(formData.entries());
        
        // Match backend serializer fields
        const signupData = {
            email: data.email,
            password: data.password,
            first_name: data.fullName,
            role: 'employee', // Default role on signup
        };
        
        try {
            await Api.signup(signupData);
            Notification.showToast('Account created! Redirecting to login...', 'success');
            setTimeout(() => window.location.href = '/login.html', 2000);
        } catch (error) {
            Notification.showToast('Signup failed. Please try again.', 'error');
            submitBtn.disabled = false;
        }
    });
});