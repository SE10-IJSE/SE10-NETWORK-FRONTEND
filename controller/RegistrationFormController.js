const passwordInput = document.getElementById('password');
const passwordInputConfirm = document.getElementById('password-confirm');
const togglePassword = document.getElementById('togglePassword');
const togglePasswordConfirm = document.getElementById('togglePasswordConfirm');
const loginForm = document.getElementById("Register-01")
 // Array of batch options
 const batches = ["GDSE 68", "GDSE 69", "GDSE 70", "GDSE 69"];

 // Get the select element
 const batchSelect = document.getElementById('batchSelect');

togglePassword.addEventListener('click', function () {
    // Toggle the type attribute
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);

    // Toggle the icon
    this.classList.toggle('ri-eye-line');
    this.classList.toggle('ri-eye-off-line');
});

togglePasswordConfirm.addEventListener('click', function () {
    // Toggle the type attribute
    const type = passwordInputConfirm.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInputConfirm.setAttribute('type', type);

    // Toggle the icon
    this.classList.toggle('ri-eye-line');
    this.classList.toggle('ri-eye-off-line');
});

document.getElementById('login').addEventListener('click', function () {
    window.location.href = '/index.html'
});

 // Populate the select element with batch options
batches.forEach(batch => {
     const option = document.createElement('option');
     option.value = batch;
     option.text = batch;
     batchSelect.appendChild(option);
});

document.addEventListener('DOMContentLoaded', function () {
    const inputs = document.querySelectorAll('input'); // Select all input fields

    inputs.forEach((input, index) => {
        input.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
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


document.querySelector('.btn').addEventListener('click', function () {

    window.location.href = './pages/registrationForm2.html'

});