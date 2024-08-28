$(document).ready(function () {
  LoadCards();
});

function LoadCards() {
  $("#homeWallComponent .postCards").empty();
  for (let i = 0; i < 10; i++) {
    $("#homeWallComponent").append(PostCard());
  }
}

const PostCard = () => {
  return `
    <div id="postCard" class="p-2 mb-4">
            <div>
                <div id="post-card" class="d-flex justify-content-between">
                    <div  class="d-flex gap-3 align-items-center">
                        <img class="profileImage" src="../../../assets/image/profilePic.png" alt="Profile Image">
                        <div id="text-logo" class="d-flex flex-column">
                            <h5  class="m-0 ">Samuel Edison</h5>
                            <h6>A few moment ago</h6>
                        </div>
                    </div>
                    <button id="more-icon" class="bg-transparent border-0">
                        <img src="../../../assets/icons/moreIcon.png" alt="More Icon">
                    </button>
                </div>
                <div class="px-1 mx-lg-5 mt-3">
                    <p>🚀 Just finished my new web app for task management! Built with React and Node.js Check it out and share your thoughts! 💡</p>
                    <div class="d-flex justify-content-end gap-3">
                        
                        <button id="decline" class="border-0 p-2 px-2 rounded-4 d-flex align-items-center gap-1 ">
                            <img src="../../../assets/icons/decline_dark.png" alt="Inspire Icon">
                            <span>Decline</span>
                        </button>
                        
                        <button id="approve" class="border-0 p-2 px-2 rounded-4 d-flex align-items-center gap-1">
                            <img src="../../../assets/icons/approve-dark.png" alt="Inspire Icon">
                            <span>Approve</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
        
    `;
};
