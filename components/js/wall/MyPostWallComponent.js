import { getUserData } from "../../../model/UserProfileModel.js";
import {
  getAllPostsOfUser,
  deletePost,
  updatePost,
} from "../../../model/PostCardModel.js";

let currentPage = 0;
let isLoading = false;
let hasMorePosts = true;
let lastScrollPosition = 0;

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
    const response = await getAllPostsOfUser(currentPage);
    const posts = response.data;

    posts.forEach((post) => {
      const postHtml = isMobile ? PostCardMobile(post) : MyPostCard(post);
      $("#myPostWallComponent").append(postHtml);
    });
    $(".postMoreOption").css("display", "none");
    currentPage++;
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
    <div class="p-5 mb-3 postCard" id="postCard" data-post='${JSON.stringify(
      post
    )}'>
        <div class="postMoreOption position-absolute w-100 h-100">
          <div class="list-group">
                <a href="#" class="list-group-item list-group-item-action d-flex align-items-center postInfoPopup ">
                    <img src="/assets/icons/info.png"> <div class="option">Post Info</div>
                </a>
                <a href="#" class="list-group-item list-group-item-action d-flex align-items-center postDeletePopup">
                    <img src="/assets/icons/delete.png"> <div class="option">Delete Post</div>
                </a>
            </div>
        </div>
        <div>
            <div class="d-flex justify-content-between">
                <div class="d-flex gap-3 align-items-center">
                    <img class="profileImage" src="${profileImage}" alt="Profile Image" style="border: 2px solid #c0c0c0;">
                    <div class="d-flex flex-column">
                        <h5 class="m-0">${post.userName}</h5>
                        <h6>${formatTime(post.updatedAt)}</h6>
                    </div>
                </div>
                <button class="bg-transparent border-0 postMore">
                    <img src="../../../assets/icons/moreIcon.png" alt="More Icon" class = "postMoreIcon">
                </button>
            </div>
            <div class="mt-2" id="postCardContent">
                <p>${post.content}</p>
                <div class="d-flex justify-content-between">
                    <div class="d-flex gap-3 align-items-center">
                        <img src="../../../assets/icons/likeIcon.png" alt="Inspire Icon">
                        <span class="inspiration-count">${
                          post.inspirationCount
                        } Inspirations</span>
                    </div>
                    <div class="ms-md-auto mt-3 mt-md-0">
                        <button type="button" class="btn btn-light fw-bold edit-post-btn" id="edit-info-btn" data-mode="edit">
                            <img src="../../../assets/icons/editIcon.png" alt="Inspire Icon">
                            <span>Edit Post</span>
                        </button>
                    </div>
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
    <div id="postCardMobile" class="p-3 mb-3" data-post='${JSON.stringify(
      post
    )}'>
        <div class="postMoreOption position-absolute w-100 h-100">
          <div class="list-group">
                <a href="#" class="list-group-item list-group-item-action d-flex align-items-center postInfoPopup ">
                    <img src="/assets/icons/info.png"> <div class="option">Post Info</div>
                </a>
                <a href="#" class="list-group-item list-group-item-action d-flex align-items-center postDeletePopup">
                    <img src="/assets/icons/delete.png"> <div class="option">Delete Post</div>
                </a>
            </div>
        </div>
            <div>
                <div class="d-flex justify-content-between">
                    <div class="d-flex gap-3 align-items-center">
                        <img class="profileImage" src="${profileImage}" alt="Profile Image" style="border: 2px solid #c0c0c0; ">
                        <div class="d-flex flex-column mt-1">
                            <h5>${post.userName}</h5>
                            <h6>${formatTime(post.updatedAt)}</h6>
                        </div>
                    </div>
                    <button class="bg-transparent border-0 postMore">
                        <i class='bx bx-dots-vertical-rounded' style='color:rgba(0,0,0,0.44)'></i>
                    </button>
                </div>

                <div class="pe-1 mx-1 mt-2">
                    <p>${post.content}</p>
                    <div class="d-flex justify-content-between">
                        <div class="d-flex gap-3 align-items-center">
                            <img src="../../../assets/icons/likeIcon.png" alt="Inspire Icon">
                            <span class="inspiration-count">${
                              post.inspirationCount
                            } Inspirations</span>
                            </div>
                        <div class="ms-md-auto mt-3 mt-md-0">
                            <button type="button" class="btn btn-light fw-bold edit-post-btn" id="edit-info-btn" data-mode="edit">
                                <img src="../../../assets/icons/editIcon.png" alt="Edit Image">
                                <span>Edit Post</span>
                            </button>
                        </div>
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

// Toggle edit mode for post content
$("#myPostWallComponent").on("click", ".edit-post-btn", async function () {
  let postCard;
  if (window.innerWidth <= 767) {
    postCard = $(this).closest("#postCardMobile");
  } else {
    postCard = $(this).closest(".postCard");
  }
  const postContentElement = postCard.find("p");
  const editBtn = $(this);
  const mode = editBtn.data("mode");

  if (mode === "edit") {
    // Switch to input mode
    const currentContent = postContentElement.text();
    const inputField = `<input type="text" class="edit-input form-control mb-1" value="${currentContent}" data-original-content="${currentContent}" />`;

    postContentElement.replaceWith(inputField);
    postCard.find(".edit-input").focus();
    editBtn.data("mode", "save");
    editBtn.find("span").text("Save");
  } else if (mode === "save") {
    // Get the input field
    const inputField = postCard.find(".edit-input");
    const postContent = inputField.val().trim();

    // Validations
    function hasLongWord(text) {
      const words = text.split(/\s+/);
      return words.some((word) => word.length > 45);
    }

    function getLongestWord(text) {
      const words = text.split(/\s+/);
      return words.reduce((longest, current) =>
        current.length > longest.length ? current : longest
      );
    }

    if (!postContent) {
      inputField[0].setCustomValidity("Post content cannot be empty");
      inputField[0].reportValidity();
    } else if (postContent.length > 280) {
      inputField[0].setCustomValidity(
        "Post content must not exceed 280 characters"
      );
      inputField[0].reportValidity();
    } else if (hasLongWord(postContent)) {
      const longWord = getLongestWord(postContent);
      inputField[0].setCustomValidity(
        `Word "${longWord}" is too long. Maximum word length is 45 characters`
      );
      inputField[0].reportValidity();
    } else {
      inputField[0].setCustomValidity("");
      // Switch back to <p> mode
      const newContent = inputField.val().trim();
      const updatedParagraph = `<p>${newContent}</p>`;

      inputField.replaceWith(updatedParagraph);
      editBtn.data("mode", "edit");
      editBtn.find("span").text("Edit Post");
      console.log(newContent);

      // Update the post content in the database
      try {
        const postId = postCard.data("post").postId;
        const response = await updatePost(postId, newContent);

        if (response.status === 204 || response.status === 200) {
          window.parent.postMessage(
            {
              type: "alert",
              message: "Post updated successfully",
              isError: false,
            },
            "*"
          );
        } else {
          window.parent.postMessage(
            {
              type: "alert",
              message: "Post update failed! Try again.",
              isError: true,
            },
            "*"
          );
        }
      } catch (error) {
        console.error("Error updating post:", error);
        window.parent.postMessage(
          {
            type: "alert",
            message: "Post update failed! Try again.",
            isError: true,
          },
          "*"
        );
      }
    }
  }
});

// Handle Enter key in edit mode
$("#myPostWallComponent").on("keyup", ".edit-input", function (e) {
  if (e.key === "Enter") {
    const postCard = $(this).closest(".postCard");
    const editBtn = postCard.find(".edit-post-btn");
    // Trigger the click event of the edit button to save changes
    editBtn.click();
  }
});

// --------------------------- post-info-popup ---------------------------

$("#myPostWallComponent").on("click", ".postInfoPopup", function (event) {
  event.preventDefault(); // Prevent default scrolling
  event.stopPropagation(); // Stop event bubbling

  let postCard;
  let post;

  if (window.innerWidth <= 767) {
    postCard = $(this).closest("#postCardMobile");
  } else {
    postCard = $(this).closest(".postCard");
  }
  post = JSON.parse(postCard.attr("data-post"));

  console.log("aletPost", post);

  // Set Posted Date and Time
  const createdAt = new Date(post.createdAt);
  const postedDate = createdAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const postedTime = createdAt.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  let approvedBy = "--"; // Default value
  if (post.status === "APPROVED") {
    approvedBy = `${post.verifiedBy} <span style="color:green;">(Approved)</span>`;
  } else if (post.status === "DECLINED") {
    approvedBy = `${post.verifiedBy} <span style="color:red;">(Declined)</span>`;
  } else if (post.status !== null) {
    approvedBy = post.verifiedBy;
  }

  // Update the modal content
  $("#popupModal .modal-info")
    .eq(0)
    .find("p")
    .eq(0)
    .html(`<span class="modal-subheader">Posted Date:</span> ${postedDate}`);
  $("#popupModal .modal-info")
    .eq(0)
    .find("p")
    .eq(1)
    .html(`<span class="modal-subheader">Posted Time:</span> ${postedTime}`);
  $("#popupModal .modal-info")
    .eq(1)
    .find("p")
    .html(`<span class="modal-subheader">Verified By:</span> ${approvedBy}`);

  // Calculate position of the clicked post
  const postOffset = postCard.offset();
  const postHeight = postCard.outerHeight();

  // Show the modal at the calculated position
  $("#popupModal").css({
    top: postOffset.top + postHeight + -116 + "px",
    // left: postOffset.left + "px",
    display: "flex",
    position: "absolute",
    zIndex: 10000,
  });

  setTimeout(function () {
    $("#popupModal").addClass("active");
  }, 10);
});

$("#cancelInfo").on("click", closeModal);

function closeModal() {
  $("#popupModal").removeClass("active");
  setTimeout(function () {
    $("#popupModal").css("display", "none");
  }, 300);
}

// ----------------------- delete-confirmation-popup -----------------------

let postIdToDelete = null;

$("#myPostWallComponent").on("click", ".postDeletePopup", function (event) {
  event.preventDefault(); // Prevent default scrolling
  event.stopPropagation(); // Stop event bubbling

  // Get the postId of the post to be deleted
  let postCard;
  let post;

  if (window.innerWidth <= 767) {
    postCard = $(this).closest("#postCardMobile");
  } else {
    postCard = $(this).closest(".postCard");
  }
  post = JSON.parse(postCard.attr("data-post"));
  postIdToDelete = post.postId;

  // Calculate position of the clicked post
  const postOffset = postCard.offset();
  const postHeight = postCard.outerHeight();

  // Show the delete confirmation modal at the calculated position
  $("#deletePopupModal").css({
    top: postOffset.top + postHeight + -116 + "px",
    // left: postOffset.left + "px",
    display: "flex",
    position: "absolute",
    zIndex: 10000,
  });

  setTimeout(function () {
    $("#deletePopupModal").addClass("active");
  }, 10);
});

$("#confirmDelete").on("click", async function () {
  if (postIdToDelete) {
    try {
      const response = await deletePost(postIdToDelete);
      if (response.status === 204 || response.status === 200) {
        closeDeleteModal();
        window.location.reload();
      } else {
        closeDeleteModal();
        window.parent.postMessage(
          {
            type: "alert",
            message: "Post deletion unsuccessful! Try again.",
            isError: true,
          },
          "*"
        );
      }
    } catch (error) {
      closeDeleteModal();
      window.parent.postMessage(
        {
          type: "alert",
          message: "Post deletion unsuccessful! Try again.",
          isError: true,
        },
        "*"
      );
    }
  }
});

function closeDeleteModal() {
  $("#deletePopupModal").removeClass("active");
  setTimeout(function () {
    $("#deletePopupModal").css("display", "none");
  }, 300);
}

$("#cancelDelete").on("click", function (event) {
  event.preventDefault(); // Prevent default scrolling
  event.stopPropagation(); // Stop event bubbling

  closeDeleteModal();
});
