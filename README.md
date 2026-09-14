# 🇮🇳 BHOOMI-SETU (भूमि सेतु)
### National Digital Land Acquisition & Compensation Assessment Platform

A full-stack, enterprise-grade government portal connecting the **Ministry Apex Body (MoRTH / PM GatiShakti)**, **Regional Officers (CALA)**, and **Project Implementation Agencies (NHAI, Rail Vikas, etc.)** with MongoDB Atlas cloud synchronization.

---

## 🚀 Live Demo

Check out the live deployment here: **[Bhumi Setu](https://bhumi-setu.onrender.com)**

## 🚀 Quick Start: Running Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server (Fullstack)
This starts both the **Express Backend** (`http://localhost:5000`) and the **React Vite Frontend** (`http://localhost:5173`) concurrently:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 👥 Pre-Configured Demo Credentials

The backend automatically seeds these role-based accounts into MongoDB Atlas:

| Role | Email | Password | 2FA / Passkey |
| :--- | :--- | :--- | :--- |
| **Ministry Apex** | `admin.apex@morth.gov.in` | `Morth@National2026` | Passcode: `882194` |
| **Regional Officer** | `regional.officer@gujarat.gov.in` | `Officer@Gujarat2026` | District Key: `CALA-GUJ-2026` |
| **Project Agency** | `project.agency@nhai.org` | `Agency@Nhai2026` | Auth Code: `MORTH-AGENCY-2026` |

---

## 🌐 How to Deploy

### Option 1: Render.com (Recommended - 100% Free Fullstack Service)

Deploy the entire fullstack app (React frontend + Express backend) as a single Web Service on Render:

1. Push your repository to **GitHub** or **GitLab**.
2. Go to [dashboard.render.com](https://dashboard.render.com) and click **New + > Web Service**.
3. Connect your GitHub repository.
4. Set the following configuration:
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Under **Environment Variables**, add:
   - `MONGO_URI`: `mongodb+srv://avinash00000724_db_user:5BzvPmDhyvuCn8rP@cluster0.wqwxtvi.mongodb.net/bhumi_setu?retryWrites=true&w=majority`
   - `PORT`: `5000`
6. Click **Deploy Web Service**. Render will build the Vite frontend into `dist/` and start Express serving both API and static assets!

---

### Option 2: Railway.app

1. Go to [railway.app](https://railway.app) and create a **New Project > Deploy from GitHub Repo**.
2. Select your repository.
3. Railway automatically detects `npm start` and `npm run build`.
4. In the service settings, add environment variable `MONGO_URI`.
5. Generate a public domain under **Settings > Networking**.

---

### Option 3: Docker / Cloud Container (GCP Cloud Run / AWS / VPS)

Build and run using the included production Dockerfile:

```bash
# Build the Docker image
docker build -t bhoomi-setu .

# Run container on port 5000
docker run -p 5000:5000 -e MONGO_URI="mongodb+srv://avinash00000724_db_user:5BzvPmDhyvuCn8rP@cluster0.wqwxtvi.mongodb.net/bhumi_setu?retryWrites=true&w=majority" bhoomi-setu
```

---

## 🛠 Available NPM Scripts

- `npm run dev`: Runs both Express server and Vite frontend in development mode with HMR.
- `npm run server`: Runs only the Express backend server (`server/server.js`).
- `npm run client`: Runs only the Vite frontend dev server.
- `npm run build`: Compiles and bundles the React frontend into `dist/`.
- `npm start`: Starts the production Express server (serves API + `dist/` frontend).
- `npm run lint`: Runs Oxlint code inspection.

---

## 🛠 Tech Stack
Frontend : HTML/CSS/Javascript/React
Backend : Node.js/Express
Database : MongoDB
Deployment : Vercel/Render
