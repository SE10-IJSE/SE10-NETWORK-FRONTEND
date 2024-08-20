document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const recentContainer = document.querySelector('.recent-list');

    const handleRecentContainerClick = (event) => {
        const target = event.target;

        if (target.classList.contains('remove-btn')) {
            const recentItem = target.closest('.recent-item');
            if (recentItem) {
                recentItem.remove();
                searchInput.value = '';
            }
        }

        if (target.closest('.recent-item')) {
            const recentItem = target.closest('.recent-item');
            const itemName = recentItem.querySelector('span').textContent;
            searchInput.value = itemName;
        }
    };

    recentContainer.addEventListener('click', handleRecentContainerClick);

    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();

            const query = searchInput.value.trim();
            if (query) {
                addRecentItem(query);
                searchInput.value = '';
            }
        }
    });

    const addRecentItem = (name) => {
        const recentItem = document.createElement('div');
        recentItem.classList.add('recent-item');

        const profileImg = document.createElement('img');
        profileImg.src = '/assets/image/defaultprofile.jpg';
        profileImg.alt = 'Profile Image';
        recentItem.appendChild(profileImg);

        const nameSpan = document.createElement('span');
        nameSpan.textContent = name;
        recentItem.appendChild(nameSpan);

        const removeBtn = document.createElement('button');
        removeBtn.classList.add('remove-btn');
        removeBtn.innerHTML = '&times;';
        recentItem.appendChild(removeBtn);

        recentContainer.appendChild(recentItem);
    };
});
