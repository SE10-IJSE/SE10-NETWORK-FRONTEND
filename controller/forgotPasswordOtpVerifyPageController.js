import { postDataForOtp, verifyOtp } from "../model/VerificationFormModel.js";

$(document).ready(function () {
  //Add validation
  $(".otp-input").each(function () {
    $(this).attr("required", true);
  });

  const email = localStorage.getItem("email");
  if (!postData("", email)) alert("Failed to send data. Please try again.");

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

  $(".btn-submit").submit(async function (event) {
    event.preventDefault();
    if (this.checkValidity()){ 
    let otpValues = [];
    $(".otp-input").each(function () {
      otpValues.push($(this).val().trim());
    });

    if (otpValues.length > 0) {
      const combinedOtp = otpValues.join("");

      const verifyResponse = await verifyEnteredOtp(email, combinedOtp);
      if (verifyResponse)
        window.location.href = "/pages/forgotPasswordForm.html";
      else alert("Invalid OTP. Please try again.");

      $(".otp-field").each(function () {
        $(this).val("");
      });
    } else alert("No OTP values entered.");
  }else{
    this.reportValidity();
  }
  });
  
  $("#resend").on("click", function (event) {
    event.preventDefault();

    if (!postData(formData.name, formData.email))
      alert("Failed to send data. Please try again.");
    else {
      $(".otp-input").each(function () {
        $(this).val("");
      });
    }
  });
});

const verifyEnteredOtp = async (email, otp) => {
  try {
    const otpResponse = await verifyOtp(email, otp);
    return otpResponse.status === 200 ? true : false;
  } catch (error) {
    console.error("Error verifying otp:", error);
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
