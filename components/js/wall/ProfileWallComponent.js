import { getUserData } from "../../../model/UserProfileModel.js";
import { updateUserData } from "../../../model/UserProfileModel.js";

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
        bio: document.getElementById("bio").value,
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
          alert("Profile updated successfully!");
          window.location.reload();
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
