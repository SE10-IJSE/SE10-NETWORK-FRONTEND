import { getUserData } from "../../../model/UserProfileModel.js";

$(document).ready(async function () {
  const token = getJwtToken();
  let userData;

  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      userData = await getUserData();
      if (userData) {
        // Populate profile info
        $(".profile-info h1").text(userData.data.name);
        $(".profile-info h3").text(`@${userData.data.userId}`);
        $(".profile-info h4").text(userData.data.bio);

        // Set cover photo
        const coverPhotoElement = $(".profile-banner img");
        if (userData.data.coverImg) {
          coverPhotoElement.attr(
            "src",
            `data:image/jpeg;base64,${userData.data.coverImg}`
          );
        }

        // Set profile photo
        const profilePicElement = $(".profile-pic");
        if (userData.data.profileImg) {
          profilePicElement.attr(
            "src",
            `data:image/jpeg;base64,${userData.data.profileImg}`
          );
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  } else {
    console.error("User token not found in local storage");
  }
  LoadCards();
  $(window).resize(function () {
    LoadCards();
  });
  $(".postMoreOption").css("display", "none");
});

function LoadCards() {
  $("#myPostWallComponent .postCards").empty();
  const isMobile = window.innerWidth <= 767;
  for (let i = 0; i < 10; i++) {
    if (isMobile) {
      $("#myPostWallComponent").append(PostCardMobile());
    } else {
      $("#myPostWallComponent").append(MyPostCard());
    }
  }
}

var flag = false;

$("#myPostWallComponent").on("click", ".postMore", function () {
  $("#myPostWallComponent .postMoreOption").hide();
  if (flag === false) {
    $(this)
      .closest(".postCard")
      .find(".postMoreOption")
      .css("display", "block");
    flag = true;
  } else {
    $(this).closest(".postCard").find(".postMoreOption").css("display", "none");
    flag = false;
  }
});

const MyPostCard = () => {
  return `
    <div class="p-5 mb-3 postCard" id="postCard">
        <div class="list-group postMoreOption">
            <a href="#" class="list-group-item list-group-item-action d-flex align-items-center postInfoPopup ">
                <img src="/assets/icons/info.png"> <div class="option">Post Info</div>
            </a>
            <a href="#" class="list-group-item list-group-item-action d-flex align-items-center">
                <img src="/assets/icons/delete.png"> <div class="option">Delete Post</div>
            </a>
        </div>
        <div>
            <div class="d-flex justify-content-between">
                <div class="d-flex gap-3 align-items-center">
                    <img class="profileImage" src="../../../assets/image/profilePic.png" alt="Profile Image" style="border: 2px solid #04FF00;">
                    <div class="d-flex flex-column">
                        <h5 class="m-0">Abrahum Joe</h5>
                        <h6>7 hours ago</h6>
                    </div>
                </div>
                <button class="bg-transparent border-0 postMore">
                    <img src="../../../assets/icons/moreIcon.png" alt="More Icon">
                </button>
            </div>
            <div class="px-3 mx-5 mt-2">
                <p>🤖 Revolutionizing tech, one innovation at a time. #TechTrends #Innovation </p>
                <div class="d-flex justify-content-between">
                    <div class="d-flex gap-3 align-items-center">
                        <img src="../../../assets/icons/likeIcon.png" alt="Inspire Icon">
                        <span>56 Insights</span>
                    </div>
                    <div class="ms-md-auto mt-3 mt-md-0">
                        <button type="button" class="btn btn-light fw-bold" id="edit-info-btn">
                            <img src="../../../assets/icons/editIcon.png" alt="Inspire Icon"> Edit Post
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
};

const PostCardMobile = () => {
  return `
    <div id="postCardMobile" class="p-3 mb-3">
            <div>
                <div class="d-flex justify-content-between">
                    <div class="d-flex gap-3 align-items-center">
                        <img class="profileImage" src="../../../assets/image/profilePic.png" alt="Profile Image" style="border: 2px solid #04FF00; ">
                        <div class="d-flex flex-column mt-1">
                            <h5 >Abrahum Joe</h5>
                            <h6>7 hours ago</h6>
                        </div>
                    </div>
                    <button class="bg-transparent border-0">
                        <i class='bx bx-dots-vertical-rounded' style='color:rgba(0,0,0,0.44)'  ></i>
                    </button>
                </div>

                <div class="mt-3">
                    <p>🤖 Revolutionizing tech, one innovation at a time. #TechTrends #Innovation </p>
                    <div class="d-flex justify-content-between">
                        <div class="d-flex gap-1 align-items-center">
                            <img src="../../../assets/icons/likeIcon.png" alt="Inspire Icon">
                            <span>56 Insights</span>
                        </div>
                        
                        <button class="border-0 p-2 px-3 d-flex align-items-center gap-1 btn btn-light fw-bold" id="edit-info-btn ">
                            <img src="../../../assets/icons/editIcon.png" alt="Inspire Icon">
                            <span>Edit Post</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
};

// ---------------------------post-info-popup---------------------------------------
$("#myPostWallComponent").on("click", ".postInfoPopup", function () {
  showModal();
});

$("#cancelInfo").on("click", closeModal);

function showModal() {
  $("#popupModal").css("display", "flex");
  setTimeout(function () {
    $("#popupModal").addClass("active");
  }, 10);
}

function closeModal() {
  $("#popupModal").removeClass("active");
  setTimeout(function () {
    $("#popupModal").css("display", "none");
  }, 300);
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
