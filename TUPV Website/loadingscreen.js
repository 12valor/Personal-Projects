window.addEventListener("DOMContentLoaded", function () {
  const loader = document.getElementById("loading-screen");
  const modal = document.querySelector(".modal");
  const modalButton = document.querySelector(".modal-button"); 

  setTimeout(() => {
    loader.style.opacity = "0";
    loader.style.pointerEvents = "none";

    setTimeout(() => {
      loader.remove();
      modal.classList.remove("modal-hidden");
    }, 10);
  }, 2500);

  modalButton.addEventListener("click", () => {
    modal.classList.add("modal-hidden");
  });
});
