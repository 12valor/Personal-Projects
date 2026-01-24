// --- Populate form on load if edit data exists ---
document.addEventListener('DOMContentLoaded', () => {
    const editDataJSON = localStorage.getItem('editItemData');
    
    if (editDataJSON) {
        const data = JSON.parse(editDataJSON);
        
        // Populate the form fields
        document.getElementById('itemName').value = data.item || '';
        document.getElementById('description').value = data.description || '';
        document.getElementById('location').value = data.location || '';
        document.getElementById('date').value = data.date || '';
        document.getElementById('time').value = data.time || '';
        
        // Check if category exists and set it
        const categorySelect = document.getElementById('category-select');
        if (data.category && categorySelect) {
            categorySelect.value = data.category;
        }

        // Handle the Lost/Found status toggle
        const lostButton = document.getElementById('lostItemBtn');
        const foundButton = document.getElementById('foundItemBtn');
        
        if (data.status === 'Found') {
            foundButton.classList.add('active');
            lostButton.classList.remove('active');
            window.currentStatus = 'Found'; // Update global status
        } else {
            lostButton.classList.add('active');
            foundButton.classList.remove('active');
            window.currentStatus = 'Lost'; // Update global status
        }
        
        // Handle the image preview
        const photoUploader = document.getElementById('photo-uploader');
        if (data.image && photoUploader) {
            uploadedImageSrc = data.image; // Set the global var
            photoUploader.innerHTML = ''; // Clear the uploader
            const img = document.createElement('img');
            img.src = uploadedImageSrc;
            photoUploader.appendChild(img);
        }

        // Clear the data from localStorage so it doesn't load again
        localStorage.removeItem('editItemData');
    }
});


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

// --- Status Toggle ---
const lostBtn = document.getElementById('lostItemBtn');
const foundBtn = document.getElementById('foundItemBtn');
let currentStatus = 'Lost'; // Default status

if(lostBtn && foundBtn) {
    lostBtn.addEventListener('click', () => {
        lostBtn.classList.add('active');
        foundBtn.classList.remove('active');
        currentStatus = 'Lost';
    });

    foundBtn.addEventListener('click', () => {
        foundBtn.classList.add('active');
        lostBtn.classList.remove('active');
        currentStatus = 'Found';
    });
}

// --- Photo Uploader ---
const photoUploader = document.getElementById('photo-uploader');
const photoInput = document.getElementById('photo-input');
const summaryImage = document.getElementById('summary-image');
let uploadedImageSrc = '';

if (photoUploader && photoInput) {
    photoUploader.addEventListener('click', () => {
        photoInput.click();
    });

    photoInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                uploadedImageSrc = e.target.result;
                photoUploader.innerHTML = ''; // Clear the uploader
                const img = document.createElement('img');
                img.src = uploadedImageSrc;
                photoUploader.appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    });
}


// --- Modal elements ---
const confirmationModal = document.getElementById('confirmationMessageModal');
const confirmReportBtn = document.getElementById('confirmReportBtn');
const cancelReportBtn = document.getElementById('cancelReportBtn');
const successModal = document.getElementById('successModal');
const successOkBtn = document.getElementById('successOkBtn');
const successTitle = document.getElementById('success-title');
const successMessage = document.getElementById('success-message');

const publishModal = document.getElementById('publishModal');
const publishForm = document.getElementById('publishForm');
const publishButton = document.getElementById('publishPost');
const publishConfirmBtn = document.getElementById('publishConfirmBtn');
const publishCancelBtn = document.getElementById('publishCancelBtn');

const reportForm = document.getElementById('reportForm');

// --- Report Form Submission ---
if (reportForm) {
    reportForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Populate modal
      document.getElementById('summary-status').textContent = currentStatus;
      document.getElementById('summary-category').textContent = document.getElementById('category-select').value;
      document.getElementById('summary-itemName').textContent = document.getElementById('itemName').value;
      document.getElementById('summary-location').textContent = document.getElementById('location').value;
      document.getElementById('summary-date').textContent = document.getElementById('date').value;
      document.getElementById('summary-time').textContent = document.getElementById('time').value;
      document.getElementById('summary-description').textContent = document.getElementById('description').value;
      
      if (uploadedImageSrc) {
          summaryImage.src = uploadedImageSrc;
      } else {
          summaryImage.src = 'https://placehold.co/100x100/f0f0f0/ccc?text=No+Image';
      }
      
      // Show confirmation modal
      confirmationModal.style.display = 'flex';
    });
}

if (confirmReportBtn) {
    confirmReportBtn.onclick = () => {
      const data = {
        item: document.getElementById('itemName').value.trim(),
        description: document.getElementById('description').value.trim(),
        location: document.getElementById('location').value.trim(),
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
      };
      addReportToTable(data, currentStatus);
      
      confirmationModal.style.display = 'none';
      showSuccessModal('Report Submitted', 'Your report has been submitted for review.');
      
      // Reset form
      reportForm.reset();
      lostBtn.classList.add('active');
      foundBtn.classList.remove('active');
      currentStatus = 'Lost';
      photoUploader.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg><span>Add Photo</span>';
      uploadedImageSrc = '';
      if(summaryImage) summaryImage.src = 'https://placehold.co/100x100/f0f0f0/ccc?text=No+Image';
    };
}

if (cancelReportBtn) {
    cancelReportBtn.onclick = () => {
      confirmationModal.style.display = 'none';
    };
}

// --- Publish Modal ---
let publishStatus = 'Lost';
const publishLostBtn = document.getElementById('publishLostBtn');
const publishFoundBtn = document.getElementById('publishFoundBtn');

if (publishLostBtn && publishFoundBtn) {
    publishLostBtn.addEventListener('click', () => {
        publishLostBtn.classList.add('active');
        publishFoundBtn.classList.remove('active');
        publishStatus = 'Lost';
    });

    publishFoundBtn.addEventListener('click', () => {
        publishFoundBtn.classList.add('active');
        publishLostBtn.classList.remove('active');
        publishStatus = 'Found';
    });
}

// Photo uploader for publish modal
const publishPhotoUploader = document.getElementById('publish-photo-uploader');
const publishPhotoInput = document.getElementById('publish-photo-input');
let publishImageSrc = '';

if (publishPhotoUploader && publishPhotoInput) {
    publishPhotoUploader.addEventListener('click', () => {
        publishPhotoInput.click();
    });

    publishPhotoInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                publishImageSrc = e.target.result;
                publishPhotoUploader.innerHTML = ''; // Clear the uploader
                const img = document.createElement('img');
                img.src = publishImageSrc;
                publishPhotoUploader.appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    });
}

// Open publish modal
if (publishButton) {
    publishButton.addEventListener('click', () => {
        // This is the new behavior: just show success modal
        showSuccessModal('Post Published', 'Your item has been successfully published.');
        // The old code to open the publish modal is now removed.
    });
}

// Handle publish form submission (This logic is no longer used by the button, but is safe to keep)
if (publishForm) {
    publishForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = {
            item: document.getElementById('publishItemName').value.trim(),
            description: document.getElementById('publishDescription').value.trim(),
            location: document.getElementById('publishLocation').value.trim(),
            date: document.getElementById('publishDate').value,
            time: document.getElementById('publishTime').value,
        };
        addReportToTable(data, publishStatus);
        
        publishModal.style.display = 'none';
        showSuccessModal('Post Published', 'Your item has been successfully published.');
    });
}

if (publishCancelBtn) {
    publishCancelBtn.onclick = () => {
      publishModal.style.display = 'none';
    };
}

// --- Success Modal ---
function showSuccessModal(title, message) {
    if(successTitle) successTitle.textContent = title;
    if(successMessage) successMessage.textContent = message;
    if(successModal) successModal.style.display = 'flex';
}

if (successOkBtn) {
    successOkBtn.onclick = () => {
        successModal.style.display = 'none';
    };
}

// --- Close Modals ---
window.onclick = (e) => {
  if (e.target === confirmationModal) {
    confirmationModal.style.display = 'none';
  }
  if (e.target === publishModal) {
    publishModal.style.display = 'none';
  }
   if (e.target === successModal) {
    successModal.style.display = 'none';
  }
};

// --- Table Management ---
function addReportToTable(data, status) {
  const tbody = document.getElementById('reportsTableBody');
  if (!tbody) return; // Exit if table not on page
  
  const tr = document.createElement('tr');

  tr.setAttribute('data-request', JSON.stringify({
    item: data.item,
    status: status,
    description: data.description,
    location: data.location,
    date: data.date,
    time: data.time
  }));

  tr.innerHTML = `
    <td>${data.item}</td>
    <td>${status}</td>
    <td>
      <button class="view-request-btn">View</button>
      <button class="delete-request-btn" style="margin-left:5px;">Delete</button>
    </td>
  `;
  tbody.appendChild(tr);
}

// Event delegation for report table
const tableBody = document.getElementById('reportsTableBody');
if (tableBody) {
    tableBody.addEventListener('click', (e) => {
      if (e.target.classList.contains('view-request-btn')) {
        const tr = e.target.closest('tr');
        const data = JSON.parse(tr.getAttribute('data-request'));
        alert(`Viewing report:\nItem: ${data.item}\nDescription: ${data.description}\nStatus: ${data.status}`);
      } else if (e.target.classList.contains('delete-request-btn')) {
        e.target.closest('tr').remove();
      }
    });
}

// --- Demo Data ---
// Check if the table body exists before adding demo data
if(tableBody) {
    addReportToTable({item: 'Lost Wallet', description: 'Black leather wallet', location: 'Canteen', date: '2025-10-20', time: '12:30'}, 'Pending');
    addReportToTable({item: 'Missing Dog', description: 'Brown Labrador', location: 'Field', date: '2025-10-19', time: '08:00'}, 'Pending');
}