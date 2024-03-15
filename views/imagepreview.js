function previewImage(event) {
  var image = document.getElementById("previewImage");
  image.src = URL.createObjectURL(event.target.files[0]);
}

document.getElementById("fileInput").addEventListener("change", previewImage);
