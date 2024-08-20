function togglePassword(inputId, element) {
  const input = document.getElementById(inputId);
  const icon = element.querySelector("i");
  if (input.type === "password") {
    input.type = "text";
    icon.classList.remove("bx-low-vision");
    icon.classList.add("bx-show");
  } else {
    input.type = "password";
    icon.classList.remove("bx-show");
    icon.classList.add("bx-low-vision");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const editCoverPhotoBtn = document.getElementById("edit-cover-photo-btn");
  const editCoverPhotoMobileBtn = document.getElementById("btn-Edit");
  const editProfilePhotoBtn = document.getElementById("circle-camera");
  const dropdownMenu = document.getElementById("cover-photo-dropdown");
  const dropdownMenuProfile = document.getElementById(
    "cover-photo-dropdown-profile"
  );

  function toggleDropdown(targetDropdown) {
    targetDropdown.style.display =
      targetDropdown.style.display === "none" ||
      targetDropdown.style.display === ""
        ? "block"
        : "none";
  }

  editCoverPhotoBtn.addEventListener("click", function () {
    toggleDropdown(dropdownMenu);
  });

  editCoverPhotoMobileBtn.addEventListener("click", function () {
    toggleDropdown(dropdownMenu);
  });

  editProfilePhotoBtn.addEventListener("click", function () {
    toggleDropdown(dropdownMenuProfile);
  });

  document.addEventListener("click", function (event) {
    if (
      !editCoverPhotoBtn.contains(event.target) &&
      !editCoverPhotoMobileBtn.contains(event.target) &&
      !editProfilePhotoBtn.contains(event.target) &&
      !dropdownMenu.contains(event.target) &&
      !dropdownMenuProfile.contains(event.target)
    ) {
      dropdownMenu.style.display = "none";
      dropdownMenuProfile.style.display = "none";
    }
  });

  document
    .getElementById("upload-photo-btn")
    .addEventListener("click", function () {
      alert("Upload photo clicked");
      dropdownMenu.style.display = "none";
    });

  document
    .getElementById("remove-photo-btn")
    .addEventListener("click", function () {
      alert("Remove photo clicked");
      dropdownMenu.style.display = "none";
    });
});
