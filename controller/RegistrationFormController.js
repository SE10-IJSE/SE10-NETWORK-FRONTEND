const passwordInput = document.getElementById("password");
const passwordInputConfirm = document.getElementById("password-confirm");
const togglePassword = document.getElementById("togglePassword");
const togglePasswordConfirm = document.getElementById("togglePasswordConfirm");
const loginForm = document.getElementById("register-form-01");

// Array of batch options
const batches = [
  "GDSE 67",
  "GDSE 68",
  "GDSE 69",
  "GDSE 70",
  "GDSE 71",
  "GDSE 72",
  "GDSE 73",
  "GDSE 74",
];

// Get the select element
const batchSelect = document.getElementById("batchSelect");

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

document.getElementById("login").addEventListener("click", function () {
  window.location.href = "/index.html";
});

// Populate the select element with batch options
batches.forEach((batch) => {
  const option = document.createElement("option");
  option.value = batch;
  option.text = batch;
  batchSelect.appendChild(option);
});

document.addEventListener("DOMContentLoaded", function () {
  const inputs = document.querySelectorAll("input"); // Select all input fields

  inputs.forEach((input, index) => {
    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault(); // Prevent the default action (e.g., form submission)

        // Focus on the next input field
        const nextInput = inputs[index + 1];
        if (nextInput) {
          nextInput.focus();
        }
      }
    });
  });
});

document.querySelector(".btn").addEventListener("click", function (event) {
  event.preventDefault();

  // Get the values from the form fields
  const studentId = document.getElementById("studentId").value;
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const dob = document.getElementById("dob").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("password-confirm").value;
  const selectedBatch = batchSelect ? batchSelect.value : "";

  // Validate password and confirm password
  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  // Create a data object to store the values
  const formData = {
    studentId,
    name,
    email,
    dob,
    password,
    batch: selectedBatch,
  };

  // Store the data object in localStorage to retrieve it in the next page
  localStorage.setItem("registrationFormData", JSON.stringify(formData));

  // Navigate to the registrationForm-2
  window.location.href = "/pages/registrationForm2.html";
});
