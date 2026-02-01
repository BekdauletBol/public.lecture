const API_URL = 'http://127.0.0.1:5001/api/videos';

// 1. Загрузка видео с отображением автора
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
                <div class="h-40 bg-[#111] border border-white/5 mb-4 rounded-lg flex items-center justify-center group relative overflow-hidden">
                    <i class="fas fa-play text-white/10 text-3xl group-hover:text-white/40 transition"></i>
                </div>
                <h3 class="text-white text-sm font-medium mb-1">${video.title}</h3>
                <div class="flex justify-between items-center text-[10px] text-gray-500 uppercase tracking-widest">
                    <!-- Теперь тут будет имя, если бэкенд сделает populate -->
                    <span>By: ${video.teacher ? video.teacher.username : 'Unknown'}</span>
                    <span class="border border-white/10 px-2 py-0.5 rounded">${video.category}</span>
                </div>
            </div>
        `).join('');
    } catch (err) {
        console.error("Error loading videos:", err);
    }
}

// 2. Функция Выхода (Logout)
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    window.location.href = 'index.html';
}

// 3. Обновление интерфейса (Скрываем кнопку для студентов)
function updateAuthUI() {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole'); // student или teacher
    const uploadBtn = document.querySelector('.upload-btn'); // Кнопка в хедере

    if (token) {
        // Если залогинен как студент - скрываем кнопку загрузки
        if (userRole === 'student' && uploadBtn) {
            uploadBtn.classList.add('hidden');
        } else if (uploadBtn) {
            uploadBtn.classList.remove('hidden');
        }
    } else {
        if (uploadBtn) uploadBtn.classList.add('hidden');
    }
}

// 4. Защищенное переключение страниц
function showPage(pageId) {
    const userRole = localStorage.getItem('userRole');

    if (pageId === 'upload' && userRole !== 'teacher') {
        alert("Access denied. Only teachers can upload videos.");
        return;
    }

    document.getElementById('home-page').classList.toggle('hidden', pageId !== 'home');
    document.getElementById('upload-page').classList.toggle('hidden', pageId !== 'upload');
}

function watchVideo(url, title) {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    window.location.href = `video.html?url=${encodedUrl}&title=${encodedTitle}`;
}

function showPage(pageId) {
    document.getElementById('home-page').classList.toggle('hidden', pageId !== 'home');
    document.getElementById('upload-page').classList.toggle('hidden', pageId !== 'upload');
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

        const file = document.getElementById('videoFile').files[0];
        if (!file) {
            alert("Please select a video file");
            return;
        }

        const formData = new FormData();
        formData.append('title', document.getElementById('title').value);
        formData.append('category', document.getElementById('category').value);
        formData.append('video', file);

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
                alert('Upload failed: ' + (errorData.message || 'Check your permissions'));
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

document.addEventListener('DOMContentLoaded', loadVideos);