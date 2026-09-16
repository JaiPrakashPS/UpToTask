# UpToTask

> Simple, minimal, and secure personal task management application built with the MERN stack.

UpToTask focuses on a clean, minimal black-and-white UI with essential task-management functionality, JWT and Google OAuth authentication, progress tracking, duration tracking, and status workflows.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js (Vite), React Router v7, Axios, Lucide React, Google OAuth |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Local / MongoDB Atlas Cluster via Mongoose) |
| **Authentication** | JWT (JSON Web Tokens) & Google OAuth 2.0 |
| **Styling** | Minimalist Black & White CSS (#000000, #FFFFFF, #666666, #DDDDDD) |
| **Version Control** | Git |

---

## Features (Functional Requirements)

- **FR-01: User Signup**: Register with Name, Email, Password, and Confirm Password with comprehensive validation.
- **FR-02: User Login**: Secure login with bcrypt-hashed passwords and JWT generation.
- **FR-03: Google Authentication**: One-click Google Sign-In with automated user profile creation/retrieval.
- **FR-04: User Logout**: Single-click session termination and local storage cleanup.
- **FR-05: Create Task**: Create tasks with Task Name, Description, Progress (0–100%), Duration (value + unit: Minutes, Hours, Days), and Status (Planned, In Progress, Complete).
- **FR-06: View Tasks**: View all tasks belonging strictly to the logged-in user in a responsive layout with ASCII block progress indicators (`████████████░░░░░░░░`).
- **FR-07: Edit Task**: Update task title, description, duration, progress, and status with immediate feedback.
- **FR-08: Delete Task**: Modal confirmation dialog ("Are you sure you want to delete this task?") before permanent database removal.
- **FR-09: Update Task Progress**: Track progress from 0% to 100% with dual slider/input control and progress bar.
- **FR-10: Update Task Status**: Switch between Planned, In Progress, and Complete. Marking status as Complete automatically syncs progress to 100%.
- **FR-11: MongoDB Persistence**: Fully persistent data stored in MongoDB using Mongoose schemas.
- **FR-12: Data Isolation & Security**: Tasks are strictly scoped to the authenticated user's ID; access/modification attempts across users are rejected with HTTP 403 Forbidden.

---

## Project Structure

```text
uptotask/
├── client/                     # Vite + React.js SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Clean header with user info & logout
│   │   │   ├── TaskCard.jsx         # Card with progress bar, status, duration, actions
│   │   │   ├── TaskModal.jsx        # Unified Create & Edit Task modal dialog
│   │   │   ├── DeleteModal.jsx      # Confirmation modal for task deletion
│   │   │   └── ProtectedRoute.jsx   # Route guard for authenticated pages
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Authentication state (token, user, login, logout)
│   │   ├── pages/
│   │   │   ├── Login.jsx            # Email/Password + Google OAuth login
│   │   │   ├── Signup.jsx           # Name, Email, Password, Confirm Password
│   │   │   └── Dashboard.jsx        # Task list, filters, empty state, CRUD modals
│   │   ├── services/
│   │   │   └── api.js               # Axios instance with auth interceptors
│   │   ├── App.jsx                  # React Router setup
│   │   ├── main.jsx                 # App root with GoogleOAuthProvider wrapper
│   │   └── index.css                # Minimalist Black/White/Gray styling
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                     # Node.js + Express.js REST API
│   ├── config/
│   │   └── db.js                    # Mongoose MongoDB connection
│   ├── controllers/
│   │   ├── authController.js        # Signup, Login, Google OAuth, Me
│   │   └── taskController.js        # Create, List, Get, Update, Delete, Patch Status
│   ├── middleware/
│   │   ├── authMiddleware.js        # JWT verification middleware
│   │   └── errorMiddleware.js       # Centralized error handler
│   ├── models/
│   │   ├── User.js                  # User schema (name, email, password, googleId)
│   │   └── Task.js                  # Task schema (taskName, description, progress, duration, status, userId)
│   ├── routes/
│   │   ├── authRoutes.js            # /api/auth/* endpoints
│   │   └── taskRoutes.js            # /api/tasks/* endpoints
│   ├── server.js                    # Express app entrypoint & middleware
│   ├── test-api.js                  # Automated test suite for all endpoints
│   ├── .env.example
│   └── package.json
│
├── .gitignore
├── README.md
└── package.json
```

---

## Environment Variables

### Backend (`server/.env`)

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/uptotask
JWT_SECRET=uptotask_super_secret_jwt_key_2026
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your_google_client_id_here
CLIENT_URL=http://localhost:5173
```

> **Note**: For MongoDB Atlas, replace `MONGODB_URI` with your connection string:
> `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/uptotask?retryWrites=true&w=majority`

### Frontend (`client/.env`)

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

---

## Quick Start

### 1. Install Dependencies

In the root directory, you can run:

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Start the Backend Server

```bash
cd server
npm run dev
# or npm start
```
The server will start on `http://localhost:5000` and connect to MongoDB.

### 3. Start the Frontend Application

```bash
cd client
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## Running the Automated Test Suite

A complete test suite covering signup, validation, login, duplicate detection, Google authentication, protected routes, task CRUD, status auto-sync, and cross-user data isolation is included:

```bash
cd server
node test-api.js
```

---

## REST API Specification

### Authentication

#### Signup
- **Endpoint**: `POST /api/auth/signup`
- **Body**:
  ```json
  {
    "name": "Jai Prakash",
    "email": "jai@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }
  ```
- **Response**: `201 Created` with JWT token and user info.

#### Login
- **Endpoint**: `POST /api/auth/login`
- **Body**:
  ```json
  {
    "email": "jai@example.com",
    "password": "password123"
  }
  ```
- **Response**: `200 OK` with JWT token and user info.

#### Google OAuth
- **Endpoint**: `POST /api/auth/google`
- **Body**:
  ```json
  {
    "credential": "<google_id_token>"
  }
  ```
- **Response**: `200 OK` with JWT token and user info.

#### Get Current User
- **Endpoint**: `GET /api/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200 OK` with user details.

---

### Tasks

All task endpoints require `Authorization: Bearer <token>`.

#### Create Task
- **Endpoint**: `POST /api/tasks`
- **Body**:
  ```json
  {
    "taskName": "Complete MERN Project",
    "description": "Build and deploy the task management application.",
    "progress": 60,
    "duration": {
      "value": 3,
      "unit": "Hours"
    },
    "status": "In Progress"
  }
  ```
- **Response**: `201 Created`

#### Get All Tasks
- **Endpoint**: `GET /api/tasks`
- **Response**: `200 OK` with array of tasks belonging to the authenticated user.

#### Get Single Task
- **Endpoint**: `GET /api/tasks/:id`
- **Response**: `200 OK` with task details. Rejects non-owners with `403 Forbidden`.

#### Update Task
- **Endpoint**: `PUT /api/tasks/:id`
- **Body**: Updates `taskName`, `description`, `progress`, `duration`, `status`.
- **Response**: `200 OK`

#### Delete Task
- **Endpoint**: `DELETE /api/tasks/:id`
- **Response**: `200 OK`

#### Update Task Status
- **Endpoint**: `PATCH /api/tasks/:id/status`
- **Body**:
  ```json
  {
    "status": "Complete"
  }
  ```
- **Response**: `200 OK` (automatically sets `progress: 100` when marked Complete).

---

## License

ISC
