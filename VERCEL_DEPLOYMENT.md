# Vercel Deployment Guide for CollabX

## Prerequisites
- Vercel account
- MySQL database (use one of these free options):
  - **Aiven** (Recommended - Free tier available)
  - **PlanetScale** (Free tier)
  - **Railway MySQL** (Free tier)
  - **Clever Cloud** (Free tier)

## Step 1: Setup MySQL Database

### Option A: Aiven (Recommended)
1. Go to https://aiven.io
2. Create free account
3. Create MySQL service (free tier)
4. Note down:
   - Host
   - Port
   - Database name
   - Username
   - Password

### Option B: PlanetScale
1. Go to https://planetscale.com
2. Create free account
3. Create database
4. Get connection string

## Step 2: Deploy Backend to Vercel

1. Push your code to GitHub (if not already)

2. Go to https://vercel.com and import your repository

3. Configure project:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (project root)
   - **Build Command**: `mvn clean package -DskipTests`
   - **Output Directory**: `target`

4. Add Environment Variables in Vercel:
   ```
   DATABASE_URL=jdbc:mysql://your-host:port/database?useSSL=true&requireSSL=true
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   JWT_SECRET=your_secure_jwt_secret_key_here
   MAIL_USERNAME=your_email@gmail.com
   MAIL_PASSWORD=your_app_password
   PORT=8080
   ```

5. Deploy backend

6. Copy your backend URL (e.g., `https://your-backend.vercel.app`)

## Step 3: Deploy Frontend to Vercel

1. Update `collabx-frontend/.env.production`:
   ```
   REACT_APP_API_URL=https://your-backend.vercel.app
   DISABLE_ESLINT_PLUGIN=true
   CI=false
   ```

2. Push changes to GitHub

3. Import frontend to Vercel:
   - **Framework Preset**: Create React App
   - **Root Directory**: `collabx-frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

4. Deploy frontend

## Step 4: Verify Deployment

1. Visit your frontend URL
2. Try creating an account
3. Check if backend is responding

## Troubleshooting

### Network Error
- Verify backend URL in `.env.production`
- Check backend logs in Vercel dashboard
- Ensure database is accessible

### Database Connection Error
- Verify DATABASE_URL format
- Check database credentials
- Ensure database allows external connections

### CORS Error
- Backend already configured for CORS
- If issues persist, check Vercel logs

## Important Notes

- Vercel has limitations for Java applications (may need serverless functions)
- Consider using Railway/Render for backend if Vercel doesn't work well
- Free MySQL databases have connection limits
- Keep JWT_SECRET secure and random

## Alternative: Backend on Railway, Frontend on Vercel

If Vercel doesn't work well for Spring Boot:

1. Deploy backend to Railway (better Java support)
2. Deploy frontend to Vercel
3. Update frontend `.env.production` with Railway backend URL

This is the recommended approach for Spring Boot applications.
