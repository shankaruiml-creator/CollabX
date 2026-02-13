# CollabX Deployment Guide

## GitHub Setup & Deployment

### Step 1: Prepare for GitHub Push

1. **Remove Sensitive Data from application.properties**
   - Already configured with environment variables
   - Never commit actual credentials

2. **Update .gitignore** (Already configured)
   - Excludes: uploads/, target/, .env, credentials

### Step 2: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: CollabX platform"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/CollabX.git

# Push to GitHub
git push -u origin main
```

### Step 3: Database Security Configuration

#### For Production (Railway/Render):

**Option 1: Use Railway MySQL**
1. Create Railway account
2. Add MySQL service
3. Copy connection details
4. Set environment variables in Railway dashboard

**Option 2: Use Remote MySQL (Recommended for security)**
1. Use managed MySQL service (AWS RDS, Google Cloud SQL, Railway)
2. Configure firewall rules to allow only your backend server IP
3. Never expose database publicly

#### MySQL Security Settings:

```sql
-- Create dedicated user for application
CREATE USER 'collabx_app'@'%' IDENTIFIED BY 'STRONG_PASSWORD_HERE';
GRANT SELECT, INSERT, UPDATE, DELETE ON collabx.* TO 'collabx_app'@'%';
FLUSH PRIVILEGES;

-- Restrict access by IP (if possible)
CREATE USER 'collabx_app'@'YOUR_SERVER_IP' IDENTIFIED BY 'STRONG_PASSWORD_HERE';
GRANT SELECT, INSERT, UPDATE, DELETE ON collabx.* TO 'collabx_app'@'YOUR_SERVER_IP';
```

### Step 4: Environment Variables Setup

#### Railway Deployment:

Set these variables in Railway dashboard:

```
PORT=8080
DATABASE_URL=jdbc:mysql://HOST:PORT/collabx?useSSL=true&requireSSL=true&serverTimezone=UTC
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
JWT_SECRET=your_very_long_random_secret_key_here_minimum_256_bits
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_specific_password
```

#### Render Deployment:

1. Create Web Service from GitHub repo
2. Add environment variables in Render dashboard
3. Add MySQL database service
4. Connect database to web service

### Step 5: Frontend Deployment

#### Update API URL for Production:

Create `.env` file in `collabx-frontend/`:

```
REACT_APP_API_URL=https://your-backend-url.railway.app
```

Update axios-config.js:

```javascript
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
```

#### Deploy Frontend:

**Option 1: Vercel**
```bash
cd collabx-frontend
npm install -g vercel
vercel
```

**Option 2: Netlify**
```bash
cd collabx-frontend
npm run build
# Upload build/ folder to Netlify
```

### Step 6: Security Checklist

- [ ] Remove all hardcoded credentials
- [ ] Use environment variables for all sensitive data
- [ ] Enable SSL/TLS for database connections
- [ ] Configure CORS to allow only your frontend domain
- [ ] Use strong JWT secret (minimum 256 bits)
- [ ] Enable database firewall rules
- [ ] Use app-specific passwords for email
- [ ] Set up database backups
- [ ] Enable rate limiting on auth endpoints
- [ ] Configure proper logging (no sensitive data)

### Step 7: Update CORS for Production

In `WebSecurityConfig.java`, update CORS:

```java
configuration.setAllowedOriginPatterns(Arrays.asList(
    "http://localhost:3000",
    "https://your-frontend-domain.vercel.app"
));
```

### Step 8: Database Access Restriction

**Railway MySQL:**
- Automatically restricts access to Railway network
- No public access by default

**Custom MySQL:**
1. Configure firewall to allow only backend server IP
2. Use SSL/TLS connections
3. Disable remote root access
4. Use strong passwords
5. Regular security updates

### Step 9: Monitoring & Maintenance

1. Set up error logging (Sentry, LogRocket)
2. Monitor database connections
3. Set up alerts for failed logins
4. Regular database backups
5. Monitor API response times

### Step 10: Post-Deployment Testing

1. Test user registration with OTP
2. Test login functionality
3. Test event creation
4. Test file uploads
5. Test email notifications
6. Verify database connections
7. Check CORS settings
8. Test all API endpoints

## Quick Commands

### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Deploy
railway up
```

### Frontend (Vercel):
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd collabx-frontend
vercel --prod
```

## Environment Variables Template

Copy this to your deployment platform:

```
# Server
PORT=8080

# Database (Use managed service)
DATABASE_URL=jdbc:mysql://HOST:PORT/collabx?useSSL=true&requireSSL=true
DB_USERNAME=collabx_user
DB_PASSWORD=GENERATE_STRONG_PASSWORD

# JWT (Generate with: openssl rand -base64 64)
JWT_SECRET=GENERATE_RANDOM_SECRET_HERE

# Email (Use app-specific password)
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
```

## Troubleshooting

**Database Connection Failed:**
- Check DATABASE_URL format
- Verify firewall rules
- Confirm credentials
- Check SSL requirements

**CORS Errors:**
- Update allowedOriginPatterns in WebSecurityConfig
- Verify frontend URL is correct

**File Upload Issues:**
- Ensure uploads/ directory exists
- Check file size limits
- Verify write permissions

**Email Not Sending:**
- Use Gmail app-specific password
- Enable "Less secure app access" (not recommended)
- Use SendGrid/AWS SES for production

## Security Best Practices

1. **Never commit:**
   - Passwords
   - API keys
   - JWT secrets
   - Database credentials

2. **Always use:**
   - Environment variables
   - SSL/TLS connections
   - Strong passwords
   - Rate limiting
   - Input validation

3. **Regular updates:**
   - Dependencies
   - Security patches
   - Database backups
   - Access logs review

## Support

For issues, check:
- GitHub Issues
- Railway/Render documentation
- Spring Boot documentation
- React documentation
