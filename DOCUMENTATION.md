# UpToTask - User & Technical Documentation

---

## 1. How to Access and Use the Application

### 1.1 Accessing the Application
- **Live Cloud Deployment**: [https://up-to-task-4t5w.vercel.app](https://up-to-task-4t5w.vercel.app)
- **Local Development**: `http://localhost:5173`

---

### 1.2 Navigating the Application

#### Navigation Bar (Header)
- **Brand Logo (`UpToTask`)**: Clicking the logo returns to the Dashboard (`/dashboard`).
- **Profile Button**: Located at the top right; navigates to the User Profile & Statistics page (`/profile`). When on the Profile page, it toggles to a **Tasks** button to return to the Dashboard.
- **User Identifier**: Displays the authenticated user's name or email.
- **Logout Button**: Ends the session, clears cached authentication tokens, and redirects to the Login screen.

---

### 1.3 Main Features on the Dashboard

#### Creating a Task
1. Click the black **`+ Create Task`** button in the header.
2. Complete the task modal fields:
   - **Task Name** *(Required)*: Title of the task.
   - **Description** *(Required)*: Brief details of what needs to be done.
   - **Status** *(Required)*: Choose `Planned`, `In Progress`, or `Complete`.
   - **Due Date** *(Optional)*: Select a target completion date.
3. Click **Create Task**. The new task appears immediately at the top of your list.

#### Searching Tasks
- Use the **Search Bar** above the task list to find tasks in real-time.
- Type any keyword; the search dynamically filters through both **Task Names** and **Descriptions** (case-insensitive).
- Click the **`X`** icon inside the search bar to instantly clear your search query.

#### Filtering by Status
Click any of the status filter pills above the task list:
- **All**: Displays all tasks with total count.
- **Planned**: Shows tasks not yet started.
- **In Progress**: Shows tasks currently underway.
- **Complete**: Shows finished tasks.

#### Quick Status Update
- Each task card features an interactive status dropdown badge on the top right (`Planned`, `In Progress`, `Complete`).
- Changing the dropdown directly updates the task status and automatically synchronizes the progress percentage:
  - `Planned` $\rightarrow$ **0%**
  - `In Progress` $\rightarrow$ **50%**
  - `Complete` $\rightarrow$ **100%**

#### Editing a Task
1. Click the **Edit** button on any task card.
2. The modal pre-fills with existing task data.
3. Modify the Task Name, Description, Status, or Due Date.
4. Click **Save Changes**. The task updates in real-time.

#### Deleting a Task
1. Click the **Delete** button on any task card.
2. A confirmation dialog appears: *"Are you sure you want to delete this task?"*
3. Click **Delete** to permanently remove it, or **Cancel** to abort.

---

### 1.4 Profile & Task Statistics (`/profile`)
1. Click the **Profile** icon in the top-right navbar.
2. View your account overview:
   - **User Initial Avatar & Name**
   - **Registered Email Address**
   - **Member Since Date**
3. **Task Statistics Dashboard**:
   - **Total Tasks**: Total count of all tasks created by your account.
   - **Completed**: Total tasks marked as Complete.
   - **In Progress**: Tasks currently in progress.
   - **Planned**: Tasks scheduled but not started.
   - **Overall Completion Rate**: Visual percentage bar reflecting completed vs. total tasks.
4. Click **Back to Tasks** to return to the main dashboard.

---

## 2. Login Instructions

UpToTask supports two secure authentication methods:

### 2.1 Standard Email & Password Authentication

#### New Account Registration (Signup):
1. Navigate to `/signup` or click **Sign Up** from the login page.
2. Enter your details:
   - **Name**: Your full name (cannot be empty).
   - **Email**: A valid email address (must be unique).
   - **Password**: Minimum 6 characters.
   - **Confirm Password**: Must match password exactly.
3. Click **Create Account**. You will be logged in and redirected to your Dashboard.

#### Existing User Login:
1. Navigate to `/login`.
2. Enter your registered **Email** and **Password**.
3. Click **Login**. Upon verification, you will be taken to your Dashboard.

---

### 2.2 Google OAuth Authentication
1. On the `/login` page, click **"Continue with Google"**.
2. A secure Google authentication popup will open.
3. Select your Google account and grant standard profile access.
4. The system automatically creates a new account (or links an existing one) in MongoDB and logs you in without requiring a password.

---

### 2.3 Session Management & Logout
- Your session is securely stored via a JWT (JSON Web Token) in your browser's local storage.
- If a session expires or is invalidated, the application will automatically clear credentials and redirect to `/login`.
- To manually sign out, click the **Logout** button in the navbar.

---

## 3. Important Assumptions Made

1. **User Data Isolation**: 
   - Every task is strictly linked to the authenticated user's MongoDB `ObjectId` (`userId`). Users cannot access, view, edit, or delete tasks belonging to other accounts.
2. **Status-Driven Progress**:
   - Progress is intentionally tied to task status (`Planned = 0%`, `In Progress = 50%`, `Complete = 100%`) to keep the interface fast, minimal, and prevent manual micro-management.
3. **Minimalist Black & White Theme**:
   - In accordance with the PRD design specifications, the user interface strictly adheres to a monochromatic palette (`#000000`, `#FFFFFF`, `#666666`, `#DDDDDD`) without distracting animations, gradients, or heavy shadows.
4. **Timezone Handling**:
   - Due dates are stored in standard UTC ISO format in MongoDB and dynamically rendered in the user's browser local timezone.
5. **Single-Page Application (SPA) Routing**:
   - All navigation uses client-side routing (`react-router-dom`) with Vercel rewrites to ensure direct URL access to `/dashboard`, `/profile`, `/login`, and `/signup` without 404 errors.

---

## 4. Known Limitations

1. **No Real-Time Multi-User Collaboration**:
   - UpToTask is designed as an individual task manager. Shared workspaces, task assignment, and real-time multiplayer editing (e.g. WebSockets) are not included.
2. **Permanent Task Deletion**:
   - There is no "Trash Bin" or recovery period; once a task deletion is confirmed, it is permanently removed from MongoDB.
3. **No Offline Mode**:
   - The application requires an active internet connection to communicate with the REST API and MongoDB Atlas.
4. **Google OAuth Domain Propagation**:
   - When deploying to new domains or ports, Google Cloud Console requires 5–10 minutes to propagate newly added Authorized JavaScript Origins.

---

## 5. Important Notes & Warnings for Users

> [!IMPORTANT]
> **Password Security**: Passwords are cryptographically hashed using **bcrypt** with 10 salt rounds before being stored in the database. Passwords can never be viewed in plaintext by database administrators.

> [!WARNING]
> **Access Control (HTTP 403)**: Tampering with API requests or attempting to query another user's task ID via REST clients will be rejected by the backend with HTTP `403 Forbidden`.

> [!NOTE]
> **Session Expiry**: Login tokens remain valid for **7 days**. After 7 days, you will be prompted to log in again to renew your security credentials.

> [!CAUTION]
> **MongoDB Atlas Whitelist**: When deploying the backend to serverless cloud providers like Vercel, ensure your MongoDB Atlas **Network Access** includes `0.0.0.0/0` (Allow Access from Anywhere); otherwise, serverless database connections will time out.

---

## 6. Setup & Installation Instructions

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher
- **MongoDB**: Local MongoDB instance (`mongodb://127.0.0.1:27017`) or MongoDB Atlas connection string.
- **Git**: Installed on your system.

---

### 6.1 Local Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/JaiPrakashPS/UpToTask.git
cd UpToTask
```

#### 2. Configure Backend (`server/`)
1. Navigate to the server folder:
   ```bash
   cd server
   npm install
   ```
2. Create a `.env` file in `server/` (or copy from `.env.example`):
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/uptotask?retryWrites=true&w=majority
   JWT_SECRET=uptotask_super_secret_jwt_key_2026
   JWT_EXPIRES_IN=7d
   GOOGLE_CLIENT_ID=your_google_client_id_here
   CLIENT_URL=http://localhost:5173
   ```
3. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server will start on `http://localhost:5000` and connect to MongoDB.*

4. Run automated backend test suite:
   ```bash
   node test-api.js
   ```

---

#### 3. Configure Frontend (`client/`)
1. In a separate terminal, navigate to the client folder:
   ```bash
   cd ../client
   npm install
   ```
2. Create a `.env` file in `client/`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
   ```
3. Start the client development server:
   ```bash
   npm run dev
   ```
4. Open **`http://localhost:5173`** in your browser.

---

### 6.2 Cloud Deployment on Vercel

UpToTask is pre-configured with [`server/vercel.json`](file:///d:/Assessment/server/vercel.json) and [`client/vercel.json`](file:///d:/Assessment/client/vercel.json) for zero-config Vercel deployment:

1. **Deploy Backend (`server`)**:
   - In Vercel, import the repository and set **Root Directory** to `server`.
   - Set Environment Variables: `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `GOOGLE_CLIENT_ID`.
   - Deploy and note your API URL (e.g., `https://uptotask-api.vercel.app`).

2. **Deploy Frontend (`client`)**:
   - Import the repository again, set **Root Directory** to `client`, Framework Preset to `Vite`.
   - Set Environment Variables:
     - `VITE_API_URL` = `https://uptotask-api.vercel.app/api`
     - `VITE_GOOGLE_CLIENT_ID` = `your_google_client_id` (Type: **Config**)
   - Deploy.

3. **Whitelist Domain in Google OAuth**:
   - Add your live Vercel frontend URL to **Authorized JavaScript origins** in Google Cloud Console Credentials.
