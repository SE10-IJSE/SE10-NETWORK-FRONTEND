$(document).ready(function () {
  //Validations
  $("#password").attr({
    minlength: "8",
    required: true,
  });

  $("#confirm-password").attr("required", true);

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
      if (this.checkValidity()) {
        const $inputs = $("input");
        const nextInput = $inputs.get($inputs.index(this) + 1);
        if (nextInput) {
          nextInput.focus();
        }
      } else {
        this.reportValidity();
      }
    }
  });

  $("#login-btn").on("click", function () {
    window.location.href = "/index.html";
  });

  $("#login").on("submit", function (event) {
    event.preventDefault();
    if (this.checkValidity() & validatePasswords()) {
      if ($passwordInput.val() === $passwordInputConfirm.val()) {
        localStorage.setItem("newPassword", $passwordInput.val());
        window.location.href = "/pages/forgotPasswordOtpVerifyPage.html";
      }
    } else {
      this.reportValidity();
    }
  });

  $("#password").on("input", function () {
    this.setCustomValidity("");
  });

  $("#confirm-password").on("input", function () {
    this.setCustomValidity("");
  });
});

function validatePasswords() {
  const password = $("#password").val();
  const confirmPassword = $("#confirm-password").val();

  if (password !== confirmPassword) {
    $("#confirm-password")[0].setCustomValidity("Passwords do not match");
    return false;
  } else {
    $("#confirm-password")[0].setCustomValidity("");
    return true;
  }
}
