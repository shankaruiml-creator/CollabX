# Quick Command Reference

## Push to GitHub (First Time)

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/CollabX.git
git push -u origin main
```

## Update GitHub (After Changes)

```bash
git add .
git commit -m "Your commit message"
git push
```

## Deploy to Railway

```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

## Deploy to Vercel

```bash
npm install -g vercel
cd collabx-frontend
vercel --prod
```

## Environment Variables

### Backend (.env or Railway):
```
PORT=8080
DATABASE_URL=jdbc:mysql://host:port/collabx?useSSL=true
DB_USERNAME=your_user
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
```

### Frontend (.env.production):
```
REACT_APP_API_URL=https://your-backend.railway.app
```

## Database Access Restriction

Your database is automatically secured when using Railway MySQL:
- ✅ Only accessible from Railway network
- ✅ No public internet access
- ✅ Automatic SSL/TLS encryption
- ✅ Firewall protection

For custom MySQL:
```sql
-- Create restricted user
CREATE USER 'collabx'@'backend-ip' IDENTIFIED BY 'strong_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON collabx.* TO 'collabx'@'backend-ip';
FLUSH PRIVILEGES;
```

## Test Deployment

```bash
# Test backend
curl https://your-backend.railway.app/api/auth/check-admin

# Test frontend
# Open browser: https://your-frontend.vercel.app
```

## View Logs

```bash
# Railway logs
railway logs

# Vercel logs
# View in Vercel dashboard
```

## Common Issues

**Network Error after login:**
- Clear browser cache
- Check REACT_APP_API_URL
- Verify CORS settings

**Database connection failed:**
- Check DATABASE_URL format
- Verify credentials in Railway

**Email not sending:**
- Use Gmail app-specific password
- Check MAIL_USERNAME and MAIL_PASSWORD
