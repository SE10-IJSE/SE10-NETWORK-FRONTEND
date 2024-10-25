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
$(document).ready(async function () {
  //Validation Checks
  $("#name").attr("required", true);

  $("#dob").attr("required", true);

  $("#dob").on("blur", function () {
    //To Get Current Date
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    const dob = new Date(this.value);
    const dobYear = dob.getFullYear();
    console.log(dobYear);

    if (dobYear > currentYear) {
      this.value = currentDate.toISOString().split("T")[0];
    }

    if (dobYear < 1900) {
      this.value = "1900-01-01";
    }
  });

  $("#email").attr({
    type: "email",
    required: true,
  });

  $("#currentPassword").attr({
    minlength: "8",
    required: true,
  });

  $("#bio").attr({
    pattern: ".{1,30}",
    title: "Please enter between 1 to 30 characters.",
    required: true,
  });

  $("#newPassword").attr({
    minlength: "8",
  });

  $("#confirmPassword").attr({
    minlength: "8",
  });

  $("#name, #bio, #email, #dob").prop("readonly", true);
  $("#security-section").hide();
  $("#security-section input").prop("disabled", true);

  const token = getJwtToken();
  let userData;

  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      userData = await getUserData();

      if (userData) {
        // Populate profile info
        document.getElementById("name").value = userData.data.name;
        document.getElementById(
          "studentId"
        ).textContent = `@${userData.data.userId}`;
        document.getElementById("bio").value = userData.data.bio;
        document.querySelector("input[type='email']").value =
          userData.data.email;
        document.querySelector("input[type='date']").value = userData.data.dob;

        // Set images
        const coverPhotoElement = document.querySelector(".profile-banner img");
        if (userData.data.coverImg) {
          coverPhotoElement.src = `data:image/jpeg;base64,${userData.data.coverImg}`;
        }
        const profilePicElement = document.querySelector(".profile-pic");
        if (userData.data.profileImg) {
          profilePicElement.src = `data:image/jpeg;base64,${userData.data.profileImg}`;
        }

        // Add event listener to all logout buttons
        document.querySelectorAll(".logout-btn").forEach((btn) => {
          btn.addEventListener("click", function () {
            removeJwtToken();
          });
        });

        // Delete button click event
        const deleteBtns = document.querySelectorAll(".delete-btn");
        deleteBtns.forEach((deleteBtn) => {
          deleteBtn.addEventListener("click", function () {
            // Show the delete confirmation popup
            showModal();

            if (deleteBtn) {
              $("#confirmDelete").on("click", async function () {
                try {
                  const response = await deleteUser(userData.data.userId);
                  if (response.status === 204) {
                    removeJwtToken();
                  } else {
                    closeDeleteModal();
                    Toastify({
                      text: "Failed to delete account.",
                      duration: 3000,
                      gravity: "top",
                      position: "right",
                      backgroundColor: "#ff0000",
                    }).showToast();
                  }
                } catch (error) {
                  closeDeleteModal();
                  console.error("Error deleting user:", error);
                  Toastify({
                    text: "Error deleting account.",
                    duration: 3000,
                    gravity: "top",
                    position: "right",
                    backgroundColor: "#ff0000",
                  }).showToast();
                }
              });

              $("#cancelDelete").on("click", function () {
                closeDeleteModal();
              });

              function closeDeleteModal() {
                $("#deletePopupModal").removeClass("active");
                setTimeout(function () {
                  $("#deletePopupModal").css("display", "none");
                }, 300);
              }
            }

            function showModal() {
              $("#deletePopupModal").css("display", "flex");
              setTimeout(function () {
                $("#deletePopupModal").addClass("active");
              }, 10);
            }
          });
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  } else {
    console.error("User token not found in cookies");
  }

  // Function to remove the JWT token from the cookie
  const removeJwtToken = () => {
    document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.top.location.href = "/index.html";
  };

  // Handle Edit Info button click
  $("#edit-info-btn").click(function () {
    const isReadOnly = $("#name").prop("readonly");

     // Check for validity
     let isValid = true;

     $("#name,#email,#dob,#currentPassword,#newPassword,#confirmPassword,#bio").each(function () {
       if (!this.checkValidity()) {
         $(this).get(0).reportValidity();
         isValid = false;
       }
     });
 
     if (!isValid) {
       return;
     }

    if (isReadOnly) {
      $("#name, #bio, #email, #dob").prop("readonly", false);
      $("#security-section input").prop("disabled", false);
      $("#security-section").show();
      $("#security-buttons").hide();
      $(this).html('<i class="bx bxs-check"></i> Save Info');
    } else {
      // Validate passwords before saving info
      const currentPassword = document.getElementById("currentPassword").value;
      const newPassword = document.getElementById("newPassword").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      if (newPassword !== confirmPassword) {
        $("#confirmPassword")[0].setCustomValidity("Passwords do not match");
        $("#confirmPassword")[0].reportValidity();
        return;
      }

      // Save info
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
        password: currentPassword,
        newPassword: newPassword,
      };

      updateUserData(data)
        .then((response) => {
          if (response.status === 200) {
            // Delete the existing cookie named 'jwt'
            document.cookie = "jwt=; path=/";
            // Set the new cookie with the updated token
            document.cookie = `jwt=${response.data.data.token}; path=/`;
            window.top.location.reload();
          } else {
            Toastify({
              text: "Failed to update profile.",
              duration: 3000,
              gravity: "top",
              position: "right",
              backgroundColor: "#ff0000",
            }).showToast();
          }
        })
        .catch((error) => {
          if (error.code === 406) {
            Toastify({
              text: "Current password is incorrect.",
              duration: 3000,
              gravity: "top",
              position: "right",
              backgroundColor: "#ff0000",
            }).showToast();
          } else {
            console.error("Error updating profile:", error);
            Toastify({
              text: "Error updating profile.",
              duration: 3000,
              gravity: "top",
              position: "right",
              backgroundColor: "#ff0000",
            }).showToast();
          }
        });
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

    // Add event listeners to clear custom validity
    $("#confirmPassword").on("change", function () {
      this.setCustomValidity("");
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
          window.top.location.reload();
        } else {
          Toastify({
            text: `Failed to update ${type} photo.`,
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "#ff0000",
          }).showToast();
        }
      } catch (error) {
        Toastify({
          text: `Error uploading ${type} photo.`,
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "#ff0000",
        }).showToast();
      }

      dropdownMenu.style.display = "none";
      dropdownMenuProfile.style.display = "none";
    });
  });

  function setupPhotoUpload() {
    const uploadButtons = document.querySelectorAll(".upload-photo-btn");

    uploadButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const fileInput = document.getElementById("fileInput");
        fileInput.click();

        fileInput.addEventListener("change", async function () {
          const file = fileInput.files[0];
          if (file) {
            if (file.size <= 7 * 1024 * 1024) {
              const formData = new FormData();
              formData.append("image", file);

              // Determine the type of photo based on the parent element
              const isCoverPhoto = button.closest("#cover-photo-dropdown");
              const type = isCoverPhoto ? "cover" : "profile";
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
                  Toastify({
                    text: `Failed to update ${type} photo.`,
                    duration: 3000,
                    gravity: "top",
                    position: "right",
                    backgroundColor: "#ff0000",
                  }).showToast();
                }
              } catch (error) {
                Toastify({
                  text: `Error uploading ${type} photo.`,
                  duration: 3000,
                  gravity: "top",
                  position: "right",
                  backgroundColor: "#ff0000",
                }).showToast();
              }
            } else {
              Toastify({
                text: "Image needs to be less than 7MB.",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "#ff0000",
              }).showToast();
            }
          }
          fileInput.value = "";
        });

        // Hide the dropdown menu after clicking the upload button
        const dropdownMenu = button.closest(
          ".dropdown-menu, .dropdown-menu-profile"
        );
        if (dropdownMenu) {
          dropdownMenu.style.display = "none";
        }
      });
    });
  }

  setupPhotoUpload();
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
