# Railway Environment Variables Setup

## Required Environment Variables in Railway Dashboard:

1. **DATABASE_URL**
   ```
   jdbc:mysql://<railway-mysql-host>:<port>/<database>?useSSL=true&allowPublicKeyRetrieval=true
   ```
   Example: `jdbc:mysql://containers-us-west-123.railway.app:6789/railway?useSSL=true&allowPublicKeyRetrieval=true`

2. **DB_USERNAME**
   ```
   root
   ```

3. **DB_PASSWORD**
   ```
   <your-mysql-password>
   ```

4. **JWT_SECRET**
   ```
   collabxSecretKeyForJWTSecurityAndCommunicationNationwide2024
   ```

5. **MAIL_USERNAME**
   ```
   shankar.uiml@gmail.com
   ```

6. **MAIL_PASSWORD**
   ```
   pniw nqjm huio kwvm
   ```

7. **PORT** (Railway sets this automatically, but add if needed)
   ```
   8080
   ```

## Steps to Add MySQL Database in Railway:

1. In your Railway project, click "+ New"
2. Select "Database" → "MySQL"
3. Wait for deployment
4. Click on MySQL service → "Variables" tab
5. Copy these values:
   - MYSQLHOST
   - MYSQLPORT
   - MYSQLDATABASE
   - MYSQLUSER
   - MYSQLPASSWORD

6. Create DATABASE_URL using format above
7. Add all variables to your Spring Boot service

## Common Issues:

### App crashes immediately:
- Check logs: Railway Dashboard → Your Service → Deployments → View Logs
- Verify DATABASE_URL format is correct
- Ensure MySQL service is running

### Database connection error:
- Make sure MySQL service is deployed first
- Check if MYSQLHOST and MYSQLPORT are correct
- Verify allowPublicKeyRetrieval=true is in DATABASE_URL

### Port binding error:
- Railway automatically sets PORT variable
- Make sure Dockerfile uses ${PORT:-8080}
