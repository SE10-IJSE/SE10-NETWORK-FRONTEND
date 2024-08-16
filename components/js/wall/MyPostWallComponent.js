$(document).ready(function() {
    LoadCards();
});

function LoadCards(){
    $("#myPostWallComponent .postCards").empty();
    for (let i = 0; i < 10; i++) {
        $("#myPostWallComponent").append(
            MyPostCard()
        )
    }
}

const MyPostCard = () =>{
    return `
    <div id="postCard" class="p-5 mb-3">
            <div>
                <div class="d-flex justify-content-between">
                    <div class="d-flex gap-3 align-items-center">
                        <img class="profileImage" src="../../../assets/image/profilePic.png" alt="Profile Image" style="border: 2px solid #04FF00;">
                        <div class="d-flex flex-column">
                            <h5 class="m-0">Abrahum Joe</h5>
                            <h6>7 hours ago</h6>
                        </div>
                    </div>
                    <button class="bg-transparent border-0">
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
    `
}