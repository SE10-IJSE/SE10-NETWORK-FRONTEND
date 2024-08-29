import { postLoginData } from "../model/LoginFormModel.js";

document.addEventListener("DOMContentLoaded", function () {
  const jwtToken = getJwtToken();

  if (jwtToken) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${jwtToken}`;

    getTokenValidation()
      .then((response) => {
        if (response.data === true) {
          // Token is valid, redirect to the home page
          window.location.href = "/pages/homePage.html";
        } else {
          // Token is invalid, proceed with the login page
          loadLoginPage();
        }
      })
      .catch((error) => {
        console.error("Token validation failed:", error);
        // Load the login page in case of an error
        loadLoginPage();
      });
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

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = emailField.value;
    const password = passwordInput.value;

    // Send login data to the server
    postLoginData({ email, password })
      .then((response) => {
        if (response.status === 200) {
          document.cookie = `jwt=${response.data.data.token}; path=/`;
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${response.data}`;

          window.location.href = "pages/homePage.html";
        } else {
          alert("Login failed. Please check your email and password.");
        }
      })
      .catch((error) => {
        window.location.href = "/";
        console.error("Login error:", error);
        alert("An error occurred during login. Please try again later.");
      });
  });
}
