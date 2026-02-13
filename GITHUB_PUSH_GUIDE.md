# GitHub Push Instructions

## Step 1: Initialize Git Repository

Open terminal in project root directory and run:

```bash
git init
git branch -M main
```

## Step 2: Add Files to Git

```bash
git add .
```

## Step 3: Commit Changes

```bash
git commit -m "Initial commit: CollabX inter-college collaboration platform"
```

## Step 4: Create GitHub Repository

1. Go to https://github.com
2. Click "New Repository" (+ icon in top right)
3. Repository name: `CollabX`
4. Description: `Inter-college communication and opportunity discovery platform`
5. Choose: Public or Private
6. DO NOT initialize with README (we already have one)
7. Click "Create Repository"

## Step 5: Connect Local to GitHub

Copy the commands from GitHub (they will look like this):

```bash
git remote add origin https://github.com/YOUR_USERNAME/CollabX.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Step 6: Verify Push

Go to your GitHub repository URL and verify all files are uploaded.

## Step 7: Protect Sensitive Data

Verify these files are NOT in your repository:
- ❌ .env (should be in .gitignore)
- ❌ application-local.properties
- ❌ uploads/ folder
- ❌ Any files with passwords or API keys

## Step 8: Update README on GitHub

Your README.md is already configured. Just verify it displays correctly on GitHub.

## Step 9: Deploy Backend (Railway)

### Option A: Deploy via GitHub Integration

1. Go to https://railway.app
2. Sign up/Login with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your CollabX repository
6. Railway will auto-detect Spring Boot
7. Add MySQL database:
   - Click "New" → "Database" → "Add MySQL"
8. Set environment variables:
   ```
   PORT=8080
   DATABASE_URL=<copy from Railway MySQL>
   DB_USERNAME=<copy from Railway MySQL>
   DB_PASSWORD=<copy from Railway MySQL>
   JWT_SECRET=<generate strong secret>
   MAIL_USERNAME=your_email@gmail.com
   MAIL_PASSWORD=your_app_password
   ```
9. Click "Deploy"

### Option B: Deploy via Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Link to your project
railway link

# Add MySQL
railway add

# Set environment variables
railway variables set PORT=8080
railway variables set JWT_SECRET=your_secret_here
railway variables set MAIL_USERNAME=your_email@gmail.com
railway variables set MAIL_PASSWORD=your_password

# Deploy
railway up
```

## Step 10: Deploy Frontend (Vercel)

### Option A: Deploy via GitHub Integration

1. Go to https://vercel.com
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your CollabX repository
5. Configure:
   - Framework Preset: Create React App
   - Root Directory: `collabx-frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`
6. Add environment variable:
   ```
   REACT_APP_API_URL=https://your-backend-url.railway.app
   ```
7. Click "Deploy"

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd collabx-frontend

# Create .env.production file
echo "REACT_APP_API_URL=https://your-backend-url.railway.app" > .env.production

# Deploy
vercel --prod
```

## Step 11: Update CORS in Backend

After deploying frontend, update `WebSecurityConfig.java`:

```java
configuration.setAllowedOriginPatterns(Arrays.asList(
    "http://localhost:3000",
    "https://your-frontend-domain.vercel.app"
));
```

Commit and push:
```bash
git add .
git commit -m "Update CORS for production"
git push
```

Railway will auto-deploy the changes.

## Step 12: Database Security

### For Railway MySQL:
- Already secured by Railway network
- Only accessible from Railway services
- No public access

### For Custom MySQL:
1. Create firewall rule to allow only backend server IP
2. Enable SSL/TLS connections
3. Use strong passwords
4. Regular backups

## Step 13: Test Production Deployment

1. Visit your frontend URL
2. Test user registration
3. Test login
4. Test event creation
5. Test file uploads
6. Verify email notifications work

## Step 14: Monitor Deployment

### Railway:
- View logs: `railway logs`
- Monitor metrics in Railway dashboard

### Vercel:
- View deployment logs in Vercel dashboard
- Monitor analytics

## Troubleshooting

### Backend won't start:
```bash
# Check logs
railway logs

# Common issues:
# - Missing environment variables
# - Database connection failed
# - Port already in use
```

### Frontend can't connect to backend:
- Verify REACT_APP_API_URL is correct
- Check CORS settings in backend
- Verify backend is running

### Database connection failed:
- Check DATABASE_URL format
- Verify credentials
- Ensure database service is running

### Email not sending:
- Use Gmail app-specific password
- Verify MAIL_USERNAME and MAIL_PASSWORD
- Check Gmail security settings

## Useful Commands

```bash
# View git status
git status

# View commit history
git log --oneline

# Create new branch
git checkout -b feature-name

# Push to GitHub
git push origin main

# Pull latest changes
git pull origin main

# View remote URL
git remote -v

# Update remote URL
git remote set-url origin https://github.com/NEW_USERNAME/CollabX.git
```

## Security Checklist Before Push

- [ ] No passwords in code
- [ ] No API keys in code
- [ ] .env in .gitignore
- [ ] uploads/ in .gitignore
- [ ] Strong JWT secret
- [ ] Environment variables configured
- [ ] CORS properly configured
- [ ] Database credentials secure

## Next Steps After Deployment

1. Set up custom domain (optional)
2. Configure SSL certificate (auto with Vercel/Railway)
3. Set up monitoring and alerts
4. Configure database backups
5. Add error tracking (Sentry)
6. Set up CI/CD pipeline
7. Add rate limiting
8. Implement caching

## Support

If you encounter issues:
1. Check Railway/Vercel logs
2. Review GitHub Actions (if configured)
3. Check browser console for frontend errors
4. Review backend logs for API errors

## Congratulations! 🎉

Your CollabX platform is now live and accessible worldwide!

Frontend: https://your-app.vercel.app
Backend: https://your-app.railway.app
