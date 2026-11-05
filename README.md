# 🛍️ Canflare – Full-Stack MERN E-Commerce Platform

A production-grade, modular Full-Stack MERN (MongoDB, Express.js, React, Node.js) e-commerce project scaffold engineered with clean architecture, strict separation of concerns, and full independence between frontend and backend.

---

## 📁 Project Architecture & Directory Structure

```text
canflareproject/
├── .gitignore                   # Global gitignore protecting all secrets & dependencies
├── package.json                 # Monorepo root scripts (concurrently dev runner)
├── README.md                    # Setup, architecture & command reference
│
├── frontend/                    # Client Application (React 19 + Vite + Tailwind CSS)
│   ├── .env                     # Local frontend environment variables (Git-ignored)
│   ├── .env.example             # Documented template for client variables
│   ├── .gitignore               # Frontend-specific ignore rules
│   ├── index.html               # Main HTML entry point
│   ├── package.json             # Frontend dependencies & scripts
│   ├── vite.config.js           # Vite build and Tailwind CSS v4 configuration
│   └── src/
│       ├── api/                 # Centralized API service layer
│       │   ├── axiosInstance.js # Configured Axios with interceptors & error handlers
│       │   ├── healthApi.js     # Health check API requests
│       │   └── index.js         # API layer barrel export
│       ├── components/          # Reusable UI components
│       │   ├── ArchitectureCard.jsx
│       │   ├── HealthCard.jsx   # Live backend connectivity monitor
│       │   └── Navbar.jsx       # Header with real-time status & cart indicator
│       ├── store/               # Redux Toolkit global state store
│       │   ├── index.js         # Configured Redux store
│       │   └── slices/          # Feature slices
│       │       ├── authSlice.js # Authentication state & token management
│       │       ├── cartSlice.js # Shopping cart state & actions
│       │       └── healthSlice.js # Health status & async thunks
│       ├── App.jsx              # Root component
│       ├── index.css            # Tailwind CSS imports & theme styles
│       └── main.jsx             # React DOM root wrapped with Redux Provider
│
└── backend/                     # Server Application (Node.js + Express + MongoDB)
    ├── .env                     # Backend secrets & config (Git-ignored)
    ├── .env.example             # Documented template for server variables
    ├── .gitignore               # Backend-specific ignore rules
    ├── package.json             # Backend dependencies & scripts (ES Modules)
    └── src/
        ├── app.js               # Express app configuration & middleware pipeline
        ├── server.js            # Server entrypoint & database bootstrap
        ├── config/
        │   └── db.js            # Mongoose MongoDB connection & error resilience
        ├── controllers/
        │   └── healthController.js # Server & database health check controller
        ├── middleware/
        │   └── errorMiddleware.js  # Centralized 404 & global error handling
        ├── models/              # Reserved for Mongoose schemas (User, Product, Order)
        └── routes/
            └── healthRoutes.js  # Modular health endpoints (/api/health)
```

---

## 🚀 Key Features Configured

- **Independent Execution**: Both `frontend` and `backend` contain their own isolated `package.json`, `.env`, and dependencies. They can be deployed and scaled independently.
- **Root Orchestration**: Run both servers together with a single command via `npm run dev` using `concurrently`.
- **Reusable API Service Layer**: Axios instance pre-configured with:
  - Base URL from `VITE_API_BASE_URL`
  - Automatic `Bearer ${token}` injection from localStorage
  - Unified error transformation
- **State Management with Redux Toolkit**:
  - Global `store` configured with Redux DevTools enabled
  - Modular slices: `healthSlice` (with `createAsyncThunk`), `cartSlice`, and `authSlice`
- **Express Middleware & Security**:
  - CORS with configurable origin validation
  - Built-in JSON body parsing (`express.json({ limit: '10mb' })`)
  - URL-encoded parsing (`express.urlencoded`)
  - Morgan HTTP logging
  - Centralized 404 Not Found and 500 error handling middleware
- **Resilient Database Layer**:
  - Mongoose connection handler with connection status monitoring and non-blocking timeout handling so the API can operate during local MongoDB startup.
- **Environment Secrets Shielded**: `.env` files are strictly excluded via `.gitignore`, with `.env.example` templates committed for onboarding.

---

## 🛠️ Getting Started

### Prerequisites
- **Node.js** (v18.x, v20.x, or v24+ recommended)
- **MongoDB** (Local instance or MongoDB Atlas connection string)

### 1. Install Dependencies

You can install all dependencies across root, frontend, and backend in one step:
```bash
npm run install:all
```

Or install them individually:
```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 2. Configure Environment Variables

The project includes `.env.example` files in both directories. Copies have been generated as `.env` for immediate use:

**Frontend (`frontend/.env`):**
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME="ApexCart E-Commerce"
```

**Backend (`backend/.env`):**
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/ecommerce_db
CLIENT_URL=http://localhost:5173
```

---

## ⚡ Running the Applications

### Option A: Run Both Simultaneously (Recommended)
From the root workspace:
```bash
npm run dev
```
This runs the backend on `http://localhost:5000` and the frontend on `http://localhost:5173` concurrently.

### Option B: Run Independently

**Terminal 1 (Backend API):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend Client):**
```bash
cd frontend
npm run dev
```

---

## 🧪 Verification & Health Check

1. Open your browser and navigate to **`http://localhost:5173`**.
2. The UI will automatically ping the backend using Axios and Redux Toolkit.
3. Or test directly via terminal:
   ```bash
   curl http://localhost:5000/api/health
   ```
