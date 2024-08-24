import { postRegisterData } from "../model/RegistrationFormModel.js";

// =============== Profile picture ===============

// Uploading
const profileDropArea = document.getElementById("propic-drop-area");
const profileInputFile = document.getElementById("profile-input-file");
const profileImgView = document.getElementById("profile-img-view");

profileInputFile.addEventListener("change", uploadProfilePicture);

// Drag & drop
profileDropArea.addEventListener("dragover", function (e) {
  e.preventDefault();
});

profileDropArea.addEventListener("drop", function (e) {
  e.preventDefault();
  profileInputFile.files = e.dataTransfer.files;
  uploadProfilePicture();
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

// =============== Cover picture ===============

// Uploading
const coverDropArea = document.getElementById("coverpic-drop-area");
const coverInputFile = document.getElementById("cover-input-file");
const coverImgView = document.getElementById("cover-img-view");

coverInputFile.addEventListener("change", uploadCoverPicture);

// Drag & drop
coverDropArea.addEventListener("dragover", function (e) {
  e.preventDefault();
});

coverDropArea.addEventListener("drop", function (e) {
  e.preventDefault();
  coverInputFile.files = e.dataTransfer.files;
  uploadCoverPicture();
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

// Function to save image with a suggested file path
function saveImageToDevice(base64Image, fileName) {
  const link = document.createElement("a");
  link.href = base64Image;
  link.download = fileName; // Suggested filename with student ID
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Function to create filenames with student ID
function generateFileName(studentId, imageType) {
  const timeStamp = new Date().getTime(); // Unique timestamp to avoid overwriting
  return `${studentId}_${imageType}_${timeStamp}.png`;
}

// Profile picture upload function
function uploadProfilePicture(studentId) {
  const file = profileInputFile.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = function () {
      const profilePicBase64 = reader.result;

      // Display the profile picture
      profileImgView.style.backgroundImage = `url(${profilePicBase64})`;
      profileImgView.textContent = "";

      // Save the profile picture to device storage
      saveImageToDevice(profilePicBase64, `${studentId}_profile_picture.png`);
    };
    reader.readAsDataURL(file);
  }
}

// Cover picture upload function
function uploadCoverPicture(studentId) {
  const file = coverInputFile.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = function () {
      const coverPicBase64 = reader.result;

      // Display the cover picture
      coverImgView.style.backgroundImage = `url(${coverPicBase64})`;
      coverImgView.textContent = "";

      // Save the cover picture to device storage
      saveImageToDevice(coverPicBase64, `${studentId}_cover_picture.png`);
    };
    reader.readAsDataURL(file);
  }
}

// Add event listeners for profile picture
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
          postRegisterData({
            userId: formData.studentId,
            name: formData.name,
            email: formData.email,
            password: formData.password,
            dob: formData.dob,
            bio: bio,
          })
            .then((response) => {
              if (response.status === 201) {
                // Remove form data from localStorage
                localStorage.removeItem("registrationFormData");

                // Set the JWT token in a cookie and authorization header
                document.cookie = `jwt=${response.data.data.token}; path=/`;
                axios.defaults.headers.common[
                  "Authorization"
                ] = `Bearer ${response.data}`;

                // Save profile picture and cover picture to device storage
                uploadProfilePicture(formData.studentId);
                uploadCoverPicture(formData.studentId);

                // Redirect to the homepage
                window.location.href = "/pages/homePage.html";
              } else {
                alert("SignUp failed. Please check your details.");
              }
            })
            .catch((error) => {
              console.error("SignUp error:", error);
              alert("An error occurred during SignUp. Please try again later.");
            });
        }
      });
  }
});
