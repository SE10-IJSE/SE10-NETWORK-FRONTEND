import { getBirthdayData } from "../model/HomePageModel.js";

$(document).ready(function () {
  const jwtToken = getJwtToken();

  if (jwtToken) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${jwtToken}`;

    retriveBirthdayData();

    $(document).on("click", "#Notifications .subtitle", function () {
      const subtitleText = $(this).text().trim();
      const iframe = $("#homePage .homeWallComponent iframe");

      if (subtitleText === "Birthdays") {
        $(parent.document)
          .find("#homePage .homeWallComponent iframe")
          .attr("src", "/pages/birthdayPageMobile.html");
      } else {
        $(parent.document)
          .find("#homePage .homeWallComponent iframe")
          .attr("src", "/pages/notificationPageMobile.html");
      }

      iframe.css({
        "border-radius": "0",
        "box-shadow": "none",
      });
    });
  } else console.error("User token not found in cookies");
});

const retriveBirthdayData = async () => {
  const birthdayData = await getBirthdayData();
  if (birthdayData.data.length > 0) {
    setBirthdayData(birthdayData.data);
  }
};

const setBirthdayData = (birthdayData) => {
  for (let i = 0; i < birthdayData.length; i++) {
    $("#birthday-list").append(BirthdayCard(birthdayData[i]));
  }
};

const BirthdayCard = (user) => {
  const profileImage = user.profileImg
    ? `data:image/png;base64,${user.profileImg}`
    : "/assets/image/profilePic.png";

  return `
    <li>
      <div class="birthdays">
        <div class="birthday-item">
          <div class="profilepic-container">
            <img class="profilepic" src="${profileImage}" alt="Profile Image" />
            <div class="text">
              <p class="username">${user.name}</p>
            </div>
          </div>
          <div class="batch-number text">
            <p>${user.batch}</p>
          </div>
        </div>
      </div>
    </li> 
  `;
};

function getJwtToken() {
  const cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    if (cookie.startsWith("jwt=")) {
      return cookie.split("=")[1];
    }
  }
  return null;
}
