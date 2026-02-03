# Site Monitor - Frontend

React + Vite frontend for Site Monitor application.

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Environment Variables

For production, update `src/utils/api.js` with your backend URL:

```javascript
const API_URL = import.meta.env.PROD 
  ? 'https://your-backend-url.onrender.com' 
  : '';
```

## Deployment to Vercel

1. Push to GitHub
2. Import repository in Vercel
3. Deploy (auto-detected as Vite project)

The `vercel.json` file is already configured for SPA routing.
