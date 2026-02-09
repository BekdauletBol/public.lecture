# public.edu — Educational Video Platform. 

## Project Overview

**public.edu** is a full-stack educational video platform developed as a final project using Node.js, Express, and MongoDB.

The platform enables users to securely register, authenticate, and interact with educational video content. It implements role-based access control, allowing teachers to upload and manage lectures, while students can browse and watch available content.

The system is designed with a modular backend architecture, secure authentication, proper database modeling, and RESTful API principles, meeting all requirements of the final project specification.

<img width="1440" height="900" alt="Screenshot 2026-02-06 at 12 18 35 PM" src="https://github.com/user-attachments/assets/d010848c-5802-46f6-9d30-535803aef892" /># public.edu — Video Context Platform

---

## Functional Scope. 

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

### Project Structure
```

public.lecture
├─ app
│  ├─ backend
│  │  ├─ config
│  │  │  ├─ auth.config.js
│  │  │  └─ db.config.js
│  │  ├─ controllers
│  │  │  ├─ auth.controller.js
│  │  │  ├─ user.controller.js
│  │  │  └─ video.controller.js
│  │  ├─ middlewares
│  │  │  ├─ authJwt.js
│  │  │  └─ verifySignUp.js
│  │  ├─ models
│  │  │  ├─ index.js
│  │  │  ├─ user.model.js
│  │  │  └─ video.model.js
│  │  ├─ routes
│  │  │  ├─ auth.routes.js
│  │  │  ├─ user.routes.js
│  │  │  └─ video.routes.js
│  │  └─ uploads
│  └─ frontend
│     ├─ assets
│     ├─ css
│     ├─ html
│     └─ js
├─ package.json
├─ package-lock.json
└─ README.md
```

---

## Database Design

The project uses **MongoDB** as the primary data storage with **Mongoose** for schema modeling

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

## Installation and Setup

### Requirements
- Node.js v16 or higher
- MongoDB (local or MongoDB Atlas)
- npm

### Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/BekdauletBol/public.lecture.git
cd public.edu
````

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file:

```env
PORT=5000
MONGO_URI="mongodb+srv://bolatovbekdaulet4_db_user:qweasdzxc890@publiclecture.t4maxdv.mongodb.net/?appName=publicLecture"
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


## Team and Contribution

This project was developed as a collaborative final project.

Team members:

* Bekdaulet Bolatov
* Sultan Muratbek
## friendly-toffee-745a51.netlify.app
* Daniyar Kairatov

All team members contributed to backend development, database design, API implementation, and frontend integration, and are prepared to explain the system architecture and implementation decisions during project defense.
## link: https://lovely-clafoutis-06a82b.netlify.app/index.html
