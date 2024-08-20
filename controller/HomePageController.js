$(document).ready(function () {
  changeButtonCss("home");
});

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
