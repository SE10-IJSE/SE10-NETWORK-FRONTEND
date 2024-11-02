import { postRegisterData } from "../model/RegistrationFormModel.js";
import { postDataForOtp } from "../model/VerificationFormModel.js";

$(document).ready(function () {
  //Add validation
  $(".otp-field").each(function () {
    $(this).attr("required", true);
  });

  const storedData = localStorage.getItem("registrationFormData");
  const formData = JSON.parse(storedData);

  if (!postData(formData.name, formData.email))
    Toastify({
      text: "Failed to send data. Please try again.",
      duration: 3000,
      gravity: "top",
      position: "right",
      backgroundColor: "#ff0000",
      close: true,
      stopOnFocus: true,
    }).showToast();

  $(".otp-field").each(function (index, input) {
    $(input).on("input", function () {
      if ($(input).val().length >= 1 && index < $(".otp-field").length - 1) {
        $($(".otp-field")[index + 1]).focus();
      }

      if ($(input).val().length === 0 && index > 0) {
        $($(".otp-field")[index - 1]).focus();
      }
    });
  });

  $(".create-account-btn").on("click", async function (event) {
    event.preventDefault();
    if (this.checkValidity()) {
      let otpValues = [];
      $(".otp-field").each(function () {
        otpValues.push($(this).val().trim());
      });

      if (otpValues.length > 0) {
        const combinedOtp = otpValues.join("");
        if (storedData) {
          const formDataToSend = new FormData();
          formDataToSend.append("userId", formData.studentId);
          formDataToSend.append("name", formData.name);
          formDataToSend.append("email", formData.email);
          formDataToSend.append("password", formData.password);
          formDataToSend.append("dob", formData.dob);
          formDataToSend.append("batch", formData.batch);
          formDataToSend.append("bio", formData.bio);
          formDataToSend.append("otp", combinedOtp);

          // Convert base64 to Blob for profilePic and coverPic
          if (formData.profilePic) {
            const profilePicBlob = dataURLToBlob(formData.profilePic);
            formDataToSend.append(
              "profilePic",
              profilePicBlob,
              "profilePic.png"
            );
          }

          if (formData.coverPic) {
            const coverPicBlob = dataURLToBlob(formData.coverPic);
            formDataToSend.append("coverPic", coverPicBlob, "coverPic.png");
          }

          postRegisterData(formDataToSend)
            .then((response) => {
              if (response.status === 201) {
                // Remove form data from localStorage
                localStorage.removeItem("registrationFormData");

                // Set the JWT token in a cookie
                document.cookie = `jwt=${response.data.data.token}; path=/`;

                // Redirect to the homepage
                window.location.href = "/pages/homePage.html";
              } else {
                Toastify({
                  text: "SignUp failed. Please check your details.",
                  duration: 3000,
                  gravity: "top",
                  position: "right",
                  backgroundColor: "#ff0000",
                  close: true,
                  stopOnFocus: true,
                }).showToast();
              }
            })
            .catch((error) => {
              console.error("SignUp error:", error);
              if (error.response.status === 400) {
                Toastify({
                  text: "Invalid OTP. Please try again.",
                  duration: 3000,
                  gravity: "top",
                  position: "right",
                  backgroundColor: "#ff0000",
                  close: true,
                  stopOnFocus: true,
                }).showToast();
              } else {
                Toastify({
                  text: "An error occurred during SignUp. Please try again later.",
                  duration: 3000,
                  gravity: "top",
                  position: "right",
                  backgroundColor: "#ff0000",
                  close: true,
                  stopOnFocus: true,
                }).showToast();
              }
            });
        } else {
          Toastify({
            text: "An error occurred during SignUp. Please try again later.",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "#ff0000",
            close: true,
            stopOnFocus: true,
          }).showToast();
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

  $("#resend-otp").on("click", function (event) {
    event.preventDefault();

    if (!postData(formData.name, formData.email))
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
      $(".otp-field").each(function () {
        $(this).val("");
      });
    }
  });
});

const postData = async (name, email) => {
  try {
    const otpResponse = await postDataForOtp(name, email);
    return otpResponse.status === 200 ? true : false;
  } catch (error) {
    console.error("Error sending data:", error);
    return false;
  }
};

// Function to convert base64 to Blob
function dataURLToBlob(dataURL) {
  const byteString = atob(dataURL.split(",")[1]);
  const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}
