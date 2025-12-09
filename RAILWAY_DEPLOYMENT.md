# Railway Deployment Guide

## Backend (Directus) Deployment

1. Create a new Railway project for the backend
2. Add a PostgreSQL database to the project
3. Deploy from the `backend` directory
4. Set the following environment variables:

```env
# Database (automatically set by Railway PostgreSQL)
DB_CLIENT=pg
DB_HOST=${{PGHOST}}
DB_PORT=${{PGPORT}}
DB_DATABASE=${{PGDATABASE}}
DB_USER=${{PGUSER}}
DB_PASSWORD=${{PGPASSWORD}}

# Directus
KEY=your-random-key-here
SECRET=your-random-secret-here
ADMIN_EMAIL=your-email@example.com
ADMIN_PASSWORD=your-secure-password

# Public URL
PUBLIC_URL=https://your-backend-app.up.railway.app
```

## Frontend (Next.js) Deployment

1. Create another Railway project for the frontend
2. Deploy from the `frontend` directory
3. Set the following environment variables:

```env
# API Configuration - IMPORTANT!
NEXT_PUBLIC_API_URL=https://your-frontend-app.up.railway.app

# Directus Configuration
NEXT_PUBLIC_DIRECTUS_URL=https://your-backend-app.up.railway.app
DIRECTUS_TOKEN=your-directus-static-token
```

### Getting the Frontend URL

After deploying the frontend, Railway will provide you with a URL like:
`https://your-app-name.up.railway.app`

You need to set this as `NEXT_PUBLIC_API_URL` in your Railway environment variables.

## Important Notes

1. **Environment Variables**: The `NEXT_PUBLIC_API_URL` must be set to your Railway frontend URL to avoid the localhost connection errors.

2. **Build Issues**: If you encounter build issues, ensure:
   - All TypeScript errors are fixed (already done)
   - Environment variables are properly set
   - The backend is running and accessible

3. **CORS**: The backend Directus instance should allow requests from your frontend domain.

## Troubleshooting

### "fetch failed" or "ECONNREFUSED" errors

This happens when the frontend tries to connect to localhost instead of the deployed URL. Make sure:
1. `NEXT_PUBLIC_API_URL` is set to your Railway frontend URL
2. `NEXT_PUBLIC_DIRECTUS_URL` is set to your Railway backend URL
3. Redeploy after setting environment variables

### Build failures

- Check Railway build logs
- Ensure all dependencies are in package.json
- Check for any hardcoded localhost URLs

## Alternative: Single Deployment

If you want to deploy both frontend and backend together, you can:
1. Create a monorepo setup
2. Use a custom Dockerfile that runs both services
3. Configure nginx to proxy requests appropriately

However, separate deployments are recommended for better scalability and maintenance.