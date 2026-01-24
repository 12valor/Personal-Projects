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
const viewUserModal = document.getElementById('viewUserModal');
const addUserModal = document.getElementById('addUserModal');
const deleteUserModal = document.getElementById('deleteUserModal');

const addUserBtn = document.getElementById('addUserBtn');

let rowToDelete = null; // Store the table row to be deleted

// --- Modal Toggle Logic ---
if (addUserBtn) {
    addUserBtn.onclick = () => { addUserModal.style.display = 'flex'; };
}

// Get all close buttons (X icons and ALL cancel/close buttons)
const allCloseButtons = document.querySelectorAll('.close-modal, [data-close], .cancel-btn, #modal-close-btn');
allCloseButtons.forEach(btn => {
    btn.onclick = () => {
        if (viewUserModal) viewUserModal.style.display = 'none';
        if (addUserModal) addUserModal.style.display = 'none';
        if (deleteUserModal) deleteUserModal.style.display = 'none';
    };
});

// Close modals when clicking outside
window.onclick = (e) => {
    if (e.target === viewUserModal) viewUserModal.style.display = 'none';
    if (e.target === addUserModal) addUserModal.style.display = 'none';
    if (e.target === deleteUserModal) deleteUserModal.style.display = 'none';
};

// --- Table Actions (View/Delete) ---
const tableBody = document.getElementById('userTableBody');
if (tableBody) {
    tableBody.addEventListener('click', (e) => {
        const targetButton = e.target.closest('.action-btn');
        if (!targetButton) return;

        const row = targetButton.closest('tr');
        
        if (targetButton.classList.contains('btn-view')) {
            // View action
            // Check if elements exist before setting text
            const modalUsername = document.getElementById('modal-username');
            const modalEmail = document.getElementById('modal-email');
            const modalStatus = document.getElementById('modal-status');

            if (modalUsername) modalUsername.textContent = row.dataset.username;
            if (modalEmail) modalEmail.textContent = row.dataset.email;
            
            // This line was missing and is now fixed:
            if (modalStatus) modalStatus.innerHTML = row.querySelector('.status-badge').outerHTML;
            
            if (viewUserModal) viewUserModal.style.display = 'flex';
        } 
        else if (targetButton.classList.contains('btn-delete')) {
            // Delete action
            rowToDelete = row; // Store the row
            if (deleteUserModal) deleteUserModal.style.display = 'flex';
        }
    });
}

// Confirm deletion
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
if (confirmDeleteBtn) {
    confirmDeleteBtn.onclick = () => {
        if (rowToDelete) {
            rowToDelete.remove(); // Remove the stored row
            rowToDelete = null; // Clear the stored row
        }
        if (deleteUserModal) deleteUserModal.style.display = 'none';
    };
}

// --- Search Filter ---
const searchInput = document.getElementById('searchInput');
if (searchInput && tableBody) {
    searchInput.addEventListener('keyup', () => {
        const filter = searchInput.value.toLowerCase();
        const rows = tableBody.getElementsByTagName('tr');
        
        for (const row of rows) {
            // Check for data-attributes first
            const username = row.dataset.username ? row.dataset.username.toLowerCase() : '';
            const email = row.dataset.email ? row.dataset.email.toLowerCase() : '';
            const status = row.dataset.status ? row.dataset.status.toLowerCase() : '';
            
            if (username.includes(filter) || email.includes(filter) || status.includes(filter)) {
                row.style.display = ''; // Show row
            } else {
                row.style.display = 'none'; // Hide row
            }
        }
    });
}

