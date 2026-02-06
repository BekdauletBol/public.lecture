<img width="1440" height="900" alt="Screenshot 2026-02-06 at 12 18 35 PM" src="https://github.com/user-attachments/assets/d010848c-5802-46f6-9d30-535803aef892" /># public.edu — Video Context Platform

**public.edu** is a modern, secure web platform designed for knowledge sharing through high-quality video lectures. Built with a focus on "Context for AI and Humans," the platform provides a streamlined experience for teachers to manage their content and students to access a curated library of information.

## Key Features

- **Role-Based Access Control (RBAC)**: Distinct permissions for **Teachers** (content management) and **Students** (content consumption).
- **Secure Authentication**: Implementation of **JWT (JSON Web Tokens)** for secure, stateless sessions.
- **Advanced Media Handling**: Support for large video uploads, custom thumbnails, and automatic file cleanup on the server.
- **Dynamic Content Library**: Authorized users can browse, search, and filter lectures in real-time.
- **Teacher Studio**: A dedicated private space for educators to upload, view, and delete their own lectures.
- **Personalized Profiles**: Users can customize their identity by uploading profile pictures.
- **Interactive Player**: Custom video viewing experience including lecture descriptions and metadata.

##  Tech Stack

### Backend
- **Node.js & Express**: Core server logic and RESTful API.
- **MongoDB & Mongoose**: NoSQL database for flexible data modeling and relations.
- **Multer**: Multi-part form data handling for media uploads.
- **Bcryptjs**: Industrial-grade password hashing.
- **JWT**: Secure authentication layer.

### Frontend
- **Vanilla JavaScript (ES6+)**: Clean, framework-less logic for high performance.
- **Tailwind CSS**: Utility-first styling for a "Modern Dark Tech" aesthetic.
- **JetBrains Mono**: Typography selected for a clean, technical look.

---

## Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/public.lecture.git
cd public.lecture

npm install express mongoose dotenv cors multer bcryptjs jsonwebtoken
