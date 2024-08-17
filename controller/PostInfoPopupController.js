const infoBtn = document.getElementById('infoBtn');
const popupModal = document.getElementById('popupModal');
const cancelInfo = document.getElementById('cancelInfo');

infoBtn.addEventListener('click', showModal);
cancelInfo.addEventListener('click', closeModal);
closeBtn.addEventListener('click', closeModal);

function showModal() {
    popupModal.style.display = 'flex';
    setTimeout(() => popupModal.classList.add('active'), 10);
}

function closeModal() {
    popupModal.classList.remove('active');
    setTimeout(() => popupModal.style.display = 'none', 300);
}
