const form = document.getElementById("InfoForm");
const modal = document.getElementById("confirmationModal");
const dashboard = document.querySelector('.dashboard');
form.addEventListener("submit", function (e) {
  e.preventDefault();
  modal.style.display = "flex";
});
function closeModal() {
  modal.style.display = "none";
  form.reset();
}
window.addEventListener("click", function (e) {
  if (e.target === modal) {
    closeModal();
  }
});
document.querySelectorAll(".menu-btn").forEach(button => {
  button.addEventListener("click", () => {
    const submenu = button.nextElementSibling;
    submenu.classList.toggle("open");
  });
});

const hamburger = document.getElementById("hamburger");
const sidebar = document.querySelector(".sidebar");

hamburger.addEventListener("click", () => {
  sidebar.classList.toggle("open");
  hamburger.classList.toggle("is-active"); // Optional: change icon ☰/✕
});
