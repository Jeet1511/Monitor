# Deploying Site Monitoring App on Render

This guide will walk you through deploying your **Site Monitoring** application (Backend + Frontend) on [Render.com](https://render.com).

## Prerequisites

1.  **GitHub Account**: Ensure your project is pushed to a GitHub repository.
2.  **Render Account**: Sign up/Log in to Render.
3.  **MongoDB Database**: You need a MongoDB connection string (e.g., from MongoDB Atlas).

---

## Part 1: Deploying the Backend

1.  **Create a Web Service**:
    *   Click **New +** -> **Web Service**.
    *   Connect your GitHub repository.

2.  **Configure the Service**:
    *   **Name**: `site-monitoring-backend` (or similar)
    *   **Region**: Choose the one closest to you (e.g., Singapore, Frankfurt).
    *   **Branch**: `main` (or your working branch).
    *   **Root Directory**: `backend` (Important! Since your backend is in a subfolder).
    *   **Runtime**: `Node`
    *   **Build Command**: `npm install`
    *   **Start Command**: `node server.js`
    *   **Plan**: Free

3.  **Environment Variables**:
    *   Scroll down to the **Environment Variables** section and add the following keys:

    | Key | Value | Description |
    | :--- | :--- | :--- |
    | `NODE_ENV` | `production` | Sets the environment to production. |
    | `MONGODB_URI` | `mongodb+srv://...` | Your MongoDB connection string. |
    | `JWT_SECRET` | `your_secure_secret` | A long random string for security. |
    | `FRONTEND_URL` | *(Leave empty for now, update after frontend deploy)* | URL of your frontend. |
    | `ADMIN_EMAIL` | `admin@example.com` | (Optional) Email for default admin. |
    | `ADMIN_PASSWORD` | `SecurePass123` | (Optional) Password for default admin. |

4.  **Deploy**:
    *   Click **Create Web Service**.
    *   Wait for the deployment to finish. Once live, copy the **Backend URL** (e.g., `https://site-monitoring-backend.onrender.com`).

---

## Part 2: Deploying the Frontend

1.  **Create a Static Site**:
    *   Click **New +** -> **Static Site**.
    *   Connect the *same* GitHub repository.

2.  **Configure the Site**:
    *   **Name**: `site-monitoring-frontend` (or similar).
    *   **Branch**: `main`.
    *   **Root Directory**: `frontend` (Important!).
    *   **Build Command**: `npm run build`
    *   **Publish Directory**: `dist` (Vite builds to `dist` by default).

3.  **Environment Variables**:
    *   Add the following key:

    | Key | Value | Description |
    | :--- | :--- | :--- |
    | `VITE_API_URL` | `https://your-backend-url.onrender.com` | The **Backend URL** you copied in Part 1. |

4.  **Deploy**:
    *   Click **Create Static Site**.
    *   Wait for the build to finish. Once live, copy the **Frontend URL** (e.g., `https://site-monitoring-frontend.onrender.com`).

---

## Part 3: Final Configuration

1.  **Update Backend CORS**:
    *   Go back to your **Backend Web Service** dashboard on Render.
    *   Go to **Environment Variables**.
    *   Add/Update `FRONTEND_URL` with your new **Frontend URL** (no trailing slash).
    *   Save changes (this will trigger a re-deploy of the backend).

2.  **Verify**:
    *   Open your Frontend URL.
    *   Try logging in or checking the dashboard to ensure it connects to the backend successfully.

---

## Troubleshooting

*   **CORS Errors**: Check if `FRONTEND_URL` in backend matches your frontend URL exactly.
*   **Database Connection**: Ensure your MongoDB Atlas IP Access List allows access from anywhere (`0.0.0.0/0`) since Render IPs are dynamic.
*   **Build Fails**: Check the logs. Ensure `npm install` ran successfully in `backend` and `npm run build` ran in `frontend`.
