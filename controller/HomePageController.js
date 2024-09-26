import { getUserData } from "../model/UserProfileModel.js";
import {
  getTokenValidation,
  getBirthdayNames,
} from "../model/HomePageModel.js";

$(document).ready(async function () {
  let jwtToken = getJwtToken();

  if (jwtToken) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${jwtToken}`;

    try {
      const response = await getTokenValidation();
      if (response.data === true) {
        try {
          const userData = await getUserData();
          setUserProfileDetails(userData.data);
          changeButtonCss("home");
          approveButtonVisibility(userData.data.role);

          // Fetch and display birthday names
          const birthdayResponse = await getBirthdayNames();
          updateBirthdaySection(birthdayResponse.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }

        loadHomePage();
      } else {
        document.cookie =
          "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "/index.html";
      }
    } catch (error) {
      document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      console.error("Token validation failed:", error);
      window.location.href = "/index.html";
    }
  } else {
    document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/index.html";
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

function setUserProfileDetails(user) {
  $(".profileDetails h4").text(user.name);
  $(".profileDetails h5").text(`@${user.userId}`);
  $(".profileDetails h6").text(user.bio);

  // Decode the Base64 strings and set the images
  if (user.profileImg) {
    const profilePicUrl = `data:image/png;base64,${user.profileImg}`;
    // Set profile image in the main profile section
    $(".profileImage img").attr("src", profilePicUrl).css({
      "border-radius": "50%",
      width: "63px",
      height: "63px",
      border: "2px solid #fff",
      "object-fit": "cover",
    });

    // Set profile image in the navbar
    $("#navBar .profile img").attr("src", profilePicUrl).css({
      "border-radius": "50%",
      width: "40px",
      height: "40px",
      "object-fit": "cover",
    });
  }

  if (user.coverImg) {
    const coverPicUrl = `data:image/png;base64,${user.coverImg}`;
    $(".banner img").attr("src", coverPicUrl).css({
      width: "100%",
      height: "103.25px",
      "border-radius": "15px 15px 0 0",
      "object-fit": "cover",
    });
  }
}

function approveButtonVisibility(role) {
  const approveButton = document.querySelector(".approveButton");
  if (role === "ADMIN") {
    approveButton.classList.remove("d-none");
  } else {
    approveButton.classList.add("d-none");
  }
}

function updateBirthdaySection(birthdays) {
  const birthdayText = $(".birthDays p");
  if (birthdays.length === 0) {
    birthdayText.text("No one has birthdays today");
  } else if (birthdays.length === 1) {
    birthdayText.text(`${birthdays[0]} has a birthday today`);
  } else if (birthdays.length === 2) {
    birthdayText.text(
      `${birthdays[0]} and ${birthdays[1]} have birthdays today`
    );
  } else {
    const moreCount = birthdays.length - 2;
    birthdayText.text(
      `${birthdays[0]}, ${birthdays[1]} +${moreCount} more have birthdays today`
    );
  }
}

function changeButtonCss(button) {
  const buttons = {
    home: "#homePage .homeButton ",
    post: "#homePage .myPostButton ",
    approve: "#homePage .approveButton ",
  };

  Object.values(buttons).forEach((selector) =>
    $(selector).removeClass("active")
  );

  if (buttons[button]) {
    $(buttons[button]).addClass("active");
  }
}

function loadHomePage() {
  $("#homePage .profile .myProfileBtn").click(function () {
    $("#homePage .homeWallComponent iframe")
      .attr("src", "../components/pages/wall/profileWallComponent.html")
      .css({
        "border-radius": "15px",
      });
    changeButtonCss("profile");
  });

  $("#navBar .profile").click(function () {
    $("#homePage .homeWallComponent iframe")
      .attr("src", "../components/pages/wall/profileWallComponent.html")
      .css({
        "border-radius": "15px",
        "box-shadow": "0px 4px 18.3px 0px rgba(0, 0, 0, 0.10)",
      });
    changeButtonCss("profile");
  });

  $("#homePage .homeButton").click(function () {
    $("#homePage .homeWallComponent iframe")
      .attr("src", "../components/pages/wall/homeWallComponent.html")
      .css({
        "border-radius": "0",
        "box-shadow": "none",
      });
    changeButtonCss("home");
  });

  $("#homePage .myPostButton").click(function () {
    $("#homePage .homeWallComponent iframe")
      .attr("src", "../components/pages/wall/myPostWallComponent.html")
      .css({
        "border-radius": "0",
        "box-shadow": "none",
      });
    changeButtonCss("post");
  });

  $("#homePage .approveButton").click(function () {
    $("#homePage .homeWallComponent iframe")
      .attr("src", "../components/pages/wall/adminApproveWallComponent.html")
      .css({
        "border-radius": "0",
        "box-shadow": "none",
      });
    changeButtonCss("approve");
  });

  $(".bottom-nav-bar .search-nav").click(function () {
    $("#homePage .homeWallComponent iframe")
      .attr("src", "/pages/searchPageMobile.html")
      .css({
        "border-radius": "0",
        "box-shadow": "none",
      });
  });

  $(".bottom-nav-bar .home-nav").click(function () {
    $("#homePage .homeWallComponent iframe")
      .attr("src", "/components/pages/wall/homeWallComponent.html")
      .css({
        "border-radius": "0",
        "box-shadow": "none",
      });
  });

  $(".bottom-nav-bar .profile-nav").click(function () {
    $("#homePage .homeWallComponent iframe")
      .attr("src", "/components/pages/wall/profileWallComponent.html")
      .css({
        "border-radius": "0",
        "box-shadow": "none",
      });
  });

  $(".bottom-nav-bar .myPost-nav").click(function () {
    $("#homePage .homeWallComponent iframe")
      .attr("src", "/components/pages/wall/myPostWallComponent.html")
      .css({
        "border-radius": "0",
        "box-shadow": "none",
      });
  });

  $("#navBar .notification").click(function () {
    $("#homePage .homeWallComponent iframe")
      .attr("src", "/pages/notificationPageMobile.html")
      .css({
        "border-radius": "0",
        "box-shadow": "none",
      });
  });

  $(".searchPopUp").click(function () {
    $(".searchPopUp").css("display", "none");
  });

  $("#navBar input").click(function () {
    $(".searchPopUp").css("display", "flex");
  });

  //  birthday popup

  let birthdaysCount = 0;

  $(".birthDays").click(function () {
    let birthdayPopup = $(".birthdayPopup");
    showBirthdayPopup(birthdayPopup[0]);
  });

  function showBirthdayPopup(birthdayPopup) {
    birthdayPopup.style.display = "block";
    let container = document.getElementById("birthday-container");
    if (container) {
      container.style.opacity = 1;
      container.style.transform = "scale(1)";
    }
  }

  $("#close-birthday-icon").click(function () {
    let birthdayPopup = $(".birthdayPopup");
    hideBirthdayPopup(birthdayPopup[0]);
  });

  function hideBirthdayPopup(birthdayPopup) {
    let container = document.getElementById("birthday-container");
    if (container) {
      container.style.opacity = 0;
      container.style.transform = "scale(0)";
    }
    setTimeout(() => {
      birthdayPopup.style.display = "none";
    }, 300);
  }

  const DesktopBirthdayCard = () => {
    return `
      <style>
        @media (max-width: 1158px) {
          .birthday-card-name, .birthday-card-role {
            font-size: 12px !important;
          }
        }
      </style>
      <div class="row align-items-center mb-2 me-4">
        <div class="col-auto d-flex align-items-center">
          <img class="rounded-circle img-fluid" src="/assets/image/defaultProfileImage.png" alt="Profile Image" style="max-width: 50px;">
        </div>
        <div class="col d-flex justify-content-between align-items-center">
          <div class="d-flex flex-column flex-md-row">
            <p class="birthday-card-name mb-0 text-muted fs-6 fw-semibold">Mark Simoen Edward</p>
          </div>
          <p class="birthday-card-role mb-0 ms-3 text-muted fs-6 fw-semibold">GDSE 68</p>
        </div>
      </div>
    `;
  };

  for (let i = 0; i < 10; i++) {
    $("#birthday-list").append(DesktopBirthdayCard());
    birthdaysCount++;
  }

  $("#birthday-txt").text(
    birthdaysCount + " friends have birthdays today. Send them good thoughts"
  );

  // bottom nav bar mobile start
  const clickableElements = document.querySelectorAll(".clickable-element");

  clickableElements.forEach(function (element) {
    element.addEventListener("click", function () {
      // Remove red border from all elements
      clickableElements.forEach(function (el) {
        el.classList.remove("red-border-bottom");
      });
      // Add red border only to the clicked element
      this.classList.add("red-border-bottom");
    });
  });
  // bottom nav bar mobile end
}
