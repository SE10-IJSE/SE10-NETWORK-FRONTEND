import { getFriendData  } from "../../../model/UserProfileModel.js";
import {getAllFriendPosts} from "../../../model/PostCardModel.js";
import { saveInspiration,deleteInspiration } from "../../../model/InspireModel.js";

let currentPage = 0;
let isLoading = false;
let hasMorePosts = true;
let lastScrollPosition = 0;
let friendUserName = '';


$(document).ready(async function () {
  const token = getJwtToken()
  const selectedFriendEmail = localStorage.getItem('selectedFriendEmail');
  friendUserName = selectedFriendEmail;
 
  let userData;
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    try {
      userData = await getFriendData(friendUserName);
      if (userData) {
        // Populate profile info
        $(".profile-info h1").text(userData.data.name);
        $(".profile-info h3").text(`@${userData.data.batch}`);
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

        LoadCards();
        $(window).resize(function () {
          LoadCards();
        });

        // Scroll event listener to load more data when reaching the bottom
        $(window).on("scroll", function () {
          const currentScrollPosition = $(this).scrollTop();
          const totalScrollableHeight =
            $(document).height() - $(window).height();
          const scrollPercentage =
            (currentScrollPosition / totalScrollableHeight) * 100;

          // Check if user has scrolled 70% of the page and is scrolling down
          if (
            scrollPercentage >= 70 &&
            currentScrollPosition > lastScrollPosition
          ) {
            if (!isLoading && hasMorePosts) {
              LoadCards(); // Load next page when scrolled to the bottom
            }
          }
          lastScrollPosition = currentScrollPosition; // Update last scroll position
        });
      }
    } catch (error) {
      showNotFoundPage()
      console.error("Error fetching data:", error);
    }
  } else {
    console.error("User token not found in cookie");
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

async function LoadCards() {
  if (isLoading) return; // Prevent multiple calls
  isLoading = true;

  const isMobile = window.innerWidth <= 767;

  try {
    const response = await getAllFriendPosts(currentPage,friendUserName);
    const posts = response.data;

    posts.forEach((post) => {
      const postHtml = isMobile ? PostCardMobile(post) : MyPostCard(post);
      $("#myPostWallComponent").append(postHtml);
    });
    $(".postMoreOption").css("display", "none");
    currentPage++;


    // Adding the Inspire Button Logic
    $(document).on("click", ".inspire-btn", function () {
      const button = $(this);
      const postId = button.data("post-id");
      const inspirationCountElement = button
        .closest("div")
        .find(".inspiration-count");
      let currentCount = parseInt(
        inspirationCountElement.text().split(" ")[0],
        10
      );

      // Check the current background color to determine if it's inspired
      if (
        button.css("background-color") === "rgba(0, 0, 0, 0)" ||
        button.css("background-color") === "transparent"
      ) {
        // Call saveInspiration and change the button color
        saveInspiration({ postId: postId })
          .then(() => {
            button.css("background-color", "#57AFF68F");
            currentCount++;
            inspirationCountElement.text(`${currentCount} Inspirations`);
          })
          .catch((error) => {
            console.error("Error saving inspiration:", error);
          });
      } else {
        // Call deleteInspiration and change the button color back to transparent
        deleteInspiration(postId)
          .then(() => {
            button.css("background-color", "transparent");
            currentCount--;
            inspirationCountElement.text(`${currentCount} Inspirations`);
          })
          .catch((error) => {
            console.error("Error deleting inspiration:", error);
          });
      }
    });
    
  } catch (error) {
    hasMorePosts = false;
    console.error("Error loading posts:", error);
  }

  isLoading = false; // Reset the loading state
}

let flag = false;

$("#myPostWallComponent").on("click", ".postMore", function () {
  $("#myPostWallComponent .postMoreOption").hide();
  if (flag === false) {
    $(this)
      .closest(".postCard")
      .find(".postMoreOption")
      .css("display", "block");
    $(this)
      .closest("#postCardMobile")
      .find(".postMoreOption")
      .css("display", "block");
    flag = true;
  } else {
    $(".postMoreOption").css("display", "none");
    flag = false;
  }
});

$("#myPostWallComponent").on("click", ".postMoreOption", function () {
  $(".postMoreOption").css("display", "none");
});

const MyPostCard = (post) => {
  const profileImage = post.profileImg
    ? `data:image/png;base64,${post.profileImg}`
    : "/assets/image/profilePic.png";
  return `
        <div id="postCard" class="p-5 mb-3 rounded-4">
            <div>
                <div class="d-flex justify-content-between">
                    <div class="d-flex gap-3 align-items-center">
                        <img class="profileImage" src="${profileImage}" alt="Profile Image">
                        <div class="d-flex flex-column">
                            <h5 class="m-0">${post.userName}</h5>
                            <h6>${formatTime(post.updatedAt)}</h6>
                        </div>
                    </div>
                </div>
                <div class="px-3 mx-5 mt-2">
                    <p>${post.content}</p>
                    <div class="d-flex justify-content-between">
                        <div class="d-flex gap-3 align-items-center">
                            <img src="../../../assets/icons/likeIcon.png" alt="Inspire Icon">
                            <span class="inspiration-count">${
                              post.inspirationCount
                            } Inspirations</span>
                        </div>
                        <button class="border-0 p-2 px-3 rounded-4 d-flex align-items-center gap-2 inspire-btn" 
                            style="background-color: ${
                              post.inspired ? "#57AFF68F" : "transparent"
                            };" data-post-id="${post.postId}">
                            <img src="../../../assets/icons/ideaIcon.png" alt="Inspire Icon">
                            <span>Inspire</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
      `;
};

const PostCardMobile = (post) => {
  const profileImage = post.profileImg
    ? `data:image/png;base64,${post.profileImg}`
    : "/assets/image/profilePic.png";
  return `
        <div id="postCardMobile" class="p-3 mb-3">
            <div>
                <div class="d-flex justify-content-between">
                    <div class="d-flex gap-3 align-items-center">
                        <img class="profileImage" src="${profileImage}" alt="Profile Image">
                        <div class="d-flex flex-column mt-1">
                            <h5>${post.userName}</h5>
                            <h6>${formatTime(post.updatedAt)}</h6>
                        </div>
                    </div>
                </div>
                <div class="mt-3">
                    <p>${post.content}</p>
                    <div class="d-flex justify-content-between">
                        <div class="d-flex gap-1 align-items-center">
                            <img src="../../../assets/icons/likeIcon.png" alt="Inspire Icon">
                            <span class="inspiration-count">${
                              post.inspirationCount
                            } Inspirations</span>
                        </div>
                        <button class="border-0 p-2 px-3 rounded-4 d-flex align-items-center gap-1 inspire-btn"
                            style="background-color: ${
                              post.inspired ? "#57AFF68F" : "transparent"
                            };" data-post-id="${post.postId}">
                            <img src="../../../assets/icons/ideaIcon.png" alt="Inspire Icon">
                            <span>Inspire</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
      `;
};


function showNotFoundPage() {
    document.body.innerHTML = `
    <div class="container text-center my-5">
      <div class="row w-100 text-center">
        <!-- Content Section -->
        <div class="col-lg-6 d-flex align-items-center order-lg-1 order-2">
          <div class="content-container p-4 mx-auto">
            <h1 class="display-1 fw-bolder">404</h1>
            <h3 class="mb-3 fw-bolder">Page Not Found!</h3>
            <p class="lead fw-semibold">
              It looks like the page you're trying to reach doesn't
              <br />
              exist or has been moved.
            </p>
  
          </div>
        </div>
        <!-- Image Section -->
        <div class="col-lg-6 d-flex align-items-center justify-content-center order-lg-2 order-1">
          <img
            src="/assets/image/Error404pageImage.png"
            alt="Error 404"
            class="img-fluid responsive-image"
          />
        </div>
      </div>
    </div>`;
  }
  

function formatTime(timestamp) {
  const date = new Date(timestamp);
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return date.toLocaleDateString("en-US", options);
}
