function previewImage(event) {
  var image = document.getElementById("previewImage");
  if (event.target.files && event.target.files[0]) {
    image.src = URL.createObjectURL(event.target.files[0]);
  }
}

document.getElementById("fileInput").addEventListener("change", previewImage);

function handleCampusWideChange() {
  var yesCampus = document.getElementById("yesCampus");
  var eventIDInput = document.getElementById("eventID");

  if (yesCampus.checked) {
    eventIDInput.disabled = true;
  } else {
    eventIDInput.disabled = false;
  }
}

console.log("asdasdasd");

document.querySelectorAll('input[name="campusWide"]').forEach((elem) => {
  console.log("elem", elem);

  elem.addEventListener("change", handleCampusWideChange);
});

function handleRegistrationChange() {
  var yesRegistration = document.getElementById("yesRegistration");
  var rangeInput = document.getElementById("range");

  if (yesRegistration.checked) {
    rangeInput.disabled = true;
  } else {
    rangeInput.disabled = false;
  }
}

document.querySelectorAll('input[name="registration"]').forEach((elem) => {
  elem.addEventListener("change", handleRegistrationChange);
});

function handleVenueChange() {
  var venueSelect = document.getElementById("venue");
  var venueInput = document.getElementById("venueInput");

  if (venueSelect.value !== "other") {
    venueInput.disabled = true;
  } else {
    venueInput.disabled = false;
  }
}

document.getElementById("venue").addEventListener("change", handleVenueChange);

window.addEventListener("DOMContentLoaded", (event) => {
  document.getElementById("eventDate").valueAsDate = new Date();

  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 1);
  document.getElementById("endDate").valueAsDate = endDate;
});
