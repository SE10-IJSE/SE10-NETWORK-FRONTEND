// =============== Profile picture ===============

// Uploading
const profileDropArea = document.getElementById("propic-drop-area");
const profileInputFile = document.getElementById("profile-input-file");
const profileImgView = document.getElementById("profile-img-view");

profileInputFile.addEventListener("change", uploadProfilePicture);

function uploadProfilePicture() {
    let profilePicLink = URL.createObjectURL(profileInputFile.files[0]);
    profileImgView.style.backgroundImage = `url(${profilePicLink})`;
    profileImgView.textContent = "";
}

// Drag & drop
profileDropArea.addEventListener("dragover", function(e){
    e.preventDefault();
});

profileDropArea.addEventListener("drop", function(e){
    e.preventDefault();
    profileInputFile.files = e.dataTransfer.files;
    uploadProfilePicture();
});

// Applying border style on click
let profilePictureContainer = document.getElementById('profile-pic-container')

document.querySelector('#profile-input-file').onclick = function(){
    profilePictureContainer.style.border = '2px solid #E90708'
}

document.addEventListener('click', function(event) {
    if (!profilePictureContainer.contains(event.target) && event.target.id !== 'profile-input-file') {
        profilePictureContainer.style.border = 'none';
    }
});

// =============== Cover picture ===============

// Uploading
const coverDropArea = document.getElementById("coverpic-drop-area");
const coverInputFile = document.getElementById("cover-input-file");
const coverImgView = document.getElementById("cover-img-view");

coverInputFile.addEventListener("change", uploadCoverPicture);

function uploadCoverPicture() {
    let coverPicLink = URL.createObjectURL(coverInputFile.files[0]);
    coverImgView.style.backgroundImage = `url(${coverPicLink})`;
    coverImgView.textContent = "";
}

// Drag & drop
coverDropArea.addEventListener("dragover", function(e){
    e.preventDefault();
});

coverDropArea.addEventListener("drop", function(e){
    e.preventDefault();
    coverInputFile.files = e.dataTransfer.files;
    uploadCoverPicture();
});

// Applying border style on click
let coverPictureContainer = document.getElementById('cover-pic-container')

document.querySelector('#cover-input-file').onclick = function(){
    coverPictureContainer.style.border = '2px solid #E90708'
}

document.addEventListener('click', function(event) {
    if (!coverPictureContainer.contains(event.target) && event.target.id !== 'cover-input-file') {
        coverPictureContainer.style.border = 'none';
    }
});