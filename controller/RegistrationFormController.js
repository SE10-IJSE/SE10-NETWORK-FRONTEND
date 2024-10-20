$(document).ready(function () {
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

  // Populate the select element with batch options(Desktop)
  $("#batchSelect").append(
    $("<option>", {
      value: "",
      text: "Select Batch",
      disabled: true,
      selected: true,
    })
  );
  $.each(batches, function (i, batch) {
    $("#batchSelect").append(
      $("<option>", {
        value: batch,
        text: batch,
      })
    );
  });

  // Populate the select element with batch options(Mobile)
  $("#batchSelectMobile").append(
    $("<option>", {
      value: "",
      text: "Select Batch",
      disabled: true,
      selected: true,
    })
  );

  $.each(batches, function (i, batch) {
    $("#batchSelectMobile").append(
      $("<option>", {
        value: batch,
        text: batch,
      })
    );
  });

  // Toggle password visibility
  $(".ri-eye-off-line").click(function () {
    const $input = $(this).siblings("input");
    const type = $input.attr("type") === "password" ? "text" : "password";
    $input.attr("type", type);
    $(this).toggleClass("ri-eye-line ri-eye-off-line");
  });

  // Navigate to login page
  $("#login").click(function () {
    window.location.href = "/index.html";
  });

  // Handle Enter key press
  $("input").keydown(function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      const $inputs = $("input");
      const nextInput = $inputs.get($inputs.index(this) + 1);
      if (nextInput) {
        nextInput.focus();
      }
    }
  });

  //Validations checks
  $("#studentId").attr({
    pattern: "\\d{10}",
    title: "Student ID must be a 10-digit number",
    required: true,
  });

  $("#name").attr("required", true);

  $("#email").attr({
    type: "email",
    required: true,
  });

  $("#dob").attr("required", true);

  $("#dob").on("blur", function () {
    //To Get Current Date
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    const dob = new Date(this.value);
    const dobYear = dob.getFullYear();
    console.log(dobYear);

    if (dobYear > currentYear) {
      this.value = currentDate.toISOString().split("T")[0];  
    }
    
    if(dobYear < 1900){
      this.value = "1900-01-01";
    } 
  });

  $("#password").attr({
    minlength: "8",
    required: true,
  });

  $("#password-confirm").attr("required", true);

  function applyBatchValidation() {
    const windowWidth = $(window).width();
    const $desktopSelect = $("#batchSelect");
    const $mobileSelect = $("#batchSelectMobile");

    if (windowWidth >= 992) {
      $desktopSelect
        .attr("required", true)
        .on("invalid", function () {
          this.setCustomValidity("Please select a batch from the list.");
        })
        .prop("disabled", false)
        .show();
      $mobileSelect.removeAttr("required").prop("disabled", true).hide();
    } else {
      $mobileSelect
        .attr("required", true)
        .on("invalid", function () {
          this.setCustomValidity("Please select a batch from the list.");
        })
        .prop("disabled", false)
        .show();
      $desktopSelect.removeAttr("required").prop("disabled", true).hide();
    }
  }

  applyBatchValidation();
  $(window).resize(applyBatchValidation);

  // Form submission
  $("#Register-form-01").submit(function (e) {
    e.preventDefault();

    if (this.checkValidity() && validatePasswords()) {
      const formData = {
        studentId: $("#studentId").val(),
        name: $("#name").val(),
        email: $("#email").val(),
        dob: $("#dob").val(),
        password: $("#password").val(),
        batch: $("#batchSelect").is(":visible")
          ? $("#batchSelect").val()
          : $("#batchSelectMobile").val(),
      };

      localStorage.setItem("registrationFormData", JSON.stringify(formData));
      window.location.href = "/pages/registrationForm2.html";
    } else {
      this.reportValidity();
    }
  });

  function validatePasswords() {
    const password = $("#password").val();
    const confirmPassword = $("#password-confirm").val();

    if (password !== confirmPassword) {
      $("#password-confirm")[0].setCustomValidity("Passwords do not match");
      return false;
    } else {
      $("#password-confirm")[0].setCustomValidity("");
      return true;
    }
  }

  // Add event listeners to clear custom validity
  $("#batchSelect").on("change", function () {
    this.setCustomValidity("");
  });

  $("#batchSelectMobile").on("change", function () {
    this.setCustomValidity("");
  });

  $("#password-confirm").on("input", function () {
    this.setCustomValidity("");
  });
});
