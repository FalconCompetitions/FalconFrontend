# Tcc-Front: Academic Competition Management Dashboard

This project is a management dashboard for academic competitions, designed to help administrators, instructors, and participants manage programming contests and related activities efficiently.

## Table of Contents
- [Tcc-Front: Academic Competition Management Dashboard](#tcc-front-academic-competition-management-dashboard)
	- [Table of Contents](#table-of-contents)
	- [Overview](#overview)
	- [Features](#features)
	- [Project Structure](#project-structure)
	- [Prerequisites](#prerequisites)
	- [Installation](#installation)
	- [Running the Project](#running-the-project)
		- [Development Mode](#development-mode)
		- [Docker Deployment](#docker-deployment)
	- [Building for Production](#building-for-production)
	- [Testing and Linting](#testing-and-linting)
		- [Linting](#linting)
	- [Technology Stack](#technology-stack)
		- [Core](#core)
		- [UI \& Styling](#ui--styling)
		- [Real-time \& API](#real-time--api)
		- [Forms \& Validation](#forms--validation)
		- [Other](#other)
	- [Documentation](#documentation)

## Overview
Tcc-Front is a web-based dashboard built with Next.js 15.1.6, React 19, and TypeScript. It provides tools for managing users, competitions, exercises, rankings, and more, with real-time updates via SignalR WebSocket. The application features a modern and responsive UI using Material-UI v7 and Tailwind CSS.

## Features
- **User authentication and role-based access** (Admin, Teacher, Student roles)
- **Competition and exercise management** with template support
- **Real-time updates via SignalR WebSocket** for submissions, questions, and ranking
- **Live ranking and results visualization** with instant updates
- **Admin and participant dashboards** with role-specific features
- **Q&A system** for real-time question/answer during competitions
- **Submission management** with automatic judging and manual correction
- **Responsive design** with Material-UI v7 and Tailwind CSS
- **Server-side rendering** with Next.js App Router

## Project Structure
```
src/
  app/              # Next.js App Router (pages, layouts, API routes)
    (auth)/         # Authentication routes (login, register, logout)
    admin/          # Admin-only routes
    Competition/    # Competition management and participation
    Profile/        # User profile and subscriptions
    api/            # API routes (BFF layer to backend)
  components/       # Reusable UI components
    _ui/            # Core UI components (Button, Input, Navbar, etc.)
    pages/          # Page-specific components
  contexts/         # React context providers
    UserContext/             # User authentication state
    WebSocketContext/        # Base SignalR connection
    CompetitionHubContext/   # Competition-specific SignalR features
    CompetitionContext/      # Competition templates and models
  providers/        # Context provider implementations
  services/         # Business logic and API service classes (static methods)
  types/            # TypeScript type definitions organized by domain
  libs/             # Utility libraries (API client, helpers)
  utilities/        # Utility functions and styled components
  constants/        # Application constants
public/             # Static assets (images, fonts, code templates)
  fonts/            # Font files
  teamplate/        # Code templates for different languages
certificates/       # Local development SSL certificates
docs/               # Documentation files
  SIGNALR_FRONTEND_IMPLEMENTATION.md
  SIGNALR_ISSUES_AND_GAPS.md
  COMPETITION_STATUS_BAR.md
```

## Prerequisites
- **Node.js** v18 or higher (v22.18.0 used in Docker)
- **npm** or **yarn** package manager
- **SSL Certificates** for local HTTPS development (in `certificates/` folder)
- (Optional) **Docker** for containerized deployment

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/gabipataca/Tcc-Front.git
   cd Tcc-Front
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.development` or `.env.production` and adjust as needed
   - Required variables:
     - `PRIVATE_API_URL`: Backend API URL for server-side requests (e.g., `https://localhost:7163/api`)
     - `NEXT_PUBLIC_API_URL_CUSTOM`: WebSocket hub URL (e.g., `https://localhost:7163`)
     - `NODE_TLS_REJECT_UNAUTHORIZED=0`: For development with self-signed certificates

4. Generate SSL certificates for local HTTPS:
   - Place `localhost.pem` and `localhost-key.pem` in the `certificates/` folder
   - Or generate using tools like `mkcert` or `openssl`

## Running the Project

### Development Mode
Start the development server with HTTPS (required for SignalR WebSocket):
```bash
npm run dev
```
The app will be available at **https://localhost:3000**.

> **Important:** 
> - The project runs with `--experimental-https` flag for local HTTPS support
> - Ensure `certificates/localhost.pem` and `certificates/localhost-key.pem` exist
> - Trust the certificates in your browser if prompted
> - Backend API must be running and accessible at the configured `PRIVATE_API_URL`

### Docker Deployment
Build and run using Docker:
```bash
docker build -t tcc-front .
docker run -p 3000:3000 tcc-front
```

## Building for Production
Build the optimized production bundle:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

The production build will:
- Optimize and minify all assets
- Generate static pages where possible (ISR/SSG)
- Enable production optimizations for React and Next.js

## Testing and Linting

### Linting
Run ESLint to check code quality:
```bash
npm run lint
```

## Technology Stack

### Core
- **Next.js** 15.1.6 - React framework with App Router
- **React** 19.0.0 - UI library
- **TypeScript** 5.8.2 - Type-safe JavaScript

### UI & Styling
- **Material-UI (MUI)** v7 - Component library
- **Emotion** - CSS-in-JS styling
- **Tailwind CSS** 3.4.1 - Utility-first CSS
- **Radix UI** - Headless UI components

### Real-time & API
- **SignalR** (@microsoft/signalr 8.0.7) - WebSocket communication
- **Axios** 1.11.0 - HTTP client

### Forms & Validation
- **react-hook-form** 7.54.2 - Form state management
- **Yup** 1.6.1 - Schema validation
- **Zod** 3.24.2 - TypeScript-first validation

### Other
- **notistack** 3.0.2 - Snackbar notifications
- **jsonwebtoken** 9.0.2 - JWT token handling

## Documentation
- [SignalR Frontend Implementation](docs/SIGNALR_FRONTEND_IMPLEMENTATION.md)
- [SignalR Issues and Gaps](docs/SIGNALR_ISSUES_AND_GAPS.md)
- [Competition Status Bar](docs/COMPETITION_STATUS_BAR.md)
- [Copilot Instructions](.github/copilot-instructions.md)


