const API_URL = 'http://127.0.0.1:5001/api/videos';
const USER_API_URL = 'http://127.0.0.1:5001/api/users';

// 1. Загрузка видео с поддержкой поиска и ОПИСАНИЯ
async function loadVideos(searchQuery = "") {
    const grid = document.getElementById('video-grid');
    if (!grid) return; 

    const token = localStorage.getItem('token');

    if (!token) {
        grid.innerHTML = `
            <div class="col-span-full py-20 text-center border border-dashed border-white/5 rounded-2xl bg-[#0f0f0f]">
                <i class="fas fa-lock text-white/5 text-5xl mb-6"></i>
                <h3 class="text-white text-xl mb-4 uppercase tracking-widest">Access Denied</h3>
                <p class="text-gray-600 mb-8 text-sm">Please sign in to browse the library.</p>
                <a href="login.html" class="primary-btn inline-block px-10 py-3">Sign In</a>
            </div>`;
        return;
    }

    try {
        const response = await fetch(API_URL, { headers: { 'Authorization': `Bearer ${token}` } });
        const videos = await response.json();
        const filtered = videos.filter(v => v.title.toLowerCase().includes(searchQuery.toLowerCase()));

        if (filtered.length === 0) {
            grid.innerHTML = '<p class="text-gray-500 col-span-full text-center py-10">No matches found.</p>';
            return;
        }

        grid.innerHTML = filtered.map(video => `
            <div class="video-card cursor-pointer" onclick="watchVideo('${video.videoUrl}', '${video.title}', '${encodeURIComponent(video.description || "")}')">
                <div class="h-48 bg-[#111] border border-white/5 mb-4 rounded-xl overflow-hidden relative group">
                    <img src="http://127.0.0.1:5001/${video.thumbnailUrl}" class="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition duration-700" onerror="this.style.display='none'">
                    <div class="absolute inset-0 flex items-center justify-center">
                        <i class="fas fa-play text-white/10 text-3xl group-hover:text-white/40 transition"></i>
                    </div>
                </div>
                <h3 class="text-white text-sm font-medium mb-1">${video.title}</h3>
                <div class="flex justify-between items-center text-[9px] text-gray-600 uppercase tracking-widest">
                    <span>By: ${video.teacher?.username || 'Unknown'}</span>
                    <span class="bg-white/5 px-2 py-1 rounded">${video.category}</span>
                </div>
            </div>`).join('');
    } catch (err) { console.error(err); }
}

// 2. Интерфейс (Login/Logout/Role)
function updateAuthUI() {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const uploadBtn = document.getElementById('upload-nav-btn');
    const userControls = document.getElementById('user-controls');
    const profileLink = document.getElementById('profile-link');

    if (token) {
        userControls.innerHTML = `
            <div class="flex items-center space-x-4">
                <span class="text-[10px] text-white/30 tracking-[0.2em] uppercase font-bold">${userRole}</span>
                <button onclick="logout()" class="text-red-500 hover:text-red-400 transition text-sm">Logout</button>
            </div>`;
        if (profileLink) profileLink.classList.remove('hidden');
        if (uploadBtn) uploadBtn.style.display = (userRole === 'teacher' ? 'block' : 'none');
    } else {
        userControls.innerHTML = `<a href="login.html" class="hover:text-white transition text-sm">Sign In</a>`;
        if (profileLink) profileLink.classList.add('hidden');
        if (uploadBtn) uploadBtn.style.display = 'none';
    }
}

// 3. Переход к плееру (Передаем описание в URL)
function watchVideo(url, title, desc) {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    window.location.href = `video.html?url=${encodedUrl}&title=${encodedTitle}&desc=${desc}`;
}

// 4. Навигация
function showPage(pageId) {
    if (window.location.pathname.includes('lectures.html') || window.location.pathname.includes('teachers.html')) {
        window.location.href = `index.html?page=${pageId}`;
        return;
    }
    const userRole = localStorage.getItem('userRole');
    if (pageId === 'upload' && userRole !== 'teacher') return alert("Access denied.");

    ['home-page', 'upload-page', 'profile-page'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.toggle('hidden', id !== `${pageId}-page`);
    });
    if (pageId === 'profile') loadMyVideos();
}

// 5. Загрузка "My Studio"
async function loadMyVideos() {
    if (localStorage.getItem('userRole') !== 'teacher') return;
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(API_URL, { headers: { 'Authorization': `Bearer ${token}` } });
        const videos = await response.json();
        const currentUserId = JSON.parse(atob(token.split('.')[1])).id;
        const myVideos = videos.filter(v => (v.teacher?._id || v.teacher) === currentUserId);
        
        const container = document.getElementById('my-videos-list');
        if (container) {
            container.innerHTML = myVideos.length ? myVideos.map(v => `
                <div class="flex justify-between items-center bg-white/5 p-4 rounded-lg border border-white/5 mb-3 hover:border-white/10 transition">
                    <span class="text-white text-xs font-medium">${v.title}</span>
                    <button onclick="deleteVideo('${v._id}')" class="text-red-500 hover:text-red-400 text-[10px] uppercase font-bold">Delete</button>
                </div>`).join('') : '<p class="text-xs text-gray-600 italic text-center">No studio content.</p>';
        }
    } catch (err) { console.error(err); }
}

// 6. Удаление
async function deleteVideo(id) {
    if (!confirm("Delete permanently?")) return;
    await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    loadMyVideos(); loadVideos();
}

// 7. Форма загрузки видео (С описанием)
const uploadForm = document.getElementById('upload-form');
if (uploadForm) {
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', document.getElementById('title').value);
        formData.append('category', document.getElementById('category').value);
        formData.append('description', document.getElementById('description').value);
        formData.append('video', document.getElementById('videoFile').files[0]);
        const thumb = document.getElementById('thumbnailFile').files[0];
        if (thumb) formData.append('thumbnail', thumb);

        const response = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            body: formData 
        });
        if (response.ok) { alert('Success!'); showPage('home'); loadVideos(); }
    });
}

// 8. Поиск
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', (e) => loadVideos(e.target.value));
}

// Вспомогательные функции (Logout, Avatar, Dropzone)
function logout() { localStorage.clear(); window.location.href = 'index.html'; }

const profileForm = document.getElementById('profile-form');
if (profileForm) {
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('avatar', document.getElementById('avatarFile').files[0]);
        await fetch(`${USER_API_URL}/profile/picture`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            body: formData
        });
        location.reload();
    });
}

const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('videoFile');
if(dropZone) {
    dropZone.onclick = () => fileInput.click();
    fileInput.onchange = () => { if(fileInput.files[0]) document.getElementById('fileNameDisplay').innerText = fileInput.files[0].name; };
}

document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    loadVideos();
    const page = new URLSearchParams(window.location.search).get('page');
    if (page) showPage(page);
});