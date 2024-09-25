import { getUserData } from "../../../model/UserProfileModel.js";
import {
  updateUserData,
  deleteUser,
  updateUserPhoto,
  deleteUserPhoto,
} from "../../../model/UserProfileModel.js";

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

// Initial setup on page load
$(document).ready(function () {
  $("#name, #bio, #email, #dob").prop("readonly", true);
  $("#security-section").hide();
  $("#security-section input").prop("disabled", true);

  const token = getJwtToken();
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    getUserData()
      .then((userData) => {
        if (userData) {
          // Populate profile info
          document.getElementById("name").value = userData.data.name;
          document.getElementById(
            "studentId"
          ).textContent = `@${userData.data.userId}`;
          document.getElementById("bio").value = userData.data.bio;
          document.querySelector("input[type='email']").value =
            userData.data.email;
          document.querySelector("input[type='date']").value =
            userData.data.dob;

          // Set images
          const coverPhotoElement = document.querySelector(
            ".profile-banner img"
          );
          if (userData.data.coverImg) {
            coverPhotoElement.src = `data:image/jpeg;base64,${userData.data.coverImg}`;
          }
          const profilePicElement = document.querySelector(".profile-pic");
          if (userData.data.profileImg) {
            profilePicElement.src = `data:image/jpeg;base64,${userData.data.profileImg}`;
          }

          // Logout button click event
          const isMobile = window.innerWidth <= 991;
          const logoutBtn = isMobile
            ? document.getElementById("logout-btn-mobile")
            : document.getElementById("logout-btn-desktop");

          if (logoutBtn) {
            logoutBtn.addEventListener("click", function () {
              alert("awa");
              // Remove the JWT token from the cookie
              document.cookie =
                "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              window.top.location.href = "/index.html";
            });
          }

          // Delete button click event
          const deleteBtn = document.getElementById("delete-btn");
          if (deleteBtn) {
            deleteBtn.addEventListener("click", async function () {
              try {
                const response = await deleteUser(userData.data.userId);
                if (response.status === 204) {
                  // Remove the JWT token from the cookie
                  document.cookie =
                    "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                  window.top.location.href = "/index.html";
                }
              } catch (error) {
                console.error("Error deleting user:", error);
              }
            });
          }
        }
      })
      .catch((error) => console.error("Error fetching user data:", error));
  } else {
    console.error("User token not found in cookies");
  }

  // Handle Edit Info button
  $("#edit-info-btn").click(function () {
    const isReadOnly = $("#name").prop("readonly");

    if (isReadOnly) {
      $("#name, #bio, #email, #dob").prop("readonly", false);
      $("#security-section input").prop("disabled", false);
      $("#security-section").show();
      $("#security-buttons").hide();
      $(this).html('<i class="bx bxs-check"></i> Save Info');
    } else {
      $("#security-section").hide();
      $("#security-buttons").show();
      $("#name, #bio, #email, #dob").prop("readonly", true);
      $("#security-section input").prop("disabled", true);
      $(this).html('<i class="bx bxs-edit"></i> Edit Info');

      const data = {
        userId: userData.data.userId,
        name: $("#name").val(),
        email: $("#email").val(),
        bio: $("#bio").val(),
        dob: $("#dob").val(),
      };

      updateUserData(data)
        .then((response) => {
          if (response.status === 200) {
            window.top.location.reload();
          } else {
            alert("Failed to update profile.");
          }
        })
        .catch((error) => alert("Error updating profile."));
    }
  });

  $(".editable-input").keydown(function (event) {
    if (event.key === "Enter") {
      $(this).prop("readonly", true).blur();
    }
  });

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

  $("#edit-cover-photo-btn, #btn-Edit").click(() =>
    toggleDropdown(dropdownMenu)
  );
  $("#circle-camera").click(() => toggleDropdown(dropdownMenuProfile));

  document.addEventListener("click", function (event) {
    if (
      !$("#edit-cover-photo-btn").is(event.target) &&
      !$("#btn-Edit").is(event.target) &&
      !$("#circle-camera").is(event.target) &&
      !$(event.target).closest("#cover-photo-dropdown").length &&
      !$(event.target).closest("#profile-photo-dropdown").length
    ) {
      dropdownMenu.style.display = "none";
      dropdownMenuProfile.style.display = "none";
    }
  });

  document.querySelectorAll(".remove-photo-btn").forEach((btn) => {
    btn.addEventListener("click", async function (event) {
      const isCoverPhoto = event.target.closest("#cover-photo-dropdown");
      const photoType = isCoverPhoto ? "cover" : "profile";
      const email = document.querySelector("input[type='email']").value;

      try {
        const response = await deleteUserPhoto({ email, type: photoType });
        if (response.status === 200) {
          window.top.location.reload();
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

  function setupPhotoUpload(dropdown, type) {
    dropdown
      .querySelector(`#upload-photo-btn`)
      .addEventListener("click", function () {
        const fileInput = document.getElementById("fileInput");
        fileInput.click();

        fileInput.addEventListener("change", async function () {
          const file = fileInput.files[0];
          if (file) {
            if (file.size <= 7 * 1024 * 1024) {
              const formData = new FormData();
              formData.append("image", file);
              formData.append("type", type);
              formData.append(
                "email",
                document.querySelector("input[type='email']").value
              );

              try {
                const response = await updateUserPhoto(formData);
                if (response.status === 200) {
                  window.top.location.reload();
                } else {
                  alert(`Failed to update ${type} photo.`);
                }
              } catch (error) {
                alert(`Error uploading ${type} photo.`);
              }
            } else {
              alert("Image needs to be less than 7MB.");
            }
          }
          fileInput.value = "";
        });

        dropdown.style.display = "none";
      });
  }

  setupPhotoUpload(document.getElementById("cover-photo-dropdown"), "cover");
  setupPhotoUpload(
    document.getElementById("profile-photo-dropdown"),
    "profile"
  );

  document
    .getElementById("edit-info-btn")
    .addEventListener("click", async function () {
      const newPassword = document.getElementById("newPassword").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      if (newPassword !== confirmPassword) {
        alert("New password and confirm password do not match!");
        return;
      }

      const data = {
        userId: userData.data.userId,
        name: $("#name").val(),
        email: $("#email").val(),
        bio: $("#bio").val(),
        password: document.getElementById("currentPassword").value,
        newPassword: newPassword,
        dob: $("#dob").val(),
      };

      try {
        document.cookie = "jwt=; path=/"; // Delete existing cookie named 'jwt'
        const response = await updateUserData(data);
        if (response.status === 200) {
          window.top.location.reload();
        } else {
          alert("Failed to update profile.");
        }
      } catch (error) {
        alert("Error updating profile.");
      }
    });
});

function getJwtToken() {
  const cookieName = "jwt=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(";");
  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i].trim();
    if (cookie.indexOf(cookieName) === 0) {
      return cookie.substring(cookieName.length, cookie.length);
    }
  }
  return null;
}

window.getJwtToken = getJwtToken;
window.togglePassword = togglePassword;
