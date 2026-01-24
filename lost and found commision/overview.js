// Wait for the DOM to be fully loaded before running any script
document.addEventListener('DOMContentLoaded', () => {

    // --- Sidebar Toggle ---
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.getElementById('sidebar');

    if (hamburger && sidebar) {
        hamburger.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            const expanded = hamburger.getAttribute('aria-expanded') === 'true' || false;
            hamburger.setAttribute('aria-expanded', String(!expanded));
            sidebar.setAttribute('aria-hidden', String(!sidebar.classList.contains('open')));
        });

        hamburger.addEventListener('keydown', (e) => {
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                hamburger.click();
            }
        });
    }

    // --- Modal Elements ---
    const viewDetailsModal = document.getElementById('viewDetailsModal');
    const deleteModal = document.getElementById('deleteConfirmationModal');
    let itemToHandle = null; // Store the notification card element

    // --- Modal Close Logic ---
    const allCloseButtons = document.querySelectorAll('[data-close]');
    allCloseButtons.forEach(btn => {
        btn.onclick = () => {
            if (viewDetailsModal) viewDetailsModal.style.display = 'none';
            if (deleteModal) deleteModal.style.display = 'none';
        };
    });

    // Close modals by clicking outside
    window.onclick = (event) => {
        if (event.target == viewDetailsModal) {
            viewDetailsModal.style.display = "none";
        }
        if (event.target == deleteModal) {
            deleteModal.style.display = "none";
        }
    };

    // --- Button Logic (Event Delegation) ---
    const mainContent = document.querySelector('.main');
    if (mainContent) {
        mainContent.addEventListener('click', (e) => {
            const targetButton = e.target.closest('.notification-btn');
            if (!targetButton) return; // Exit if not a button

            const notificationCard = e.target.closest('.notification');
            if (!notificationCard) return; // Exit if not in a card

            // --- Edit Button ---
            if (targetButton.classList.contains('btn-edit')) {
                const itemData = {
                    status: notificationCard.dataset.status,
                    item: notificationCard.dataset.item,
                    category: notificationCard.dataset.category,
                    description: notificationCard.dataset.description,
                    location: notificationCard.dataset.location,
                    date: notificationCard.dataset.date,
                    time: notificationCard.dataset.time,
                    image: notificationCard.dataset.image
                };
                
                localStorage.setItem('editItemData', JSON.stringify(itemData));
                window.location.href = 'post-item.html';
            }

            // --- View Button ---
            if (targetButton.classList.contains('btn-view')) {
                // Populate view modal
                document.getElementById('modal-image').src = notificationCard.dataset.image || 'https://placehold.co/200x200/f0f0f0/ccc?text=No+Image';
                document.getElementById('modal-status').textContent = notificationCard.dataset.status || 'N/A';
                document.getElementById('modal-item').textContent = notificationCard.dataset.item || 'N/A';
                document.getElementById('modal-category').textContent = notificationCard.dataset.category || 'N/A';
                document.getElementById('modal-location').textContent = notificationCard.dataset.location || 'N/A';
                document.getElementById('modal-date').textContent = notificationCard.dataset.date || 'N/A';
                document.getElementById('modal-time').textContent = notificationCard.dataset.time || 'N/A';
                document.getElementById('modal-description').textContent = notificationCard.dataset.description || 'N/A';
                
                if (viewDetailsModal) viewDetailsModal.style.display = 'flex';
            }

            // --- Delete/Remove Button ---
            if (targetButton.classList.contains('delete-btn')) {
                itemToHandle = notificationCard; // Store the card to be deleted
                if (deleteModal) deleteModal.style.display = 'flex';
            }
        });
    }

    // --- Confirm Deletion ---
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.onclick = () => {
            if (itemToHandle) {
                itemToHandle.remove(); // Remove the stored card
                itemToHandle = null; // Clear the stored card
            }
            if (deleteModal) deleteModal.style.display = 'none';
        };
    }

});