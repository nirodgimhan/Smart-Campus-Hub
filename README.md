# Smart-Campus-Hub
A comprehensive web platform for university campus operations, integrating facility/asset booking and incident ticketing with real‑time notifications, role‑based access (USER, ADMIN, TECHNICIAN), and full audit trails.


# Smart Campus Hub Start

backend run .\mvnw.cmd spring-boot:run
frontend run npm start


## Features

- **Resource Catalogue** – Manage bookable resources (lecture halls, labs, meeting rooms, equipment) with metadata, availability, and status.
- **Booking Management** – Request, approve/reject, cancel bookings with automatic conflict detection.
- **Incident Ticketing** – Report issues with category, priority, location, up to 3 image attachments; assign technicians; comment threads.
- **Notifications** – Real‑time alerts for booking/ticket status changes, new comments, user registration.
- **Authentication** – Email/password login + Google OAuth2, JWT token security.
- **Role Dashboards** – User, Technician, and Admin dashboards with full management panels.

## Tech Stack

Frontend    | React 18, React Router, Axios, Tailwind CSS 
Backend     | Spring Boot 3, Spring Security, JWT, OAuth2 
Database    | MongoDB                              
Build Tools | Maven (backend), npm (frontend)      

## Prerequisites

- **Java 17+**
- **Maven** (or use the included Maven wrapper `.\mvnw.cmd`)
- **Node.js 18+ & npm**
- **MongoDB** (local installation or cloud Atlas URI)

## Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/nirodgimhan/Smart-Campus-Hub.git
cd Smart-Campus-Hub