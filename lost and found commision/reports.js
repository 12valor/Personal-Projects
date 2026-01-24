// ===========================================
// Sidebar Toggle for Mobile Navigation
// ===========================================

// Get hamburger and sidebar elements
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');

// Toggle sidebar visibility when hamburger is clicked
hamburger.addEventListener('click', () => {
  sidebar.classList.toggle('open');

  // Update accessibility attributes
  const expanded = hamburger.getAttribute('aria-expanded') === 'true' || false;
  hamburger.setAttribute('aria-expanded', String(!expanded));
  sidebar.setAttribute('aria-hidden', String(!sidebar.classList.contains('open')));
});

// Allow keyboard access (Space or Enter key) to toggle sidebar
hamburger.addEventListener('keydown', (e) => {
  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault();
    hamburger.click();
  }
});

// ===========================================
// Item Filtering and Sorting Functionality
// ===========================================

// Select relevant DOM elements
const tabButtons = document.querySelectorAll('.tab-buttons button');
const sortButtons = document.querySelectorAll('.sorting-btn');
const itemsContainer = document.getElementById('itemsContainer');
const items = Array.from(itemsContainer.children);

// Track current tab and sort criteria
let currentTab = 'all';
let currentSort = 'default';

// ===========================================
// Filter Items by Tab Selection
// ===========================================

// Add event listeners to each tab button
tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove active state from all, then activate selected one
    tabButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Update current tab and filter items accordingly
    currentTab = btn.getAttribute('data-tab');
    filterItems();
  });
});

// ===========================================
// Sort Items by Selected Criterion
// ===========================================

// Add event listeners to sorting buttons
sortButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove active state from all, then activate selected one
    sortButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Update current sort and re-sort items
    currentSort = btn.getAttribute('data-sort');
    sortItems();
  });
});

// ===========================================
// Function: Filter Items
// ===========================================

function filterItems() {
  // Show or hide items based on selected tab
  items.forEach(item => {
    const category = item.getAttribute('data-category');
    if (currentTab === 'all' || category === currentTab) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });

  // Apply sorting after filtering
  sortItems();
}

// ===========================================
// Function: Sort Items
// ===========================================

function sortItems() {
  // Get only visible (filtered) items
  let sortableItems = Array.from(itemsContainer.children).filter(item => item.style.display !== 'none');

  // Sort by name
  if (currentSort === 'name') {
    sortableItems.sort((a, b) => {
      const nameA = a.getAttribute('data-name').toLowerCase();
      const nameB = b.getAttribute('data-name').toLowerCase();
      return nameA.localeCompare(nameB);
    });
  }

  // Sort by category
  else if (currentSort === 'category') {
    sortableItems.sort((a, b) => {
      const catA = a.getAttribute('data-category');
      const catB = b.getAttribute('data-category');
      return catA.localeCompare(catB);
    });
  }

  // Sort by date (assumes ISO format YYYY-MM-DD)
  else if (currentSort === 'date') {
    sortableItems.sort((a, b) => {
      const dateA = a.getAttribute('data-date');
      const dateB = b.getAttribute('data-date');
      return new Date(dateA) - new Date(dateB);
    });
  }

  // Default: keep original order (no sorting)
  else {
    // Do nothing
  }

  // Re-append sorted items in new order
  sortableItems.forEach(item => {
    itemsContainer.appendChild(item);
  });
}

// ===========================================
// Initialize display on page load
// ===========================================
window.onload = () => {
  filterItems();
};
