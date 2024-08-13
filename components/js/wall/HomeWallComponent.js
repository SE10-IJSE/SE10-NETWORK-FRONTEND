$(document).ready(function() {
    // LoadCards();
});

function LoadCards(){
    $("#homeWallComponent").empty();
    for (let i = 0; i < 10; i++) {
        $("#homeWallComponent").append(
            card()
        )
    }
}

const card = () =>{
    return `
    <div class="card border-0 rounded-4 mb-3">
            <div class="card-header rounded-top-5">
                Post Something
            </div>
            <div class="card-body rounded-bottom-5 d-flex align-items-center gap-4">
                <img src="../../../assets/image/profilePic.png">
                <div class="input-group flex-nowrap d-flex align-items-center">
                    <input type="text" class="form-control border-0" placeholder="What’s on your mind ?" aria-label="What’s on your mind ?" aria-describedby="addon-wrapping">
                    <span class="input-group-text bg-transparent border-0" id="addon-wrapping">
                        <img src="../../../assets/icons/sendIcon.png" alt="">
                    </span>
                </div>
            </div>
        </div>
    `
}