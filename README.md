# 🎬 IMovies - Movie Ticket Booking Made Simple

A full-stack online movie ticket reservation platform built with **React.js**, **Node.js**, **Express.js**, **MongoDB**, and **Bootstrap**. It features real-time seat tracking, tiered auditorium layouts (Standard, Premium, VIP), secure JWT authentication, instant digital QR tickets, booking cancellation with automated seat release, and an administrative cinema management portal.

---

## 🌟 Key Features

- **Intuitive Movie Discovery**: Browse trending blockbusters, filter by genres (Action, Sci-Fi, Drama, etc.), filter by language, or search titles in real time.
- **Detailed Showtime & Auditorium Schedules**: View upcoming show dates, theater halls (IMAX, Dolby Cinema, Gold Class), and scheduled screening times.
- **Interactive Visual Seating Layout**:
  - Realistic curved cinema screen projection guide.
  - Multi-tier seat pricing (VIP rows A–B, Premium rows C–D, Standard rows E–F).
  - Real-time seat statuses: Available, Selected, and Reserved.
  - Prevention of double bookings and conflict handling.
- **Instant Digital QR Tickets**: Generates unique booking reference IDs (`IMV-XXXXX`), digital barcode/QR tickets, and a printable ticket receipt.
- **Booking Management**: View past and upcoming reservations, with one-click seat cancellation and automatic auditorium seat release.
- **User Authentication & Roles**:
  - Secure password hashing using `bcryptjs`.
  - Stateless authentication with JSON Web Tokens (JWT).
  - Role-based authorization (`user` vs `admin`).
- **Admin Management Portal**:
  - Add new movies with synopsis, director, cast, posters, and banner URLs.
  - Schedule new auditorium showtimes with automatic seating layout generation.
  - Manage and delete catalog movies.

---

## 🏗️ System Architecture

```
IMovies/
├── client/                     # Frontend (React 18 + Vite + Bootstrap 5)
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navbar.jsx      # Navigation header with auth states
│   │   │   ├── Footer.jsx      # Cinema footer & quick links
│   │   │   ├── MovieCard.jsx   # Movie poster card with rating & details
│   │   │   └── SeatGrid.jsx    # Interactive visual cinema seat layout
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Global JWT auth state & helper actions
│   │   ├── pages/
│   │   │   ├── HomePage.jsx               # Hero banner, filters, movie catalog
│   │   │   ├── MovieDetailPage.jsx        # Movie overview & showtime selector
│   │   │   ├── SeatSelectionPage.jsx      # Real-time seat picker & price calculator
│   │   │   ├── BookingConfirmationPage.jsx# Digital QR ticket confirmation
│   │   │   ├── MyBookingsPage.jsx         # User ticket history & cancellation
│   │   │   ├── LoginPage.jsx              # Sign-in with demo quick-fill
│   │   │   ├── RegisterPage.jsx           # User registration
│   │   │   └── AdminPage.jsx              # Cinema admin management portal
│   │   ├── App.jsx             # React router configuration
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Custom dark cinema neon theme
│   ├── index.html
│   ├── package.json
│   └── vite.config.js          # Vite config with API proxy to port 5000
│
├── server/                     # Backend (Node.js + Express.js + Mongoose)
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js           # MongoDB connection handler
│   │   ├── controllers/
│   │   │   ├── authController.js    # Register, login, user profile
│   │   │   ├── movieController.js   # CRUD operations for movies
│   │   │   ├── showtimeController.js# Showtimes & seating layouts
│   │   │   └── bookingController.js # Seat reservation & cancellations
│   │   ├── middleware/
│   │   │   ├── auth.js         # JWT verification & admin guard
│   │   │   └── errorHandler.js # Centralized API error handling
│   │   ├── models/
│   │   │   ├── User.js         # User model with bcrypt password hashing
│   │   │   ├── Movie.js        # Movie schema with genres, duration, posters
│   │   │   ├── Showtime.js     # Showtimes schema with embedded seat matrix
│   │   │   └── Booking.js      # Booking schema with reference & seat items
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── movieRoutes.js
│   │   │   ├── showtimeRoutes.js
│   │   │   └── bookingRoutes.js
│   │   ├── seed/
│   │   │   ├── seedData.js     # Initial blockbuster movies catalog
│   │   │   └── seeder.js       # Database seeder script
│   │   └── server.js           # Express app initialization & route mounting
│   ├── .env                    # Environment variables
│   ├── .env.example
│   └── package.json
│
├── package.json                # Root package with concurrent dev scripts
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB**: Local MongoDB instance (`mongodb://localhost:27017/imovies`) or MongoDB Atlas cloud connection string.

### 2. Configure Environment Variables
Inside `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/imovies
JWT_SECRET=imovies_super_secret_jwt_key_2026
NODE_ENV=development
```
*(If you are using MongoDB Atlas, simply replace `MONGODB_URI` with your connection string).*

### 3. Seed Database with Realistic Data
To populate sample blockbuster movies (*Dune: Part Two*, *Oppenheimer*, *Spider-Man*, *Interstellar*, etc.), auditorium showtimes, and demo accounts:
```bash
npm run seed
```

#### Demo Credentials Created:
- **Admin**: `admin@imovies.com` / `password123`
- **Customer**: `user@imovies.com` / `password123`
*(Quick-login buttons are also provided directly on the Login page!)*

### 4. Run the Full Application Concurrently
Start both backend API server (port 5000) and frontend client (port 3000):
```bash
npm run dev
```

- Open your browser at: **`http://localhost:3000`**
- API health check: **`http://localhost:5000/api/health`**

---

## 📡 REST API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register new user account |
| POST | `/api/auth/login` | Public | Authenticate user & receive JWT token |
| GET | `/api/auth/me` | Private | Fetch logged-in user profile |

### Movies (`/api/movies`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/movies` | Public | Get all active movies (filters: search, genre, language) |
| GET | `/api/movies/:id` | Public | Get movie details along with scheduled showtimes |
| POST | `/api/movies` | Admin | Add new movie to catalog |
| PUT | `/api/movies/:id` | Admin | Update movie information |
| DELETE | `/api/movies/:id` | Admin | Delete movie and associated showtimes |

### Showtimes (`/api/showtimes`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/showtimes` | Public | List showtimes by movie or date |
| GET | `/api/showtimes/:id` | Public | Get auditorium seat status map |
| POST | `/api/showtimes` | Admin | Schedule showtime with seat matrix |
| DELETE | `/api/showtimes/:id` | Admin | Cancel and remove showtime |

### Bookings (`/api/bookings`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/bookings` | Private | Reserve selected seats & complete payment |
| GET | `/api/bookings/my-bookings` | Private | List all bookings for current user |
| GET | `/api/bookings/:id` | Private | Get single booking receipt details |
| PUT | `/api/bookings/:id/cancel` | Private | Cancel reservation & release seats |

---

## 📋 Project Epics Checklist

- [x] **Epic 1: Project Architecture**: Clean client-server separation, modular folder structure, environment config.
- [x] **Epic 2: Project Setup and Configuration**: Configured `package.json`, installed dependencies, Vite proxy, scripts.
- [x] **Epic 3: Backend Development**: Express server, JWT auth middleware, error handler, controllers, REST endpoints.
- [x] **Epic 4: Database Development**: Mongoose schemas for User, Movie, Showtime, Booking with seat tracking & seeder.
- [x] **Epic 5: Frontend Development**: React 18, Bootstrap 5 theme, interactive seat matrix, auth context, checkout modal, QR ticket view.
- [x] **Epic 6: Project Execution**: Concurrent development script (`npm run dev`), build script tested, production-ready.
