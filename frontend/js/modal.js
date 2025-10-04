/**
 * modal.js
 * A reusable module for creating, showing, and hiding modal dialogs dynamically.
 */

const Modal = {
    show(title, bodyHtml, footerHtml) {
        const modalContainer = document.getElementById('modal-container');
        if (!modalContainer) {
            console.error('Modal container not found!');
            return;
        }

        const sanitizedTitle = typeof sanitizeHTML === 'function' ? sanitizeHTML(title) : title;

        const modalTemplate = `
            <div class="modal-backdrop show">
                <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
                    <div class="modal-header">
                        <h3 class="modal-title" id="modalTitle">${sanitizedTitle}</h3>
                        <button class="modal-close-btn" aria-label="Close modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        ${bodyHtml}
                    </div>
                    ${footerHtml ? `<div class="modal-footer">${footerHtml}</div>` : ''}
                </div>
            </div>
        `;

        modalContainer.innerHTML = modalTemplate;
        this.addEventListeners();
    },

    hide() {
        const modalContainer = document.getElementById('modal-container');
        if (modalContainer) {
            modalContainer.innerHTML = '';
        }
    },

    addEventListeners() {
        const backdrop = document.querySelector('.modal-backdrop');
        const closeBtn = document.querySelector('.modal-close-btn');

        if (closeBtn) closeBtn.addEventListener('click', () => this.hide());

        if (backdrop) {
            backdrop.addEventListener('click', (e) => {
                if (e.target === backdrop) this.hide();
            });
        }
    },

    /**
     * Shows a pre-styled confirmation modal.
     * @param {object} config - Configuration object.
     * @param {string} config.title - The title of the modal.
     * @param {string} config.message - The body text of the modal.
     * @param {string} [config.confirmText='Confirm'] - Text for the confirm button.
     * @param {string} [config.cancelText='Cancel'] - Text for the cancel button.
     * @param {string} [config.confirmButtonClass='btn-primary'] - CSS class for the confirm button.
     * @param {function} config.onConfirm - Callback function executed when confirm is clicked.
     */
    showConfirmation({ title, message, confirmText = 'Confirm', cancelText = 'Cancel', confirmButtonClass = 'btn-primary', onConfirm }) {
        const sanitizedMessage = typeof sanitizeHTML === 'function' ? sanitizeHTML(message) : message;
        const body = `<p>${sanitizedMessage}</p>`;
        const footer = `
            <button class="btn btn-secondary" id="modalCancelBtn">${cancelText}</button>
            <button class="btn ${confirmButtonClass}" id="modalConfirmBtn">${confirmText}</button>
        `;
        this.show(title, body, footer);

        document.getElementById('modalConfirmBtn').addEventListener('click', () => {
            if(typeof onConfirm === 'function') onConfirm();
            this.hide();
        });
        document.getElementById('modalCancelBtn').addEventListener('click', () => this.hide());
    }
};

