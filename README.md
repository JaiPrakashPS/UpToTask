# UpToTask

> A minimalist, distraction-free personal task management web application built on the MERN stack.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-up--to--task--4t5w.vercel.app-black?style=for-the-badge&logo=vercel)](https://up-to-task-4t5w.vercel.app)
[![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node%20%7C%20Express%20%7C%20MongoDB-black?style=for-the-badge)](https://github.com/JaiPrakashPS/UpToTask)
[![License: ISC](https://img.shields.io/badge/License-ISC-black?style=for-the-badge)](LICENSE)

---

## Live Links & Repositories

- **Live Application**: [https://up-to-task-4t5w.vercel.app](https://up-to-task-4t5w.vercel.app)
- **GitHub Repository**: [https://github.com/JaiPrakashPS/UpToTask](https://github.com/JaiPrakashPS/UpToTask)
- **User & Technical Guide**: [`DOCUMENTATION.md`](./DOCUMENTATION.md)
- **Word Document Manual**: [`UpToTask_Documentation.docx`](./UpToTask_Documentation.docx)

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 (Vite), React Router v7, Axios, Lucide React, `@react-oauth/google` |
| **Backend** | Node.js, Express.js (REST API & Vercel Serverless) |
| **Database** | MongoDB Atlas (Cloud Cluster via Mongoose ODM) |
| **Authentication** | JWT (JSON Web Tokens) & Google OAuth 2.0 (Google Identity Services) |
| **Styling** | High-contrast Minimalist Black & White CSS (`#000000`, `#FFFFFF`, `#666666`, `#DDDDDD`) |
| **Hosting** | Vercel (CI/CD automated deployment) |

---

## Key Features

### 1. Authentication & Security
- **Dual Authentication**:
  - **Email & Password**: Secure registration and login with bcrypt password hashing and JWT token issuance.
  - **Google One-Click Sign-In**: Powered by `@react-oauth/google` with automatic account creation and token verification.
- **Session Protection**: Route guards (`ProtectedRoute`) redirect unauthenticated users to `/login`.
- **Strict Data Isolation**: Tasks are strictly isolated per user ID (`userId`). Users cannot view, modify, or delete tasks belonging to others.

### 2. Task Management (CRUD)
- **Create Task**: Create tasks with Task Name, Description, Status (`Planned`, `In Progress`, `Complete`), and optional Due Date.
- **Edit Task**: In-place modal to modify title, description, status, or due date.
- **Delete Task**: Safe deletion flow with a confirmation dialog before permanent removal.
- **Inline Status Toggle**: Switch task status instantly via the badge dropdown on each task card.
- **Auto-Synchronized Progress**:
  - `Planned` $\rightarrow$ **0%**
  - `In Progress` $\rightarrow$ **50%**
  - `Complete` $\rightarrow$ **100%**

### 3. Productivity & Organization
- **Real-Time Search**: Instant search bar filtering tasks dynamically by title and description with a one-click clear button.
- **Status Filter Tabs**: Filter tasks quickly across **All**, **Planned**, **In Progress**, and **Complete** with live item count badges.
- **Due Date Indicator**: Visual calendar badge displaying formatted due dates on task cards.

### 4. User Profile & Analytics (`/profile`)
- **User Info Card**: Displays name, registered email address, and account creation date.
- **Productivity Dashboard**: Real-time task statistics including:
  - Total tasks created
  - Tasks completed
  - Tasks in progress
  - Tasks planned
  - Visual overall completion rate progress bar (%)

---

## Project Structure

```text
UpToTask/
├── client/                               # Vite + React 18 Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx                # Header with navigation, user avatar, and logout
│   │   │   ├── TaskCard.jsx              # Task item card with status dropdown & action buttons
│   │   │   ├── TaskModal.jsx             # Unified Create & Edit Task modal
│   │   │   ├── DeleteModal.jsx           # Safe confirmation modal for task deletion
│   │   │   └── ProtectedRoute.jsx        # Authentication route guard
│   │   ├── context/
│   │   │   └── AuthContext.jsx           # Global authentication state & handlers
│   │   ├── pages/
│   │   │   ├── Login.jsx                 # Email/Password + Google OAuth login
│   │   │   ├── Signup.jsx                # New user registration
│   │   │   ├── Dashboard.jsx             # Task list, search, filters, CRUD modals
│   │   │   └── Profile.jsx               # User profile & task productivity metrics
│   │   ├── services/
│   │   │   └── api.js                    # Axios instance with JWT interceptor & auto-URL normalization
│   │   ├── App.jsx                       # React Router v7 routes
│   │   ├── main.jsx                      # App root with GoogleOAuthProvider & canonical domain redirect
│   │   └── index.css                     # Monochrome styling and design tokens
│   ├── index.html
│   ├── vite.config.js
│   ├── vercel.json                       # Client SPA routing rewrite configuration
│   └── package.json
│
├── server/                               # Node.js + Express REST API
│   ├── config/
│   │   └── db.js                         # MongoDB Atlas Mongoose connection with caching
│   ├── controllers/
│   │   ├── authController.js             # Signup, Login, Google OAuth, Me
│   │   └── taskController.js             # Task CRUD, status updates, and stats endpoint
│   ├── middleware/
│   │   ├── authMiddleware.js             # JWT bearer verification middleware
│   │   └── errorMiddleware.js            # Centralized error handler
│   ├── models/
│   │   ├── User.js                       # User schema (name, email, password, googleId)
│   │   └── Task.js                       # Task schema (taskName, description, progress, status, dueDate, userId)
│   ├── routes/
│   │   ├── authRoutes.js                 # /api/auth/* routes
│   │   └── taskRoutes.js                 # /api/tasks/* routes
│   ├── server.js                         # Express server entrypoint
│   ├── vercel.json                       # Vercel serverless deployment configuration
│   ├── test-api.js                       # 17 automated end-to-end API tests
│   ├── .env.example
│   └── package.json
│
├── DOCUMENTATION.md                      # Comprehensive user and technical documentation
├── UpToTask_Documentation.docx           # Official Word document manual
├── README.md                             # Project overview and setup guide
└── package.json
```

---

## Environment Configuration

### Backend (`server/.env`)

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?appName=Cluster0
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
CLIENT_URL=http://localhost:5173
```

### Frontend (`client/.env`)

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

> **Google OAuth Configuration**:
> In the [Google Cloud Console](https://console.cloud.google.com/apis/credentials), add these to **Authorized JavaScript origins**:
> - `http://localhost:5173` (for local development)
> - `https://up-to-task-4t5w.vercel.app` (for production)
>
> *(Note for Brave Browser users: ensure Brave Shields allow third-party Google authentication buttons under `brave://settings/socialBlocking`)*.

---

## Quick Start (Local Development)

### 1. Clone the Repository
```bash
git clone https://github.com/JaiPrakashPS/UpToTask.git
cd UpToTask
```

### 2. Install Dependencies
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 3. Start Backend Server
```bash
cd ../server
npm run dev
# Server runs at http://localhost:5000
```

### 4. Start Frontend Application
```bash
cd ../client
npm run dev
# Application opens at http://localhost:5173
```

---

## Automated Testing

The backend includes an automated test suite verifying all 17 critical endpoints and security guarantees:

```bash
cd server
node test-api.js
```

**Test Coverage Includes:**
- User registration and password validation
- Duplicate email prevention
- Password hashing and login verification
- JWT generation and `/api/auth/me` protected retrieval
- Google OAuth token validation
- Task CRUD operations (Create, Read, Update, Delete)
- Status auto-sync with progress percentages (0%, 50%, 100%)
- Cross-user data isolation (rejection of unauthorized access with HTTP 403)
- Real-time productivity metrics (`/api/tasks/stats`)

---

## REST API Specification

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Register new user with name, email, password | No |
| `POST` | `/api/auth/login` | Authenticate with email & password | No |
| `POST` | `/api/auth/google` | Verify Google ID token & sign in / sign up | No |
| `GET` | `/api/auth/me` | Fetch currently authenticated user profile | Yes (Bearer Token) |

### Task Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/tasks` | Get all tasks for authenticated user | Yes (Bearer Token) |
| `POST` | `/api/tasks` | Create a new task | Yes (Bearer Token) |
| `GET` | `/api/tasks/:id` | Get single task by ID (owner only) | Yes (Bearer Token) |
| `PUT` | `/api/tasks/:id` | Update task details (owner only) | Yes (Bearer Token) |
| `DELETE`| `/api/tasks/:id` | Delete task permanently (owner only) | Yes (Bearer Token) |
| `PATCH` | `/api/tasks/:id/status`| Update status & auto-sync progress | Yes (Bearer Token) |
| `GET` | `/api/tasks/stats` | Retrieve user productivity statistics | Yes (Bearer Token) |

---

## Deployment (Vercel)

Both the frontend and backend are configured for zero-configuration deployment on **Vercel**:
- **Frontend**: Configured with `client/vercel.json` for Single Page Application (SPA) routing rewrites.
- **Backend**: Configured with `server/vercel.json` as an Express serverless function with MongoDB connection pooling.
- **Canonical Domain Protection**: The frontend automatically routes all preview deployments to the canonical production URL to maintain seamless Google OAuth origin compliance.

---

---

## License

This project is licensed under the **ISC License**.
