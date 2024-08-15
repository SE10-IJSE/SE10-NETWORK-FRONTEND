function togglePassword(inputId, element) {
            const input = document.getElementById(inputId);
            const icon = element.querySelector('i');
            if (input.type === "password") {
                input.type = "text";
                icon.classList.remove('bx-low-vision');
                icon.classList.add('bx-show');
            } else {
                input.type = "password";
                icon.classList.remove('bx-show');
                icon.classList.add('bx-low-vision');
            }
        }
