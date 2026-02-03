# Site Monitor 🚀

A professional full-stack web application for monitoring website uptime. Keep your websites alive 24/7 with automated pinging and real-time monitoring.

![Site Monitor](https://img.shields.io/badge/status-active-success.svg)
![Node.js](https://img.shields.io/badge/node-18%2B-green.svg)
![React](https://img.shields.io/badge/react-18-blue.svg)

## Features

✅ **Automated Pinging** - Keep websites active with 5, 15, 30, or 60 minute intervals  
✅ **Real-time Monitoring** - Track uptime, response times, and status  
✅ **User Dashboard** - Manage all your websites in one place  
✅ **Admin Panel** - Full control over users and platform  
✅ **Free Forever** - No limits, no credit card required  

## Tech Stack

### Frontend
- React 18 + Vite
- React Router for navigation
- Lucide React for animated icons
- Modern CSS with glassmorphism design

### Backend
- Node.js + Express
- MongoDB with Mongoose
- JWT Authentication
- node-cron for scheduled pings

## Project Structure

```
Site Monitoring/
├── frontend/           # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── landing/    # Landing page
│   │   │   ├── auth/       # Login/Signup
│   │   │   ├── dashboard/  # User dashboard
│   │   │   ├── admin/      # Admin panel
│   │   │   └── common/     # Shared components
│   │   ├── contexts/       # Auth context
│   │   ├── utils/          # API utilities
│   │   └── styles/         # CSS
│   └── vercel.json         # Vercel config
│
└── backend/            # Express API
    ├── config/         # Database config
    ├── middleware/     # Auth middleware
    ├── models/         # MongoDB models
    ├── routes/         # API routes
    ├── services/       # Ping service
    └── server.js       # Entry point
```

## Quick Start

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173`

## Deployment

### Frontend → Vercel

1. Push to GitHub
2. Import in Vercel
3. Deploy

### Backend → Render

1. Create Web Service
2. Connect GitHub repo
3. Set environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `FRONTEND_URL` (your Vercel URL)
4. Deploy

## Default Admin Credentials

- **Email**: `admin@sitemonitor.com`
- **Password**: `Admin@123`

⚠️ Change these in production!

## Author

**Jeet**

- GitHub: [@Jeet1511](https://github.com/Jeet1511)
- Instagram: [@_echo.del.alma_](https://www.instagram.com/_echo.del.alma_)

## License

MIT License - feel free to use this project!
