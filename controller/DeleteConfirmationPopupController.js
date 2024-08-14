  const deleteBtn = document.getElementById('deleteBtn');
const popupModal = document.getElementById('popupModal');
const confirmDelete = document.getElementById('confirmDelete');
const cancelDelete = document.getElementById('cancelDelete');

deleteBtn.addEventListener('click', () => {
    popupModal.style.display = 'flex';
});

cancelDelete.addEventListener('click', () => {
    popupModal.style.display = 'none';
});

confirmDelete.addEventListener('click', () => {
    alert('Item deleted!');
    popupModal.style.display = 'none';
});