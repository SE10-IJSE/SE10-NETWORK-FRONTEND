import { getNotifications } from "../model/NotificationModel.js";
import { getUserData } from "../model/UserProfileModel.js";
import { getTokenValidation } from "../model/HomePageModel.js";

$(document).ready(async function () {
  let jwtToken = getJwtToken();

  if (jwtToken) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${jwtToken}`;

    try {
      const response = await getTokenValidation();
      if (response.data === true) {
        try {
          const userData = await getUserData();
          setNotificationData(userData.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
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

async function setNotificationData(user) {
  try {
    const notificationData = await getNotifications(user.userId);
    if (notificationData.length === 0) {
      $(".recent-list").html(
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
    $(".recent-list").append(notificationElement);
  }
}

function createNotificationElement(notification) {
  let notificationIcon = $("<img>");
  notificationIcon.addClass("avatar");
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

  let imageElement = $("<div>")
    .addClass("avatar d-flex justify-content-center")
    .append(notificationIcon);

  let notificationText = $("<div>")
    .addClass("text")
    .append($("<p>").css("font-size", "11px").text(notification.content));
  let notificationElement = $("<div>")
    .addClass("notification")
    .append(
      $("<div>")
        .addClass("notification-item border-0")
        .append(imageElement, notificationText)
    );

  return $("<li>")
    .addClass("notification")
    .append(notificationElement)
    .css("box-shadow", "0 4px 18.3px 0 rgba(0, 0, 0, 0.05)");
}
