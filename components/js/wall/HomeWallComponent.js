$(document).ready(function() {
    LoadCards();
});

function LoadCards(){
    $("#homeWallComponent .postCards").empty();
    for (let i = 0; i < 10; i++) {
        $("#homeWallComponent").append(
            PostCard()
        )
    }
}

const PostCard = () =>{
    return `
    <div id="postCard" class="p-5 mb-3">
            <div>
                <div class="d-flex justify-content-between">
                    <div class="d-flex gap-3 align-items-center">
                        <img class="profileImage" src="../../../assets/image/profilePic.png" alt="Profile Image">
                        <div class="d-flex flex-column">
                            <h5 class="m-0">Samuel Edison</h5>
                            <h6>A few moment ago</h6>
                        </div>
                    </div>
                    <button class="bg-transparent border-0">
                        <img src="../../../assets/icons/moreIcon.png" alt="More Icon">
                    </button>
                </div>
                <div class="px-3 mx-5 mt-2">
                    <p>🚀 Just finished my new web app for task management! Built with React and Node.js Check it out and share your thoughts! 💡</p>
                    <div class="d-flex justify-content-between">
                        <div class="d-flex gap-3 align-items-center">
                            <img src="../../../assets/icons/likeIcon.png" alt="Inspire Icon">
                            <span>56 Inspirations</span>
                        </div>
                        <button class="border-0 p-2 px-3 rounded-4 d-flex align-items-center gap-2">
                            <img src="../../../assets/icons/ideaIcon.png" alt="Inspire Icon">
                            <span>Inspire</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `
}