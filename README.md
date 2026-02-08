# public.edu — Educational Video Platform

## Project Overview

**public.edu** is a full-stack educational video platform developed as a final project using Node.js, Express, and MongoDB.

The platform enables users to securely register, authenticate, and interact with educational video content. It implements role-based access control, allowing teachers to upload and manage lectures, while students can browse and watch available content.

The system is designed with a modular backend architecture, secure authentication, proper database modeling, and RESTful API principles, meeting all requirements of the final project specification.

<img width="1440" height="900" alt="Screenshot 2026-02-06 at 12 18 35 PM" src="https://github.com/user-attachments/assets/d010848c-5802-46f6-9d30-535803aef892" /># public.edu — Video Context Platform

---

## Project Topic

Educational video platform for lecture hosting, management, and consumption.

---

## Functional Scope

The platform provides the following core functionality:

- User registration and authentication
- Secure profile management
- Role-based access control (student / teacher)
- Video lecture upload and management
- Centralized lecture library
- Secure media storage and cleanup
- REST API with protected endpoints

---

## Technology Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- Multer
- dotenv
- CORS

### Frontend
- Vanilla JavaScript (ES6+)
- Tailwind CSS

The frontend intentionally avoids heavy frameworks to demonstrate understanding of core JavaScript and client–server interaction.

---

## Project Structure

The backend follows a fully modular structure as required:

```

backend/
├── controllers/
├── models/
├── routes/
├── middleware/
├── uploads/
├── config/
└── server.js

````

Frontend assets are separated into pages, scripts, styles, and static resources.

---

## Database Design

The project uses **MongoDB** as the primary data storage with **Mongoose** for schema modeling.

### Collections

### 1. User

Stores authentication and profile-related information.

Fields:
- username (String)
- email (String)
- password (hashed)
- role (student / teacher)
- avatar (String)
- createdAt (Date)

### 2. Lecture

Stores metadata and file references for uploaded video lectures.

Fields:
- title (String)
- description (String)
- videoPath (String)
- thumbnail (String)
- owner (ObjectId → User)
- createdAt (Date)

The relationship between collections is implemented using Mongoose references.

---

## API Documentation

### Authentication (Public Endpoints)

- **POST /api/auth/register**  
  Registers a new user with encrypted password storage.

- **POST /api/auth/login**  
  Authenticates user credentials and returns a JWT.

---

### User Management (Private Endpoints)

- **GET /api/users/profile**  
  Retrieves the authenticated user’s profile.

- **PUT /api/users/profile**  
  Updates user profile data (username, email, avatar).

---

### Lecture Management (Private Endpoints)

- **POST /api/lectures**  
  Creates a new lecture (teacher only).

- **GET /api/lectures**  
  Retrieves all available lectures.

- **GET /api/lectures/:id**  
  Retrieves a specific lecture by ID.

- **PUT /api/lectures/:id**  
  Updates lecture metadata (owner only).

- **DELETE /api/lectures/:id**  
  Deletes a lecture and removes associated files (owner only).

---

## Authentication and Security

- JWT is used for stateless user authentication.
- Private routes are protected via authentication middleware.
- Passwords are securely hashed using bcrypt.
- Access control is enforced by role and resource ownership.

---

## Validation and Error Handling

- Incoming request data is validated before processing.
- The API returns meaningful HTTP status codes:
  - 400 — Bad Request
  - 401 — Unauthorized
  - 404 — Not Found
  - 500 — Internal Server Error
- Centralized error-handling middleware is implemented for consistency.

---

## Screenshots

### Authentication Interface
User registration and login functionality.

<img src="frontend/assets/screenshots/auth.png" width="800">

### Lecture Library
Browsing, searching, and viewing available lectures.

<img src="frontend/assets/screenshots/library.png" width="800">

### Teacher Studio
Lecture upload and management interface.

<img src="frontend/assets/screenshots/teacher.png" width="800">

---

## Installation and Setup

### Requirements
- Node.js v16 or higher
- MongoDB (local or MongoDB Atlas)
- npm

### Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/your-username/public.edu.git
cd public.edu
````

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

4. Start the server:

```bash
npm start
```

The application will be available at:

```
http://localhost:5000
```

---

## Deployment

The project is deployed on a cloud hosting platform.

* Environment variables are stored securely
* MongoDB Atlas is used for the production database

Deployment URL:
**[add deployed project link here]**

---

## Team and Contribution

This project was developed as a collaborative final project.

Team members:

* Bekdaulet Bolatov
* Sultan Muratbek
* Daniyar Kairatov

All team members contributed to backend development, database design, API implementation, and frontend integration, and are prepared to explain the system architecture and implementation decisions during project defense.

---

## Defence Readiness

The project fully satisfies the final project requirements:

* Node.js and Express backend
* MongoDB with multiple collections
* JWT authentication and bcrypt password hashing
* Role-based access control
* Modular code structure
* API documentation
* Screenshots of all major features
* Deployment and environment configuration
