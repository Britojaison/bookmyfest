function previewImage(event) {
  var image = document.getElementById("previewImage");
  image.src = URL.createObjectURL(event.target.files[0]);
}

document.getElementById("fileInput").addEventListener("change", previewImage);

function handleNoSubEventsChange() {
  var numSubEvents = parseInt(document.getElementById("nosubevents").value);
  var addSubEventButton = document.getElementById("addSubEventButton");

  if (isNaN(numSubEvents) || numSubEvents <= 0) {
    addSubEventButton.classList.add("disabled");
    addSubEventButton.removeAttribute("href");
  } else {
    addSubEventButton.classList.remove("disabled");

    addSubEventButton.setAttribute("href", "./createEvent.html");
  }
}

document
  .getElementById("nosubevents")
  .addEventListener("change", handleNoSubEventsChange);

function handleCampusWideChange() {
  var yesCampus = document.getElementById("yesCampus");
  var eventIDInput = document.getElementById("eventID");

  eventIDInput.disabled = yesCampus.checked;
}

document.querySelectorAll('input[name="campusWide"]').forEach((elem) => {
  elem.addEventListener("change", handleCampusWideChange);
});

function handleRegistrationChange() {
  var yesRegistration = document.getElementById("yesRegistration");
  var rangeInput = document.getElementById("range");

  rangeInput.disabled = noRegistration.checked;
}

document.querySelectorAll('input[name="registration"]').forEach((elem) => {
  elem.addEventListener("change", handleRegistrationChange);
});

function handleSubEventsChange() {
  var yesSubEvents = document.getElementById("yesSubEvents");
  var noOfSubEventsInput = document.getElementById("nosubevents");

  noOfSubEventsInput.disabled = noSubEvents.checked;
}

document.querySelectorAll('input[name="subevents"]').forEach((elem) => {
  elem.addEventListener("change", handleSubEventsChange);
});

handleSubEventsChange();

// Function to handle changes in the venue selection
function handleVenueChange() {
  var venueSelect = document.getElementById("venue");
  var venueInput = document.getElementById("venueInput");

  // Disable the input field only if "Other" is selected from the dropdown, otherwise enable it
  venueInput.disabled = venueSelect.value !== "other";
}

// Listen for changes in the venue selection
document.getElementById("venue").addEventListener("change", handleVenueChange);

// Call the function initially to set the initial state based on the default selection
handleVenueChange();
