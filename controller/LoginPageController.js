import { postLoginData } from "../model/LoginFormModel.js";

document.addEventListener("DOMContentLoaded", function () {

  //Validations checks
  $("#email").attr({
    type: "email",
    required: true,
  });

  $("#password").attr({
    minlength: "8",
    required: true,
  });

  localStorage.removeItem("email");
  localStorage.removeItem("newPassword");
  const jwtToken = getJwtToken();

  if (jwtToken) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${jwtToken}`;
    window.location.href = "/pages/homePage.html";
  } else {
    // No token found, load the login page
    loadLoginPage();
  }
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

function loadLoginPage() {
  const passwordInput = document.getElementById("password");
  const togglePassword = document.getElementById("togglePassword");
  const loginForm = document.getElementById("login");
  const emailField = document.getElementById("email");

  togglePassword.addEventListener("click", function () {
    // Toggle the type attribute
    const type =
      passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);

    // Toggle the icon
    this.classList.toggle("ri-eye-line");
    this.classList.toggle("ri-eye-off-line");
  });

  document.getElementById("register").addEventListener("click", function () {
    window.location.href = "pages/registrationForm.html";
  });

  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const email = emailField.value;
    const password = passwordInput.value;

    try {
      const response = await postLoginData({ email, password });
      if (response.status === 200) {
        document.cookie = `jwt=${response.data.data.token}; path=/`;
        window.location.href = "pages/homePage.html";
      } else {
        Toastify({
          text: "Login failed. Please check your email and password.",
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "#ff0000",
          close: true,
          stopOnFocus: true,
        }).showToast();
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response.status === 401) {
        Toastify({
          text: "Login failed. Please check your email and password.",
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "#ff0000",
          close: true,
          stopOnFocus: true,
        }).showToast();
      } else {
        Toastify({
          text: "An error occurred during login. Please try again later.",
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "#ff0000",
          close: true,
          stopOnFocus: true,
        }).showToast();
      }
    }
  });

  document
    .getElementById("forgot-password-link")
    .addEventListener("click", function () {
      if (!emailField.value) {
        Toastify({
          text: "Please enter your email address.",
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "#ff0000",
          close: true,
          stopOnFocus: true,
        }).showToast();
        return;
      } else if (!emailField.checkValidity()) {
        Toastify({
          text: "Please enter a valid email address.",
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "#ff0000",
          close: true,
          stopOnFocus: true,
        }).showToast();
        return;
      } else {
        localStorage.setItem("email", emailField.value);
        window.location.href = "/pages/forgotPasswordForm.html";
      }
    });
}
