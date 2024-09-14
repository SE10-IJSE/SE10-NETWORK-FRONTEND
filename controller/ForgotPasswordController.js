const togglePassword = document.getElementById("togglePassword");
const togglePasswordConfirm = document.getElementById("togglePasswordConfirm");
const passwordInput = document.getElementById("password");
const passwordInputConfirm = document.getElementById("confirm-password");

togglePassword.addEventListener("click", function () {
  // Toggle the type attribute
  const type =
    passwordInput.getAttribute("type") === "password" ? "text" : "password";
  passwordInput.setAttribute("type", type);

  // Toggle the icon
  this.classList.toggle("ri-eye-line");
  this.classList.toggle("ri-eye-off-line");
});

togglePasswordConfirm.addEventListener("click", function () {
  // Toggle the type attribute
  const type =
    passwordInputConfirm.getAttribute("type") === "password"
      ? "text"
      : "password";
  passwordInputConfirm.setAttribute("type", type);

  // Toggle the icon
  this.classList.toggle("ri-eye-line");
  this.classList.toggle("ri-eye-off-line");
});

document.getElementById("login-btn").addEventListener("click", function () {
  window.location.href = "/index.html";
});
