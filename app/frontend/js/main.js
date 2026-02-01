const API_URL = 'http://127.0.0.1:5001/api/videos';

async function loadVideos() {
    try {
        const response = await fetch(API_URL);
        const videos = await response.json();
        const grid = document.getElementById('video-grid');
        if (!grid) return;

        if (videos.length === 0) {
            grid.innerHTML = '<p class="text-gray-500 col-span-3 text-center">No lectures yet.</p>';
            return;
        }

        grid.innerHTML = videos.map(video => `
            <div class="video-card cursor-pointer" onclick="watchVideo('${video.videoUrl}', '${video.title}')">
                <div class="h-40 bg-[#111] border border-white/5 mb-4 rounded-lg overflow-hidden relative group">
                    <!-- Если thumbnailUrl есть, показываем его -->
                    <img src="http://127.0.0.1:5001/${video.thumbnailUrl}" 
                        class="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition duration-500"
                        onerror="this.style.display='none'">
                    
                    <div class="absolute inset-0 flex items-center justify-center">
                        <i class="fas fa-play text-white/10 text-3xl group-hover:text-white/40 transition"></i>
                    </div>
                </div>
                <h3 class="text-white text-sm font-medium mb-1">${video.title}</h3>
                <div class="flex justify-between items-center text-[10px] text-gray-500 uppercase tracking-widest">
                <span>By: ${video.teacher?.username || 'Unknown'}</span>
                <span class="border border-white/10 px-2 py-0.5 rounded">${video.category}</span>
                </div>
            </div>
        `).join('');
    } catch (err) {
        console.error("Error loading videos:", err);
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    window.location.href = 'index.html';
}

function updateAuthUI() {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const uploadBtn = document.getElementById('upload-nav-btn');
    const userControls = document.getElementById('user-controls');

    if (token) {
        
        userControls.innerHTML = `
            <div class="flex items-center space-x-4">
                <span class="text-[10px] text-white/30 tracking-[0.2em] uppercase">${userRole}</span>
                <button onclick="logout()" class="text-red-500 hover:text-red-400 transition text-sm">Logout</button>
            </div>
        `;

        if (userRole === 'teacher') {
            uploadBtn.style.display = 'block';
        } else {
            uploadBtn.style.display = 'none';
        }

    } else {
        
        userControls.innerHTML = `<a href="login.html" class="hover:text-white transition text-sm">Sign In</a>`;

        uploadBtn.style.display = 'none';
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    alert("Logged out successfully");
    window.location.href = 'index.html'; 
}

// Вызываем проверку при каждой загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    loadVideos();
});

function showPage(pageId) {
    const userRole = localStorage.getItem('userRole');

    if (pageId === 'upload' && userRole !== 'teacher') {
        alert("Access denied. Only teachers can upload videos.");
        return;
    }

    const homePage = document.getElementById('home-page');
    const uploadPage = document.getElementById('upload-page');

    if (homePage && uploadPage) {
        homePage.classList.toggle('hidden', pageId !== 'home');
        uploadPage.classList.toggle('hidden', pageId !== 'upload');
    }
}

function watchVideo(url, title) {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    window.location.href = `video.html?url=${encodedUrl}&title=${encodedTitle}`;
}

const uploadForm = document.getElementById('upload-form');
if (uploadForm) {
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Please log in to upload videos");
            window.location.href = 'login.html';
            return;
        }

        const videoFile = document.getElementById('videoFile').files[0];
        const thumbFile = document.getElementById('thumbnailFile').files[0];

        if (!videoFile) {
            alert("Please select a video file");
            return;
        }

        const formData = new FormData();
        formData.append('title', document.getElementById('title').value);
        formData.append('category', document.getElementById('category').value);
        formData.append('video', videoFile);
        if (thumbFile) {
            formData.append('thumbnail', thumbFile);
        }

        try {
            const response = await fetch(`${API_URL}/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData 
            });

            if (response.ok) {
                alert('Lecture successfully uploaded!');
                showPage('home');
                loadVideos(); 
            } else {
                const errorData = await response.json();
                alert('Upload failed: ' + (errorData.error || 'Check your permissions'));
            }
        } catch (err) {
            console.error("Upload error:", err);
        }
    });
}

const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('videoFile');
const fileNameDisplay = document.getElementById('fileNameDisplay');

if(dropZone) {
    dropZone.onclick = () => fileInput.click();
    fileInput.onchange = () => {
        if(fileInput.files[0]) fileNameDisplay.innerText = `Selected: ${fileInput.files[0].name}`;
    };
}

document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    loadVideos();
});