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

## Getting Started

### Frontend
```bash
cd frontend
npm install
npm start
```

### Backend
```bash
cd backend
/opt/homebrew/bin/mvn clean install
/opt/homebrew/bin/mvn spring-boot:run
```

### Backend Tests
```bash
cd backend
/opt/homebrew/bin/mvn test
```

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
