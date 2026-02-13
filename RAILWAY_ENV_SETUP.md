# Railway Environment Variables Setup

## IMPORTANT: Railway Private Networking

Railway services in the same project can communicate via private network.
Use the **internal** MySQL variables, not public ones.

## Required Environment Variables in Railway Dashboard:

1. **DATABASE_URL**
   ```
   jdbc:mysql://${{MySQL.MYSQL_PRIVATE_URL}}?allowPublicKeyRetrieval=true
   ```
   OR manually:
   ```
   jdbc:mysql://${{MySQL.MYSQLHOST}}:${{MySQL.MYSQLPORT}}/${{MySQL.MYSQLDATABASE}}?allowPublicKeyRetrieval=true
   ```

2. **DB_USERNAME**
   ```
   ${{MySQL.MYSQLUSER}}
   ```

3. **DB_PASSWORD**
   ```
   ${{MySQL.MYSQLPASSWORD}}
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

## Steps to Fix "Connection Refused" Error:

1. **Add MySQL to your Railway project:**
   - Click "+ New" in your project
   - Select "Database" → "MySQL"
   - Wait for it to deploy (green status)

2. **Link services using Railway variables:**
   - Go to your Spring Boot service → "Variables" tab
   - Click "+ New Variable" → "Add Reference"
   - Use the format above with `${{MySQL.VARIABLE_NAME}}`

3. **Or copy values manually:**
   - Go to MySQL service → "Variables" tab
   - Copy MYSQLHOST, MYSQLPORT, MYSQLDATABASE, MYSQLUSER, MYSQLPASSWORD
   - Add them to your Spring Boot service

## Example (Using Railway References - RECOMMENDED):

```
DATABASE_URL=jdbc:mysql://${{MySQL.MYSQLHOST}}:${{MySQL.MYSQLPORT}}/${{MySQL.MYSQLDATABASE}}?allowPublicKeyRetrieval=true
DB_USERNAME=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
JWT_SECRET=collabxSecretKeyForJWTSecurityAndCommunicationNationwide2024
MAIL_USERNAME=shankar.uiml@gmail.com
MAIL_PASSWORD=pniw nqjm huio kwvm
```

## Troubleshooting:

### "Connection refused" error:
- MySQL service must be in the SAME Railway project
- Use private network variables (MYSQLHOST, not public URL)
- Both services must be deployed and running

### "Communications link failure":
- Check DATABASE_URL format
- Ensure allowPublicKeyRetrieval=true is present
- Verify MySQL service is running (green status)
