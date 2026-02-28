# Smart Facility Management System

Academic Project for **IT3030 – PAF (Programming Applications & Frameworks) 2026**

A web platform to manage a university's facilities, bookings, and incidents with role-based authentication.

## Tech Stack
- **Frontend:** React.js (React Router)
- **Backend:** Java Spring Boot REST API
- **Database:** MySQL
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
mvn clean install
mvn spring-boot:run
```

### Database
```sql
CREATE DATABASE smart_facility CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
