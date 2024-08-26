import { getUserData } from "../../../model/UserProfileModel.js";
import { updateUserData } from "../../../model/UserProfileModel.js";
import { updateUserPhoto } from "../../../model/UserProfileModel.js";
import { deleteUserPhoto } from "../../../model/UserProfileModel.js";

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

// Make the function available globally
window.togglePassword = togglePassword;

document.addEventListener("DOMContentLoaded", async function () {
  const token = getJwtToken();
  let userData;

  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      userData = await getUserData();
      if (userData) {
        // Populate profile info
        document.querySelector(".profile-info h1").textContent =
          userData.data.name;
        document.querySelector(
          ".profile-info h3"
        ).textContent = `@${userData.data.userId}`;
        document.querySelector(".profile-info h4").textContent =
          userData.data.bio;
        document.querySelector("input[type='email']").value =
          userData.data.email;
        document.querySelector("input[type='date']").value = userData.data.dob;

        // Set cover photo
        const coverPhotoElement = document.querySelector(".profile-banner img");
        if (userData.data.coverImg) {
          coverPhotoElement.src = `data:image/jpeg;base64,${userData.data.coverImg}`;
        }

        // Set profile photo
        const profilePicElement = document.querySelector(".profile-pic");
        if (userData.data.profileImg) {
          profilePicElement.src = `data:image/jpeg;base64,${userData.data.profileImg}`;
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  } else {
    console.error("User email not found in local storage");
  }

  const editCoverPhotoBtn = document.getElementById("edit-cover-photo-btn");
  const editCoverPhotoMobileBtn = document.getElementById("btn-Edit");
  const editProfilePhotoBtn = document.getElementById("circle-camera");
  const dropdownMenu = document.getElementById("cover-photo-dropdown");
  const dropdownMenuProfile = document.getElementById("profile-photo-dropdown");

  function toggleDropdown(targetDropdown) {
    if (!targetDropdown) {
      console.error("Target dropdown is null");
      return;
    }
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

  // Event listeners for "Remove Photo" buttons
  document.querySelectorAll(".remove-photo-btn").forEach((btn) => {
    btn.addEventListener("click", async function (event) {
      const isCoverPhoto = event.target.closest("#cover-photo-dropdown");
      const photoType = isCoverPhoto ? "cover" : "profile";
      const email = document.querySelector("input[type='email']").value;

      try {
        const response = await deleteUserPhoto({ email, type: photoType });
        if (response.status === 200) {
          window.top.location.reload(); // Reload page on successful deletion
        } else {
          alert("Failed to remove photo.");
        }
      } catch (error) {
        alert("Error removing photo.");
      }

      dropdownMenu.style.display = "none";
      dropdownMenuProfile.style.display = "none";
    });
  });

  // Event listener for cover photo upload button
  document
    .querySelector("#cover-photo-dropdown #upload-photo-btn")
    .addEventListener("click", function () {
      const fileInput = document.getElementById("fileInput");
      fileInput.click();

      fileInput.addEventListener("change", async function () {
        const file = fileInput.files[0];
        if (file) {
          if (file.size <= 7 * 1024 * 1024) {
            const formData = new FormData();
            formData.append("image", file);
            formData.append("type", "cover");
            formData.append(
              "email",
              document.querySelector("input[type='email']").value
            );

            try {
              const response = await updateUserPhoto(formData);
              if (response.status === 200) {
                window.top.location.reload();
              } else {
                alert("Failed to update cover photo.");
              }
            } catch (error) {
              alert("Error uploading cover photo.");
            }
          } else {
            alert("Image needs to be less than 7MB.");
          }
        }
        fileInput.value = "";
      });

      dropdownMenu.style.display = "none";
    });

  // Event listener for profile photo upload button
  document
    .querySelector("#profile-photo-dropdown .upload-photo-btn")
    .addEventListener("click", function () {
      const fileInput = document.getElementById("fileInput");
      fileInput.click();

      fileInput.addEventListener("change", async function () {
        const file = fileInput.files[0];
        if (file) {
          if (file.size <= 7 * 1024 * 1024) {
            // Create FormData and append file
            const formData = new FormData();
            formData.append("image", file);
            formData.append("type", "profile");
            formData.append(
              "email",
              document.querySelector("input[type='email']").value
            );

            try {
              const response = await updateUserPhoto(formData);
              if (response.status === 200) {
                window.top.location.reload();
              } else {
                alert("Failed to update profile photo.");
              }
            } catch (error) {
              alert("Error uploading profile photo.");
            }
          } else {
            alert("Image needs to be less than 7MB.");
          }
        }
        fileInput.value = "";
      });

      dropdownMenuProfile.style.display = "none";
    });

  // Adding event listener for the "Edit Details" button
  document
    .getElementById("update-btn")
    .addEventListener("click", async function () {
      const newPassword = document.getElementById("newPassword").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      if (newPassword !== confirmPassword) {
        alert("New password and confirm password do not match!");
        return;
      }

      // Prepare the data to be sent
      const data = {
        userId: userData.data.userId,
        name: document.getElementById("name").textContent,
        email: document.querySelector("input[type='email']").value,
        bio: document.getElementById("bio").textContent,
        password: document.getElementById("currentPassword").value,
        newPassword: newPassword,
        dob: document.querySelector("input[type='date']").value,
      };

      try {
        // Delete the existing cookie named 'jwt'
        document.cookie = "jwt=; path=/";

        const response = await updateUserData(data);
        if (response.status === 200) {
          // Set the new cookie with the updated token
          document.cookie = `jwt=${response.data.data.token}; path=/`;
          window.top.location.reload();
        } else if (response.status === 406) {
          alert("Current password is incorrect.");
        }
      } catch (error) {
        alert("Failed to update profile.");
      }
    });
});

function getJwtToken() {
  const cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    if (cookie.startsWith("jwt=")) {
      return cookie.split("=")[1];
    }
  }
  return null;
}
