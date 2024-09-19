import { savePost, getAllPosts } from "../../../model/PostCardModel.js";
import { getUserProfilePhoto } from "../../../model/UserProfileModel.js";
import {
  saveInspiration,
  deleteInspiration,
} from "../../../model/InspireModel.js";

let currentPage = 0;
let isLoading = false; // To prevent multiple calls during loading
let hasMorePosts = true; // Flag to stop loading when no more data
let lastScrollPosition = 0; // To track the last scroll position

$(document).ready(function () {
  const token = getJwtToken();

  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setProfileDetails();

    // Load initial cards and set up resize handler
    LoadCards();
    $(window).resize(function () {
      LoadCards();
    });

    // Scroll event listener to load more data when reaching the bottom
    $(window).on("scroll", function () {
      const currentScrollPosition = $(this).scrollTop();
      const totalScrollableHeight = $(document).height() - $(window).height();
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

    // Add event listener for the send post button
    $("#createPostWeb #addon-wrapping, #createPostMobile #addon-wrapping").on(
      "click",
      function () {
        handleSavePost();
      }
    );

    // Add event listener for pressing Enter to trigger savePost
    $("#createPostWeb input, #createPostMobile input").on(
      "keypress",
      function (e) {
        if (e.which === 13) {
          handleSavePost();
        }
      }
    );
  } else {
    console.error("JWT token not found in cookies");
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

function setProfileDetails() {
  getUserProfilePhoto()
    .then((profilePhoto) => {
      if (profilePhoto) {
        $(".card-body .profile-img").attr(
          "src",
          `data:image/png;base64,${profilePhoto}`
        );
      } else {
        console.error("Profile picture not found in user data.");
      }
    })
    .catch((error) => {
      console.error("Error fetching profile picture:", error);
    });
}

// Function to save post content
function handleSavePost() {
  const postContentWeb = $("#createPostWeb input").val().trim();
  const postContentMobile = $("#createPostMobile input").val().trim();

  //Validations
  if (!(postContentWeb || postContentMobile)) {
    $("#createPostWeb input, #createPostMobile input")[0].setCustomValidity(
      "Post cannot be empty"
    );
    $("#createPostWeb input, #createPostMobile input")[0].reportValidity();
  } else if (postContentWeb.length > 280 || postContentMobile.length > 280) {
    $("#createPostWeb input, #createPostMobile input")[0].setCustomValidity(
      "Post must not exceed 280 characters"
    );
    $("#createPostWeb input, #createPostMobile input")[0].reportValidity();
  } else {
    // Clear any previous validation messages
    $("#createPostWeb input, #createPostMobile input")[0].setCustomValidity("");

    if (postContentWeb) {
      savePost({ content: postContentWeb }).then(() => {
        $("#createPostWeb input")
          .val("")
          .attr("placeholder", "What's on your mind?");
      });
    } else if (postContentMobile) {
      savePost({ content: postContentMobile }).then(() => {
        $("#createPostMobile input")
          .val("")
          .attr("placeholder", "What's on your mind?");
      });
    } else {
      console.error("Post content is empty.");
    }
  }
}

async function LoadCards() {
  if (isLoading) return; // Prevent multiple calls
  isLoading = true;

  const isMobile = window.innerWidth <= 767;

  try {
    const response = await getAllPosts(currentPage);
    const posts = response.data;

    posts.forEach((post) => {
      const postHtml = isMobile ? PostCardMobile(post) : PostCard(post);
      $("#homeWallComponent").append(postHtml);
    });
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

const PostCard = (post) => {
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
