# Smart Facility Management System

Academic Project for **IT3030 – PAF (Programming Applications & Frameworks) 2026**

A web platform to manage a university's facilities, bookings, and incidents with role-based authentication.

## Tech Stack
- **Frontend:** React.js (React Router)
- **Backend:** Java Spring Boot REST API
- **Database:** PostgreSQL
- **Version Control:** Git + GitHub

## Project Structure
```
Smart-Facility-Management-System/
├── frontend/       # React.js frontend app
├── backend/        # Spring Boot REST API
└── README.md
```

## Team Responsibilities
| Member   | Module                                         |
|----------|-------------------------------------------------|
| Member 1 | Booking Management + Authentication + Role-based Routing |
| Member 2 | Facilities & Asset Catalogue                    |
| Member 3 | Maintenance & Incident Ticketing + Notifications |

## Branch Strategy
- `main` — stable production-ready code
- `dev` — development integration branch
- `feature/*` — individual feature branches

## Getting Started - Complete Setup Guide

This guide will help you set up the entire Smart Facility Management System from scratch, including database, backend, and frontend.

### ✅ Prerequisites

You must have the following installed on your machine:

#### 1. **Node.js & npm** (for Frontend)
- Download from: https://nodejs.org/
- Verify installation:
```bash
node --version
npm --version
```

#### 2. **Java Development Kit (JDK 11+)** (for Backend)
- Download from: https://www.oracle.com/java/technologies/downloads/
- Verify installation:
```bash
java -version
javac -version
```

#### 3. **Apache Maven 3.8+** (for Building Backend)
- Download from: https://maven.apache.org/download.cgi
- Or use Homebrew (macOS):
```bash
brew install maven
```
- Verify installation:
```bash
mvn --version
```

#### 4. **PostgreSQL Database** (for Data Storage)
- Download from: https://www.postgresql.org/download/
- Or use Homebrew (macOS):
```bash
brew install postgresql@15
```
- Verify installation:
```bash
psql --version
```

---

### 🗄️ Step 1: Setup PostgreSQL Database

#### Start PostgreSQL Server

**macOS (Homebrew):**
```bash
brew services start postgresql@15
```

**Windows (using pgAdmin or command line):**
```cmd
psql -U postgres
```

**Linux:**
```bash
sudo systemctl start postgresql
```

#### Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# In PostgreSQL shell, run:
CREATE DATABASE smart_facility;
\q
```

#### Create Database Tables

Run the schema SQL commands:

```bash
psql -U postgres -d smart_facility << 'EOF'

-- Create User table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Facility table
CREATE TABLE facilities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    location VARCHAR(255),
    capacity INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Asset table
CREATE TABLE assets (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    facility_id INTEGER REFERENCES facilities(id),
    status VARCHAR(50),
    last_maintenance TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Booking table
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    facility_id INTEGER REFERENCES facilities(id),
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create IncidentTicket table
CREATE TABLE incident_tickets (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50),
    priority VARCHAR(50),
    user_id INTEGER REFERENCES users(id),
    technician_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Notification table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    type VARCHAR(50),
    is_read BOOLEAN DEFAULT false,
    related_entity VARCHAR(100),
    related_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

EOF
```

#### Verify Database Creation

```bash
psql -U postgres -d smart_facility -c "\dt"
```

You should see all 6 tables listed.

---

### 🔧 Step 2: Setup & Run Backend

Navigate to the backend folder and follow these steps:

```bash
# 1. Navigate to backend folder
cd "Smart Facility Management System/backend"

# 2. Update database configuration (optional)
# Edit: src/main/resources/application.properties
# Change DB_USERNAME and DB_PASSWORD if different from default (postgres)

# 3. Clean and install dependencies
mvn clean install

# 4. Start the backend server
mvn spring-boot:run
```

**Expected Output:**
```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_|_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot :: (v3.1.0)

...
Tomcat started on port(s): 8080 (http)
Started SmartFacilityApp in X.XXX seconds
```

**Backend URL:** http://localhost:8080

✅ **Keep this terminal open** - Backend must stay running

---

### 💻 Step 3: Setup & Run Frontend

Open **a new terminal** and navigate to the frontend folder:

```bash
# 1. Navigate to frontend folder
cd "Smart Facility Management System/frontend"

# 2. Install Node.js dependencies
npm install

# 3. Start the frontend development server
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view the app in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000

Press q to quit.
```

**Frontend URL:** http://localhost:3000

---

### 🧪 Step 4: Verify Everything is Working

#### Test Backend API

Open a new terminal and run:

```bash
# Test authentication endpoint
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "fullName": "Test User",
    "role": "STUDENT"
  }'
```

**Expected Response:**
```json
{"message": "User registered successfully"}
```

#### Test Frontend

Open your browser:
- **Frontend:** http://localhost:3000 ✅
- **Backend API:** http://localhost:8080/api ✅

---

### 👥 Step 5: Create Test User Accounts

Use the login page to register accounts or test via API:

```bash
# Register Admin
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Admin123!",
    "fullName": "Administrator",
    "role": "ADMIN"
  }'

# Register Staff
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "staff@example.com",
    "password": "Staff123!",
    "fullName": "Staff Member",
    "role": "STAFF"
  }'

# Register Student
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "Student123!",
    "fullName": "Student User",
    "role": "STUDENT"
  }'
```

Then login on the web app with any of these credentials.

---

### 📱 Step 6: Access Main Features

After login, you can access:

| Feature | URL | Available for |
|---------|-----|----------------|
| Dashboard | `/dashboard` | All roles |
| Facilities | `/facilities` | All roles |
| Assets | `/assets` | All roles |
| Bookings | `/bookings` | All roles |
| Tickets | `/tickets` | All roles |
| Notifications | `/notifications` | All roles |
| User Management | `/admin/users` | ADMIN only |

---

### 🧹 Cleanup & Reset

If you need to reset the database:

```bash
# Stop PostgreSQL
brew services stop postgresql@15

# Drop and recreate database
psql -U postgres -c "DROP DATABASE smart_facility;"
psql -U postgres -c "CREATE DATABASE smart_facility;"

# Re-run the schema creation commands from Step 1
```

---

### 🐛 Troubleshooting

#### Backend won't start
```bash
# Check if port 8080 is already in use
lsof -i :8080

# Kill process if needed
kill -9 <PID>

# Or use different port
export SERVER_PORT=8081
mvn spring-boot:run
```

#### Frontend won't start
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules
npm install

# Then try again
npm start
```

#### Database connection errors
```bash
# Verify PostgreSQL is running
psql -U postgres -c "SELECT 1;"

# Check database exists
psql -U postgres -l | grep smart_facility

# Check credentials in application.properties
cat backend/src/main/resources/application.properties
```

#### Port conflicts
```bash
# Find what's using the port
lsof -i :8080      # Backend
lsof -i :3000      # Frontend
lsof -i :5432      # PostgreSQL

# Kill process
kill -9 <PID>
```

---

### ✅ Complete Checklist

Before you're done, verify:

- [ ] PostgreSQL running and database `smart_facility` created
- [ ] 6 database tables created (users, facilities, assets, bookings, incident_tickets, notifications)
- [ ] Backend running on http://localhost:8080
- [ ] Frontend running on http://localhost:3000
- [ ] Can open frontend in browser
- [ ] Can register a new user via API or UI
- [ ] Can login with created user
- [ ] Can access Dashboard and other pages
- [ ] Can create/view facilities, assets, bookings, tickets, notifications

---

### 📊 System Overview

Once fully running, you have:

```
┌─────────────────────────────────────────────────┐
│  Smart Facility Management System (FULL SETUP)  │
├─────────────────────────────────────────────────┤
│  Frontend (React)                               │
│  ├─ http://localhost:3000                       │
│  ├─ Login, Dashboard, Facilities, Assets        │
│  └─ Bookings, Tickets, Notifications            │
│                                                 │
│  Backend (Spring Boot)                          │
│  ├─ http://localhost:8080/api                   │
│  ├─ 30+ REST API endpoints                      │
│  └─ JWT Authentication, Role-based Access      │
│                                                 │
│  Database (PostgreSQL)                          │
│  ├─ smart_facility (database)                   │
│  ├─ 6 core tables                               │
│  └─ localhost:5432                              │
└─────────────────────────────────────────────────┘
```

---

### 📚 API Quick Reference

After backend is running, you can test these endpoints:

**Authentication:**
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify` - Verify token

**Facilities:**
- `GET /api/facilities` - Get all facilities
- `POST /api/facilities` - Create facility

**Bookings:**
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create booking

**Tickets:**
- `GET /api/incident-tickets` - Get all tickets
- `POST /api/incident-tickets` - Create ticket

**Notifications:**
- `GET /api/notifications/user/{email}` - Get notifications
- `PUT /api/notifications/{id}/read` - Mark as read

See [TESTING_SUMMARY.md](TESTING_SUMMARY.md) for complete API reference.

---

### 🎯 Next Steps

Once the system is running:

1. **Explore the UI** - Navigate through all pages
2. **Test Features** - Create facilities, bookings, tickets
3. **Check Database** - View created records in PostgreSQL
4. **Review Code** - Check backend controllers and frontend components
5. **Make Changes** - Customize as needed
6. **Deploy** - Follow deployment guide for production

---

### PostgreSQL Database
```bash
brew services start postgresql@15
createdb smart_facility
```

Connection defaults are configured in `backend/src/main/resources/application.properties`.
You can override credentials with environment variables:

```bash
export DB_USERNAME=your_pg_user
export DB_PASSWORD=your_pg_password
mvn spring-boot:run
```

## API Quick Reference

Authentication:
- `POST /api/auth/register`
- `POST /api/auth/login`

Bookings:
- `GET /api/bookings`
- `GET /api/bookings/my`
- `GET /api/bookings/{id}`
- `GET /api/bookings/facility/{name}`
- `POST /api/bookings`
- `PUT /api/bookings/{id}/confirm`
- `PUT /api/bookings/{id}/cancel`
- `DELETE /api/bookings/{id}`
