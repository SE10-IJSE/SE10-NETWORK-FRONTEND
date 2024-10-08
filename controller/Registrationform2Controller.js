// ====== Profile Picture Upload ======
const profileDropArea = document.getElementById("propic-drop-area");
const profileInputFile = document.getElementById("profile-input-file");
const profileImgView = document.getElementById("profile-img-view");

profileInputFile.addEventListener("change", displayProfilePicture);

// Drag & drop
profileDropArea.addEventListener("dragover", function (e) {
  e.preventDefault();
});

profileDropArea.addEventListener("drop", function (e) {
  e.preventDefault();
  profileInputFile.files = e.dataTransfer.files;
  displayProfilePicture();
});

// Applying border style on click
let profilePictureContainer = document.getElementById("profile-pic-container");

document.querySelector("#profile-input-file").onclick = function () {
  profilePictureContainer.style.border = "2px solid #E90708";
};

document.addEventListener("click", function (event) {
  if (
    !profilePictureContainer.contains(event.target) &&
    event.target.id !== "profile-input-file"
  ) {
    profilePictureContainer.style.border = "none";
  }
});

// ====== Cover Picture Upload ======
const coverDropArea = document.getElementById("coverpic-drop-area");
const coverInputFile = document.getElementById("cover-input-file");
const coverImgView = document.getElementById("cover-img-view");

coverInputFile.addEventListener("change", displayCoverPicture);

// Drag & drop
coverDropArea.addEventListener("dragover", function (e) {
  e.preventDefault();
});

coverDropArea.addEventListener("drop", function (e) {
  e.preventDefault();
  coverInputFile.files = e.dataTransfer.files;
  displayCoverPicture();
});

// Applying border style on click
let coverPictureContainer = document.getElementById("cover-pic-container");

document.querySelector("#cover-input-file").onclick = function () {
  coverPictureContainer.style.border = "2px solid #E90708";
};

document.addEventListener("click", function (event) {
  if (
    !coverPictureContainer.contains(event.target) &&
    event.target.id !== "cover-input-file"
  ) {
    coverPictureContainer.style.border = "none";
  }
});

// Function to display profile picture
function displayProfilePicture() {
  const file = profileInputFile.files[0];
  if (file) {
    if (file.size > 7 * 1024 * 1024) {
      // Check if file size exceeds 7MB
      alert("Please select a profile photo smaller than 7MB.");
      profileInputFile.value = ""; // Reset the file input
      profileImgView.style.backgroundImage = ""; // Clear any previous image
    } else {
      const reader = new FileReader();
      reader.onloadend = function () {
        const profilePicBase64 = reader.result;
        profileImgView.style.backgroundImage = `url(${profilePicBase64})`;
        profileImgView.textContent = "";
      };
      reader.readAsDataURL(file);
    }
  }
}

// Function to display cover picture
function displayCoverPicture() {
  const file = coverInputFile.files[0];
  if (file) {
    if (file.size > 7 * 1024 * 1024) {
      // Check if file size exceeds 7MB
      alert("Please select a cover photo smaller than 7MB.");
      coverInputFile.value = ""; // Reset the file input
      coverImgView.style.backgroundImage = ""; // Clear any previous image
    } else {
      const reader = new FileReader();
      reader.onloadend = function () {
        const coverPicBase64 = reader.result;
        coverImgView.style.backgroundImage = `url(${coverPicBase64})`;
        coverImgView.textContent = "";
      };
      reader.readAsDataURL(file);
    }
  }
}

// Add event listeners for profile and cover pictures
document.addEventListener("DOMContentLoaded", function () {
  const storedData = localStorage.getItem("registrationFormData");

  if (storedData) {
    const formData = JSON.parse(storedData);

    document
      .getElementById("register-form-02")
      .addEventListener("submit", (event) => {
        event.preventDefault();
        let bio = document.getElementById("bio").value;

        if (bio !== null && bio !== "") {
          formData.bio = bio;

          // Append profile and cover pictures if they exist
          if (profileInputFile.files[0]) {
            const reader = new FileReader();
            reader.onloadend = function () {
              formData.profilePic = reader.result;
              localStorage.setItem(
                "registrationFormData",
                JSON.stringify(formData)
              );
            };
            reader.readAsDataURL(profileInputFile.files[0]);
          }

          if (coverInputFile.files[0]) {
            const reader = new FileReader();
            reader.onloadend = function () {
              formData.coverPic = reader.result;
              localStorage.setItem(
                "registrationFormData",
                JSON.stringify(formData)
              );
            };
            reader.readAsDataURL(coverInputFile.files[0]);
          }

          localStorage.setItem(
            "registrationFormData",
            JSON.stringify(formData)
          );

          window.location.href = "/pages/registrationOtpVerifyPage.html";
        }
      });
  }

  //Validations checks
  $("#bio").attr("required", true);
  $('input[type="checkbox"]').attr("required", true);
});
