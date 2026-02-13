# CollabX - Collaboration Platform

A Spring Boot-based collaboration platform with user management, authentication, and real-time features.

## Features
- User Authentication & Authorization (JWT)
- Email Integration
- File Upload Support
- MySQL Database Integration
- RESTful API

## Tech Stack
- Java 17
- Spring Boot 3.4.2
- MySQL 8.0
- Maven
- JWT Authentication

## Local Setup

### Prerequisites
- JDK 17 or higher
- MySQL 8.0
- Maven 3.6+

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd CollabX
```

2. Configure MySQL database
```sql
CREATE DATABASE collabx;
```

3. Update `application.properties` with your database credentials

4. Run the application
```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

## Deployment

### Railway (Recommended)
1. Create account at [Railway.app](https://railway.app)
2. Install Railway CLI or use GitHub integration
3. Add MySQL database service
4. Set environment variables:
   - `DATABASE_URL`
   - `DB_USERNAME`
   - `DB_PASSWORD`
   - `JWT_SECRET`
   - `MAIL_USERNAME`
   - `MAIL_PASSWORD`
5. Deploy from GitHub

### Render
1. Create account at [Render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Add MySQL database
5. Set environment variables
6. Deploy

## Environment Variables

```
PORT=8080
DATABASE_URL=jdbc:mysql://host:port/database?params
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
JWT_SECRET=your_jwt_secret_key
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
```

## API Documentation
(Add your API endpoints documentation here)

## License
MIT
