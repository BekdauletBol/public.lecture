const API_URL = 'http://127.0.0.1:5001/api/videos';
const USER_API_URL = 'http://127.0.0.1:5001/api/users';

async function loadVideos(searchQuery = "") {
    const grid = document.getElementById('video-grid');
    if (!grid) return; 

    const token = localStorage.getItem('token');

    if (!token) {
        grid.innerHTML = `
            <div class="col-span-full py-20 text-center border border-dashed border-white/5 rounded-2xl bg-[#0f0f0f]">
                <i class="fas fa-lock text-white/5 text-5xl mb-6"></i>
                <h3 class="text-white text-xl mb-4 uppercase tracking-widest">Access Denied</h3>
                <p class="text-gray-600 mb-8 text-sm font-light text-center px-4">This context is for registered users only. Please sign in.</p>
                <a href="login.html" class="primary-btn inline-block px-10 py-3">Sign In</a>
            </div>
        `;
        return;
    }

    try {
        const response = await fetch(API_URL, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.status === 401) {
            localStorage.removeItem('token');
            location.reload();
            return;
        }

        const videos = await response.json();
        const filtered = videos.filter(v => v.title.toLowerCase().includes(searchQuery.toLowerCase()));

        if (filtered.length === 0) {
            grid.innerHTML = '<p class="text-gray-500 col-span-full text-center py-10">No context found matching your search.</p>';
            return;
        }

        grid.innerHTML = filtered.map(video => `
            <div class="video-card cursor-pointer" onclick="watchVideo('${video.videoUrl}', '${video.title}')">
                <div class="h-48 bg-[#111] border border-white/5 mb-4 rounded-xl overflow-hidden relative group">
                    <img src="http://127.0.0.1:5001/${video.thumbnailUrl}" 
                        class="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition duration-700"
                        onerror="this.style.display='none'">
                    <div class="absolute inset-0 flex items-center justify-center">
                        <i class="fas fa-play text-white/10 text-3xl group-hover:text-white/40 transition"></i>
                    </div>
                </div>
                <h3 class="text-white text-sm font-medium mb-1 tracking-tight">${video.title}</h3>
                <div class="flex justify-between items-center text-[9px] text-gray-600 uppercase tracking-widest">
                    <span>By: ${video.teacher?.username || 'Unknown'}</span>
                    <span class="bg-white/5 px-2 py-1 rounded">${video.category}</span>
                </div>
            </div>
        `).join('');
    } catch (err) {
        console.error("Error loading videos:", err);
    }
}

function updateAuthUI() {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const uploadBtn = document.getElementById('upload-nav-btn');
    const userControls = document.getElementById('user-controls');
    const profileLink = document.getElementById('profile-link');

    if (token) {
        if (userControls) {
            userControls.innerHTML = `
                <div class="flex items-center space-x-4">
                    <span class="text-[10px] text-white/30 tracking-[0.2em] uppercase">${userRole}</span>
                    <button onclick="logout()" class="text-red-500 hover:text-red-400 transition text-sm">Logout</button>
                </div>
            `;
        }
        if (profileLink) profileLink.classList.remove('hidden');
        if (uploadBtn) {
            uploadBtn.style.display = (userRole === 'teacher') ? 'block' : 'none';
        }
    } else {
        if (userControls) {
            userControls.innerHTML = `<a href="login.html" class="hover:text-white transition text-sm">Sign In</a>`;
        }
        if (profileLink) profileLink.classList.add('hidden');
        if (uploadBtn) uploadBtn.style.display = 'none';
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    window.location.href = 'index.html'; 
}

function showPage(pageId) {
    if (window.location.pathname.includes('lectures.html')) {
        window.location.href = `index.html?page=${pageId}`;
        return;
    }

    const userRole = localStorage.getItem('userRole');
    if (pageId === 'upload' && userRole !== 'teacher') {
        alert("Access denied.");
        return;
    }

    const pages = ['home-page', 'upload-page', 'profile-page'];
    pages.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.toggle('hidden', id !== `${pageId}-page`);
    });

    if (pageId === 'profile') loadMyVideos();
}

const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', (e) => loadVideos(e.target.value));
}

function watchVideo(url, title) {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    window.location.href = `video.html?url=${encodedUrl}&title=${encodedTitle}`;
}

async function loadMyVideos() {
    const token = localStorage.getItem('token');
    if (localStorage.getItem('userRole') !== 'teacher' || !token) return;

    try {
        const response = await fetch(API_URL, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const videos = await response.json();
        const currentUserId = JSON.parse(atob(token.split('.')[1])).id;
        const myVideos = videos.filter(v => (v.teacher?._id || v.teacher) === currentUserId);
        
        const container = document.getElementById('my-videos-list');
        if (!container) return;

        container.innerHTML = myVideos.length ? myVideos.map(v => `
            <div class="flex justify-between items-center bg-white/5 p-4 rounded-lg border border-white/5 mb-3">
                <span class="text-white text-xs font-medium">${v.title}</span>
                <button onclick="deleteVideo('${v._id}')" class="text-red-500 hover:text-red-400 text-[10px] uppercase font-bold">Delete</button>
            </div>
        `).join('') : '<p class="text-[10px] text-gray-600 italic">No studio content.</p>';
    } catch (err) { console.error(err); }
}

async function deleteVideo(id) {
    if (!confirm("Delete permanently?")) return;
    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        loadMyVideos();
        loadVideos();
    } catch (err) { console.error(err); }
}

const uploadForm = document.getElementById('upload-form');
if (uploadForm) {
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const formData = new FormData(uploadForm);
        formData.append('video', document.getElementById('videoFile').files[0]);
        const thumb = document.getElementById('thumbnailFile').files[0];
        if (thumb) formData.append('thumbnail', thumb);

        const response = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData 
        });
        if (response.ok) { alert('Success!'); showPage('home'); loadVideos(); }
    });
}

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

document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    loadVideos();

    const params = new URLSearchParams(window.location.search);
    const page = params.get('page');
    if (page) showPage(page);
});

const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('videoFile');
const fileNameDisplay = document.getElementById('fileNameDisplay');
if(dropZone && fileInput) {
    dropZone.onclick = () => fileInput.click();
    fileInput.onchange = () => { if(fileInput.files[0]) fileNameDisplay.innerText = fileInput.files[0].name; };
}