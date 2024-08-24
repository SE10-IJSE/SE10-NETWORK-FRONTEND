import { getUserData } from "../model/UserProfileModel.js";

$(document).ready(async function () {
  let token = getJwtToken();

  if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  try {
    const userData = await getUserData(); // Fetch user data

    // Update the homePage HTML with user data
    setUserProfileDetails(userData.data);
    changeButtonCss("home");
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
});

function setUserProfileDetails(user) {
  $(".profileDetails h4").text(user.name);
  $(".profileDetails h5").text(`@${user.userId}`);
  $(".profileDetails h6").text(user.bio);
}

function getJwtToken() {
  const cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    if (cookie.startsWith("jwt=")) {
      return cookie.split("=")[1];
    }
  }
  return null;
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

$(".bottom-nav-bar .myPost-nav").click(function () {
  $("#homePage .homeWallComponent iframe")
      .attr("src", "/components/pages/wall/myPostWallComponent.html")
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
