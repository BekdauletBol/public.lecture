const API_URL = 'http://127.0.0.1:5001/api/users/teachers';

async function loadTeachers() {
    try {
        const response = await fetch(API_URL);
        const teachers = await response.json();
        
        const grid = document.getElementById('teachers-grid');
        if (!grid) return;

        grid.innerHTML = teachers.map(t => `
            <div class="border border-white/5 bg-[#111] p-8 rounded-xl hover:border-white/20 transition cursor-pointer group" 
                 onclick="viewTeacherLectures('${t._id}')">
                <div class="w-16 h-16 bg-white/5 rounded-full mb-6 flex items-center justify-center group-hover:bg-white/10 transition">
                    <span class="text-white font-bold text-xl">${t.username.charAt(0).toUpperCase()}</span>
                </div>
                <h3 class="text-white text-lg font-medium mb-1">${t.username}</h3>
                <p class="text-[10px] text-gray-500 uppercase tracking-[0.2em] mb-4">Expert Teacher</p>
                <div class="text-[10px] text-white/40 border-t border-white/5 pt-4 group-hover:text-white/80 transition">
                    View all lectures <i class="fas fa-arrow-right ml-2"></i>
                </div>
            </div>
        `).join('');
    } catch (err) {
        console.error("Error loading teachers:", err);
    }
}

function viewTeacherLectures(teacherId) {
    window.location.href = `lectures.html?teacherId=${teacherId}`;
}

document.addEventListener('DOMContentLoaded', loadTeachers);