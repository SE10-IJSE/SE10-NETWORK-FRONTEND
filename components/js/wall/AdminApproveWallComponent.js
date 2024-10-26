import { savePost } from "../../../model/PostCardModel.js";
import { getUserProfilePhoto } from "../../../model/UserProfileModel.js";
import {
  getUnapprovedPosts,
  approveOrDeclinePost,
} from "../../../model/PostCardModel.js";

let currentPage = 0;
let isLoading = false;
let hasMorePosts = true;
let lastScrollPosition = 0;

$(document).ready(function () {
  const token = getJwtToken();
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setProfileDetails();

    LoadCards();

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
    $("#createPostWeb #addon-wrapping").on("click", function () {
      handleSavePost();
    });

    // Add event listener for pressing Enter to trigger savePost
    $("#createPostWeb input").on("keypress", function (e) {
      if (e.which === 13) {
        handleSavePost();
      }
    });
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

  if (postContentWeb) {
    savePost({ content: postContentWeb }).then(() => {
      $("#createPostWeb input")
        .val("")
        .attr("placeholder", "What's on your mind?");
    });
  } else {
    console.error("Post content is empty.");
  }
}

async function LoadCards() {
  if (isLoading) return; // Prevent multiple calls
  isLoading = true;

  try {
    const response = await getUnapprovedPosts(currentPage);
    const posts = response.data;

    posts.forEach((post) => {
      const postHtml = PostCard(post);
      $("#homeWallComponent").append(postHtml);
    });
    currentPage++;
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

  // Create post HTML structure
  const postHtml = `
      <div id="postCard" class="p-5 mb-4">
        <div>
          <div id="post-card" class="d-flex justify-content-between">
            <div class="d-flex gap-3 align-items-center">
              <img class="profileImage" src="${profileImage}" alt="Profile Image">
              <div id="text-logo" class="d-flex flex-column">
                <h5 class="m-0">${post.userName}</h5>
                <h6>${formatTime(post.updatedAt)}</h6>
              </div>
            </div>
          </div>
          <div class="content px-1 mx-lg-5 mt-3">
            <p>${post.content}</p>
          </div>
          <div class="actions d-flex justify-content-end gap-3">
            <button id="decline-${
              post.postId
            }" class="border-0 p-2 px-2 rounded-4 d-flex align-items-center gap-1 decline-post">
                <img src="../../../assets/icons/decline_dark.png" alt="Decline Icon">
                <span>Decline</span>
            </button>
            <button id="approve-${
              post.postId
            }" class="border-0 p-2 px-2 rounded-4 d-flex align-items-center gap-1 approve-post">
                <img src="../../../assets/icons/approve-dark.png" alt="Approve Icon">
                <span>Approve</span>
            </button>
          </div>
        </div>
      </div>
    `;

  $("#homeWallComponent").append(postHtml);

  // Attach event listeners for approve and decline buttons
  $(`#approve-${post.postId}`).on("click", function () {
    handleApproveOrDecline(post.postId, "APPROVED");
  });

  $(`#decline-${post.postId}`).on("click", function () {
    handleApproveOrDecline(post.postId, "DECLINED");
  });
};

// Handle post approval/decline
function handleApproveOrDecline(postId, status) {
  approveOrDeclinePost(postId, status)
    .then(() => {
      // Refresh the page or re-load the posts after the action
      $("#homeWallComponent").empty();
      currentPage = 0;
      window.location.reload();
    })
    .catch((error) => {
      console.error(`Error updating post status to ${status}:`, error);
    });
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
