export const Notification = {
    /**
     * Displays a toast notification.
     * @param {string} message - The message to display.
     * @param {string} type - The type of toast ('success', 'error', 'info').
     * @param {number} duration - The duration in milliseconds.
     */
    showToast(message, type = 'info', duration = 4000) {
        const container = document.getElementById('toast-container');
        if (!container) {
            console.error('Toast container not found in the DOM.');
            return;
        }

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icons = {
            success: '✓',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        toast.innerHTML = `
            <div class="toast-icon">${icons[type] || 'ℹ️'}</div>
            <div class="toast-content">
                <p class="toast-message">${message}</p>
            </div>
            <button class="toast-close">&times;</button>
        `;
        
        container.appendChild(toast);

        const timer = setTimeout(() => this.removeToast(toast), duration);
        
        toast.querySelector('.toast-close').addEventListener('click', () => {
            clearTimeout(timer);
            this.removeToast(toast);
        });
    },

    /**
     * Removes a toast element from the DOM with a fade-out animation.
     * @param {HTMLElement} toast - The toast element to remove.
     */
    removeToast(toast) {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300); // Match CSS transition duration
    }
};