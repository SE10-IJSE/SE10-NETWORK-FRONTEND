import { updateUserPassword } from "../model/UserProfileModel.js";

$(document).ready(function () {
  const $togglePassword = $("#togglePassword");
  const $togglePasswordConfirm = $("#togglePasswordConfirm");
  const $passwordInput = $("#password");
  const $passwordInputConfirm = $("#confirm-password");

  $togglePassword.on("click", function () {
    // Toggle the type attribute
    const type =
      $passwordInput.attr("type") === "password" ? "text" : "password";
    $passwordInput.attr("type", type);

    // Toggle the icon
    $(this).toggleClass("ri-eye-line ri-eye-off-line");
  });

  $togglePasswordConfirm.on("click", function () {
    // Toggle the type attribute
    const type =
      $passwordInputConfirm.attr("type") === "password" ? "text" : "password";
    $passwordInputConfirm.attr("type", type);

    // Toggle the icon
    $(this).toggleClass("ri-eye-line ri-eye-off-line");
  });

  // Handle Enter key press
  $("input").keydown(function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      const $inputs = $("input");
      const nextInput = $inputs.get($inputs.index(this) + 1);
      if (nextInput) {
        nextInput.focus();
      }
    }
  });

  $("#login-btn").on("click", function () {
    window.location.href = "/index.html";
  });

  $("#login").on("submit", function (event) {
    event.preventDefault();
    changePassword();
  });

  function changePassword() {
    if ($passwordInput.val() === $passwordInputConfirm.val()) {
      if (updatePassword(localStorage.getItem("email"), $passwordInput.val())) {
        localStorage.removeItem("email");
        window.location.href = "/index.html";
      } else alert("Failed to update password. Please try again.");
    } else {
      alert("Passwords do not match!");
    }
  }
});

const updatePassword = async (email, password) => {
  try {
    const response = await updateUserPassword(email, password);
    return response.status === 204 ? true : false;
  } catch (error) {
    console.error("Error updating password:", error);
    return false;
  }
};
