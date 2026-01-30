//Логика переключения страниц и рендеринга
const API_URL = 'http://127.0.0.1:5001/api/videos';

async function loadVideos() {
    try {
        const response = await fetch(API_URL);
        const videos = await response.json();
        
        const grid = document.getElementById('video-grid');
        if (!grid) return;

        if (videos.length === 0) {
            grid.innerHTML = '<p class="text-gray-500 col-span-3 text-center">No lectures uploaded yet.</p>';
            return;
        }

        grid.innerHTML = videos.map(video => `
            <div class="video-card cursor-pointer" onclick="watchVideo('${video.videoUrl}', '${video.title}')">
                <div class="h-40 bg-[#111] border border-white/5 mb-4 rounded-lg flex items-center justify-center group overflow-hidden relative">
                    <i class="fas fa-play text-white/10 text-3xl group-hover:text-white/40 transition"></i>
                </div>
                <h3 class="text-white text-sm font-medium mb-1">${video.title}</h3>
                <div class="flex justify-between items-center text-[10px] text-gray-500 uppercase tracking-widest">
                    <span>Teacher: admin</span> <!-- Позже заменим на имя автора -->
                    <span class="border border-white/10 px-2 py-0.5 rounded">${video.category}</span>
                </div>
            </div>
        `).join('');
    } catch (err) {
        console.error("Error loading videos:", err);
    }
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
                body: formData 
            });

            if (response.ok) {
                alert('Lecture successfully uploaded!');
                showPage('home');
                loadVideos(); 
            } else {
                alert('Upload failed');
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