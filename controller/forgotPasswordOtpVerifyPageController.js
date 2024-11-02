import { postDataForOtp } from "../model/VerificationFormModel.js";
import { updateUserPassword } from "../model/UserProfileModel.js";

$(document).ready(function () {
  //Add validation
  $(".otp-input").each(function () {
    $(this).attr("required", true);
  });

  const email = localStorage.getItem("email");
  const newPassword = localStorage.getItem("newPassword");

  if (!postData("", email))
    Toastify({
      text: "Failed to send data. Please try again.",
      duration: 3000,
      gravity: "top",
      position: "right",
      backgroundColor: "#ff0000",
      close: true,
      stopOnFocus: true,
    }).showToast();

  $(".otp-input").each(function (index, input) {
    $(input).on("input", function () {
      if ($(input).val().length >= 1 && index < $(".otp-input").length - 1) {
        $($(".otp-input")[index + 1]).focus();
      }

      if ($(input).val().length === 0 && index > 0) {
        $($(".otp-input")[index - 1]).focus();
      }
    });
  });

  $(".Reset-Password").submit(async function (event) {
    event.preventDefault();

    if (this.checkValidity()) {
      let otpValues = [];
      $(".otp-input").each(function () {
        otpValues.push($(this).val().trim());
      });

      if (otpValues.length > 0) {
        const combinedOtp = otpValues.join("");
        const isUpdated = await updatePassword(email, newPassword, combinedOtp);
        if (isUpdated) {
          Toastify({
            text: "Password updated successfully!",
            duration: 3000,
            gravity: "top",
            position: "center",
            backgroundColor: "#00b09b",
            close: true,
            stopOnFocus: true,
          }).showToast();
          localStorage.removeItem("email");
          localStorage.removeItem("newPassword");
          window.location.href = "/index.html";
        }

        $(".otp-field").each(function () {
          $(this).val("");
        });
      } else {
        Toastify({
          text: "No OTP values entered.",
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "#ff0000",
          close: true,
          stopOnFocus: true,
        }).showToast();
      }
    } else {
      this.reportValidity();
    }
  });

  $("#resend").on("click", function (event) {
    event.preventDefault();

    if (!postData("", email))
      Toastify({
        text: "Failed to send data. Please try again.",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#ff0000",
        close: true,
        stopOnFocus: true,
      }).showToast();
    else {
      $(".otp-input").each(function () {
        $(this).val("");
      });
    }
  });
});

const updatePassword = async (email, password, otp) => {
  try {
    const response = await updateUserPassword(email, password, otp);
    return response.status === 204 ? true : false;
  } catch (error) {
    console.error("Error updating password:", error);
    if (error.response.status === 400)
      Toastify({
        text: "Invalid OTP. Please try again.",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#ff0000",
        close: true,
        stopOnFocus: true,
      }).showToast();
    else if (error.response.status === 404)
      Toastify({
        text: "User not found.",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#ff0000",
        close: true,
        stopOnFocus: true,
      }).showToast();
    else
      Toastify({
        text: "Error updating password",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#ff0000",
        close: true,
        stopOnFocus: true,
      }).showToast();
    return false;
  }
};

const postData = async (name, email) => {
  try {
    const otpResponse = await postDataForOtp(name, email);
    return otpResponse.status === 200 ? true : false;
  } catch (error) {
    console.error("Error sending data:", error);
    return false;
  }
};
