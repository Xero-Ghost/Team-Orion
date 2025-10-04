import { Utils } from './utils.js'; // Assuming you have a utils.js for sanitizeHTML

export const Modal = {
    show(title, bodyHtml, footerHtml) {
        const modalContainer = document.getElementById('modal-container');
        if (!modalContainer) {
            console.error('Modal container not found!');
            return;
        }

        const sanitizedTitle = Utils.escapeHTML(title);

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
     */
    showConfirmation({ title, message, confirmText = 'Confirm', cancelText = 'Cancel', confirmButtonClass = 'btn-primary', onConfirm }) {
        const sanitizedMessage = Utils.escapeHTML(message);
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