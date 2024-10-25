import { getUserData } from "../model/UserProfileModel.js";
import { getNotifications } from "../model/NotificationModel.js";
import {
  getTokenValidation,
  getBirthdayNames,
  getBirthdayData,
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
          setNotificationData(userData.data);

          // Fetch and display birthday names
          const birthdayResponse = await getBirthdayNames();
          updateBirthdaySection(birthdayResponse.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }

        loadHomePage();
      } else letTokenToExpire();
    } catch (error) {
      console.error("Token validation failed:", error);
      letTokenToExpire();
    }
  } else letTokenToExpire();
});

function letTokenToExpire() {
  document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  window.location.href = "/index.html";
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
    if (window.innerWidth < 991) {
      $("#homePage .homeWallComponent iframe").attr(
        "src",
        "mobileHomePage.html"
      );
      $(".bottom-nav-bar .home-nav").addClass("red-border-bottom");
    }

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
      .attr("src", "mobileHomePage.html")
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

  //  ------------ birthday popup ------------
  $(document).on("click", function (event) {
    if (!$(event.target).closest("#birthday-container, .birthDays").length) {
      hideBirthdayPopup();
    }
  });

  $(".birthDays").click(function () {
    showBirthdayPopup();
  });

  function showBirthdayPopup() {
    $("#birthday-list").empty();
    retriveBirthdayData();
    $(".birthdayPopup").show();
    $("#birthday-container").css({
      opacity: 1,
      transform: "scale(1)",
    });
  }

  const retriveBirthdayData = async () => {
    const birthdayData = await getBirthdayData();
    if (birthdayData.data.length > 0) {
      setBirthdayData(birthdayData.data);
    }
  };

  $("#close-birthday-icon").click(function () {
    hideBirthdayPopup();
  });

  function hideBirthdayPopup() {
    var $container = $("#birthday-container");
    $container.css({
      opacity: 0,
      transform: "scale(0)",
    });

    setTimeout(function () {
      $(".birthdayPopup").hide();
    }, 300);
  }

  const setBirthdayData = (birthdayData) => {
    for (let i = 0; i < birthdayData.length; i++) {
      $("#birthday-list").append(DesktopBirthdayCard(birthdayData[i]));
    }

    if (birthdayData.length === 1) {
      $("#birthday-txt").text(
        "1 friend has a birthday today. Send them good thoughts"
      );
    } else {
      $("#birthday-txt").text(
        birthdayData.length +
          " friends have birthdays today. Send them good thoughts"
      );
    }
  };

  const DesktopBirthdayCard = (user) => {
    const profileImage = user.profileImg
      ? `data:image/png;base64,${user.profileImg}`
      : "/assets/image/profilePic.png";

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
          <img class="profile-img img-fluid" src="${profileImage}" alt="Profile Image">
        </div>
        <div class="col d-flex justify-content-between align-items-center">
          <div class="d-flex flex-column flex-md-row">
            <p class="birthday-card-name mb-0 text-muted fs-6 fw-semibold">${user.name}</p>
          </div>
          <p class="birthday-card-role mb-0 ms-3 text-muted fs-6 fw-semibold">${user.batch}</p>
        </div>
      </div>
    `;
  };

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

async function setNotificationData(user) {
  try {
    const notificationData = await getNotifications(user.userId);
    if (notificationData.length === 0) {
      $("#notifications").html(
        "<div class='container mt-1' style='font-size:14px ; color:#797979'>You haven't any notifications</div>"
      );
    } else {
      setNotifications(notificationData);
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}

function setNotifications(notificationData) {
  for (let notification of notificationData) {
    let notificationElement = createNotificationElement(notification);
    $("#notifications").append(notificationElement);
  }
}

function createNotificationElement(notification) {
  let notificationIcon = $("<img>");
  notificationIcon.css("object-fit", "cover");
  if (notification.type === "APPROVED") {
    notificationIcon
      .attr("src", "/assets/icons/notificationIcon/approved.png")
      .attr("alt", "Post Approved Icon");
  } else if (notification.type === "upgrade") {
    notificationIcon
      .attr("src", "/assets/icons/notificationIcon/system_update.png")
      .attr("alt", "System Update Icon");
  } else if (notification.type === "deleted") {
    notificationIcon
      .attr("src", "/assets/icons/notificationIcon/deleted.png")
      .attr("alt", "Post Deleted Icon");
  } else if (notification.type === "inspirations") {
    notificationIcon
      .attr("src", "/assets/icons/notificationIcon/inspiration.png")
      .attr("alt", "Inspiration Icon");
  } else if (notification.type === "pendingApproval") {
  } else if (notification.type === "friendRequestRejected") {
  } else {
  }

  let notificationElement = $("<button>")
    .addClass("border-0 py-3")
    .css("box-shadow", " 0 4px 18.3px 0 rgba(0, 0, 0, 0.05)");
  let notificationText = $("<span>")
    .text(notification.content)
    .css("font-size", "13px");
  notificationElement.append(notificationIcon, notificationText);
  return $("<div>").addClass("notification mb-2").append(notificationElement);
}

$(".bottom-nav-bar .add-btn").click(function () {
  const iframe = $("#homePage .homeWallComponent iframe")[0];

  if (iframe) {
    try {
      var iframeContent = iframe.contentWindow || iframe.contentDocument;
      if (iframeContent && iframeContent.document) {
        iframeContent.scrollTo(0, 0);

        const inputGroup = iframeContent.document.querySelector(".input-group");

        if (inputGroup) {
          $(inputGroup).css("border", "2px solid #ff9191");

          $(iframeContent).on("scroll", function () {
            if (iframeContent.scrollY > 0) {
              $(inputGroup).css("border", "none");
            }
          });
        } else {
          console.error("Input group not found inside the iframe.");
        }
      } else {
        throw new Error("Iframe content is not accessible.");
      }
    } catch (e) {
      console.error(e.message);
      Toastify({
        text: "Could not access iframe content due to security restrictions.",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#ff0000",
        close: true,
        stopOnFocus: true,
      }).showToast();
    }
  } else {
    Toastify({
      text: "Iframe not found.",
      duration: 3000,
      gravity: "top",
      position: "right",
      backgroundColor: "#ff0000",
      close: true,
      stopOnFocus: true,
    }).showToast();
  }
});
