# Site Monitor - Backend

Express.js + MongoDB backend for Site Monitor application.

## Setup

```bash
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and other settings
```

## Development

```bash
npm run dev
```

## Production

```bash
npm start
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret for JWT tokens | `your-secret-key` |
| `FRONTEND_URL` | Frontend URL for CORS | `https://your-app.vercel.app` |
| `ADMIN_EMAIL` | Default admin email | `admin@sitemonitor.com` |
| `ADMIN_PASSWORD` | Default admin password | `Admin@123` |

## Deployment to Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
4. Add environment variables in Render dashboard
5. Deploy

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Websites
- `GET /api/websites` - Get user's websites
- `POST /api/websites` - Add new website
- `PUT /api/websites/:id` - Update website
- `DELETE /api/websites/:id` - Delete website
- `POST /api/websites/:id/ping` - Manual ping

### Dashboard
- `GET /api/dashboard/stats` - Get user stats
- `GET /api/dashboard/activity` - Get recent activity

### Admin
- `GET /api/admin/stats` - Get platform stats
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:id` - Get user details
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/websites` - Get all websites
- `DELETE /api/admin/websites/:id` - Delete website
