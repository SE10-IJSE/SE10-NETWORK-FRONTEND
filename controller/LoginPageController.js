const passwordInput = document.getElementById('password');
const togglePassword = document.getElementById('togglePassword');
const loginForm = document.getElementById("login")

togglePassword.addEventListener('click', function () {
    // Toggle the type attribute
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);

    // Toggle the icon
    this.classList.toggle('ri-eye-line');
    this.classList.toggle('ri-eye-off-line');
});

document.getElementById('register').addEventListener('click', function () {
    window.location.href = 'pages/registrationForm.html'
});

document.addEventListener('DOMContentLoaded', function () {
    const emailField = document.getElementById('email');
    const passwordField = document.getElementById('password');
    const rememberMeCheckbox = document.getElementById('rememberMe');

    // Check if data is stored in localStorage and populate fields if it is
    if (localStorage.getItem('rememberMe') === 'true') {
        // emailField.value = localStorage.getItem('email');
        // passwordField.value = localStorage.getItem('password');
        // rememberMeCheckbox.checked = true;
    }

    document.querySelector('.btn').addEventListener('click', function () {
        if (rememberMeCheckbox.checked) {
            // Store data in localStorage
            // localStorage.setItem('email', emailField.value);
            // localStorage.setItem('password', passwordField.value);
            // localStorage.setItem('rememberMe', 'true');
        } else {
            // Clear data from localStorage
            // localStorage.removeItem('email');
            // localStorage.removeItem('password');
            // localStorage.removeItem('rememberMe');
        }

        window.location.href = 'pages/homePage.html'
   
    });
});
