
# Interview Tracker

Interview Tracker is a web application that helps students and job seekers manage and track their job application process in one place.

Users can manage applications, track progress with a Kanban board, analyze application statistics, and receive real-time notifications.

## 🌐 Live Demo

**Frontend:** https://interview-tracker-khaki.vercel.app

---

## 🧭 Overview

Interview Tracker provides a centralized workspace for managing the job application process.

---

## ✨ Features

### Authentication & Security

* User registration and login
* Google OAuth 2.0
* Forgot and reset password
* JWT-based authentication
* Password hashing with bcrypt
* Request validation with Zod
* Environment-based configuration

### Application Management

* Create, view, update, and delete job applications
* Update application status
* Organize applications by status
* Manage application and interview information

### Kanban Board

* Visualize applications by status
* Drag and drop applications between columns
* Track application progress visually

### Dashboard & Analytics

* Application statistics
* Application status distribution
* Interview statistics
* Offer statistics
* Application progress overview

### Notification System

* Real-time notifications
* Notification list
* Mark notifications as read
* Socket.IO-based real-time communication

### Email

* Password recovery emails
* SMTP email delivery
* Nodemailer with Brevo SMTP

---

## 💻 Tech Stack

| Layer                   | Technology                    |
| ----------------------- | ----------------------------- |
| Frontend                | React, Vite, Tailwind CSS     |
| State Management        | Zustand                       |
| Routing                 | React Router                  |
| HTTP Client             | Axios                         |
| Backend                 | Node.js, Express.js           |
| Database                | PostgreSQL                    |
| ORM                     | Prisma                        |
| Authentication          | JWT, Google OAuth 2.0, bcrypt |
| Validation              | Zod                           |
| Real-time Communication | Socket.IO                     |
| Email                   | Nodemailer, Brevo SMTP        |
| Containerization        | Docker, Docker Compose        |
| Reverse Proxy           | Nginx                         |
| Server                  | Oracle Cloud VPS, Ubuntu      |
| HTTPS                   | Let's Encrypt, Certbot        |
| Frontend Deployment     | Vercel                        |
| Container Registry      | Docker Hub                    |
| CI/CD                   | GitHub Actions                |

---

## 🏗️ System Architecture

![System Architecture](./docs/system-architecture.png)
---

## 📦 Project Structure

```text
Interview_Tracker/
├── backend/
│   ├── src/
│   ├── prisma/
│   ├── Dockerfile
│   └── README.md
│
├── frontend/
│   ├── src/
│   └── README.md
│
├── docs/
│   └── system-architecture.png
│
├── docker-compose.yml
├── README.md
└── .gitignore
```

---

## 🔌 API Overview

### Authentication

* Register
* Login
* Google OAuth 2.0
* Forgot Password
* Reset Password
* Get Current User

### Applications

* Create Application
* Get Applications
* Get Application Details
* Update Application
* Delete Application
* Update Application Status

### Dashboard

* Application Statistics
* Application Analytics
* Interview Statistics
* Offer Statistics

### Notifications

* Get Notifications
* Mark Notification as Read
* Real-time Notifications

---

## 🐳 Docker

The backend and PostgreSQL database are containerized using Docker.

The production environment uses:

* Docker
* Docker Compose
* PostgreSQL container
* Docker network for service-to-service communication
* Persistent Docker volume for PostgreSQL data
* Container restart policies
* Docker log rotation

The backend image is published to Docker Hub and deployed to an ARM64-compatible Oracle Cloud VPS.

---

## 🌐 Deployment

### Frontend

The React frontend is deployed on Vercel.

### Backend

The Express.js backend runs inside a Docker container on an Oracle Cloud VPS.

### Database

PostgreSQL runs as a Docker container on the VPS with persistent storage using a Docker volume.

### Reverse Proxy

Nginx acts as the reverse proxy for the backend API.

### HTTPS

HTTPS is configured using Let's Encrypt and Certbot.

