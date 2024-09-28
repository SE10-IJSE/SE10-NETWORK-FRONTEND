document.querySelectorAll(".otp-field").forEach((input, index, inputs) => {
  input.addEventListener("input", () => {
    if (input.value.length >= 1 && index < inputs.length - 1) {
      inputs[index + 1].focus();
    }

    if (input.value.length === 0 && index > 0) {
      inputs[index - 1].focus();
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const createAccountBtn = document.querySelector(".create-account-btn");

  createAccountBtn.addEventListener("click", function (event) {
    event.preventDefault();

    const otpFields = document.querySelectorAll(".otp-field");
    let otpValues = [];
    let code;

    otpFields.forEach((field, index) => {
      const value = field.value.trim();
      otpValues.push(value);
    });

    if (otpValues.length > 0) {
      const combinedOtp = otpValues.join("");
      alert("Entered OTP: " + combinedOtp);
      otpFields.forEach((field) => {
        field.value = "";
      });
    } else {
      alert("No OTP values entered.");
    }
  });
});
