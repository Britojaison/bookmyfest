const dropdownTrigger = document.getElementById("dropdown-trigger");
const dropdownMenu = document.getElementById("dropdown-menu");
const dropdownContainer = document.getElementById("dropdown-container");

dropdownContainer.addEventListener("mouseenter", () => {
  dropdownMenu.style.display = "block";
});

dropdownContainer.addEventListener("mouseleave", () => {
  dropdownMenu.style.display = "none";
});
