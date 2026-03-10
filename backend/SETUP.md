# TaskTide Backend Setup Guide

## Prerequisites

### 1. Install PostgreSQL

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql
CREATE DATABASE tasktide;
CREATE USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE tasktide TO postgres;
\q
```

### 2. Install Redis (for real-time chat)

```bash
# Ubuntu/Debian
sudo apt install redis-server

# Start Redis
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

### 3. Install PHP Extensions

```bash
sudo apt install php8.2-pgsql php8.2-redis php8.2-mbstring php8.2-xml php8.2-curl
```

## Installation Steps

### 1. Install Composer Dependencies

```bash
cd backend
composer install
```

### 2. Run Database Migrations

```bash
php artisan migrate
```

### 3. Create Storage Link

```bash
php artisan storage:link
```

### 4. Install Laravel Sanctum

```bash
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

### 5. Install Laravel Reverb (for WebSockets)

```bash
php artisan install:broadcasting
```

## Running the Backend

### Development Mode

```bash
# Terminal 1: Start Laravel server
php artisan serve

# Terminal 2: Start queue worker (for jobs)
php artisan queue:work

# Terminal 3: Start Reverb WebSocket server (for real-time chat)
php artisan reverb:start
```

## API Testing

Base URL: `http://127.0.0.1:8000/api`

### 1. Register a Student

```bash
curl -X POST http://127.0.0.1:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "role": "student"
  }'
```

### 2. Register a Class Rep

```bash
curl -X POST http://127.0.0.1:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Rep",
    "email": "jane@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "role": "class_rep"
  }'
```

### 3. Login

```bash
curl -X POST http://127.0.0.1:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "password123"
  }'
```

Save the token from response!

### 4. Create Course Server (as Class Rep)

```bash
curl -X POST http://127.0.0.1:8000/api/course-servers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Mathematics and Computer Science 2024",
    "description": "Course server for Math and CS students"
  }'
```

Save the `code` from response!

### 5. Join Course Server (as Student)

```bash
curl -X POST http://127.0.0.1:8000/api/course-servers/join \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer STUDENT_TOKEN" \
  -d '{
    "code": "ABC123"
  }'
```

### 6. Create a Unit

```bash
curl -X POST http://127.0.0.1:8000/api/course-servers/1/units \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer CLASS_REP_TOKEN" \
  -d '{
    "name": "Vector Analysis",
    "unit_code": "MATH301",
    "description": "Advanced vector calculus",
    "credits": 3
  }'
```

### 7. Upload a Document

```bash
curl -X POST http://127.0.0.1:8000/api/units/1/documents \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "title=Lecture Notes Week 1" \
  -F "document_type=lecture_notes" \
  -F "file=@/path/to/document.pdf"
```

### 8. Send a Chat Message

```bash
curl -X POST http://127.0.0.1:8000/api/units/1/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "message": "Hello everyone! Looking forward to this semester!"
  }'
```

### 9. Invite a Lecturer

```bash
curl -X POST http://127.0.0.1:8000/api/units/1/invitations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer CLASS_REP_TOKEN" \
  -d '{
    "email": "lecturer@university.edu"
  }'
```

## Database Schema Verification

```bash
# Connect to database
psql -U postgres -d tasktide

# List all tables
\dt

# View table structure
\d users
\d course_servers
\d units
\d documents
\d messages
\d invitations
```

## Troubleshooting

### PostgreSQL Connection Error

Check `.env` file has correct database credentials:
```
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=tasktide
DB_USERNAME=postgres
DB_PASSWORD=postgres
```

### Storage Permission Error

```bash
chmod -R 775 storage bootstrap/cache
```

### Redis Connection Error

Check if Redis is running:
```bash
redis-cli ping
# Should return: PONG
```

## Next Steps

1. Set up email service for invitations (Mailgun, SendGrid, etc.)
2. Implement Broadcasting events for real-time chat
3. Add rate limiting to API routes
4. Set up CORS for frontend
5. Add API documentation (Swagger/OpenAPI)
