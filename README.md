# Assistant Builder

**Assistant Builder** is a fullstack SaaS-style platform for creating and managing AI assistants.

The project is deployed in production and uses a separate frontend, backend API and PostgreSQL database.

## Live Demo

https://assistant-builder-beige.vercel.app

## Backend Repository

https://github.com/Kulbedka/assistant-builder-api

---

## Tech Stack

**Frontend:**
Next.js • React • TypeScript • HTML • CSS

**Backend API:**
Node.js • Express.js • REST API • JWT • bcrypt • Prisma ORM

**Database:**
PostgreSQL • Supabase

**Deployment / Tools:**
Vercel • VPS • Nginx • PM2 • Git • GitHub • npm • Environment variables

---

## Features

* User registration and login
* JWT authentication with HTTP-only cookies
* Email verification before login
* Password hashing with bcrypt
* View available AI assistants
* Create new assistants
* Open chat with an assistant
* Send messages in chat
* Store assistants in PostgreSQL
* Store chat messages in PostgreSQL
* Connect frontend with external Express.js API
* Production deployment with separate frontend and backend

---

## Architecture

The project uses a separated fullstack architecture:

```text
User
  ↓
Next.js Frontend on Vercel
  ↓ REST API
Express.js Backend on VPS
  ↓ Prisma ORM
PostgreSQL / Supabase Database
```

Frontend is responsible for the user interface and client-side interactions.
Backend API handles business logic, authentication, assistants, messages and database operations.
Database stores users, assistants and chat messages.

---

## What I Built

* Built a responsive frontend using Next.js, React and TypeScript.
* Connected frontend to a separate Express.js backend API.
* Implemented pages for assistant list, assistant creation, chat, login, registration and email verification.
* Integrated authentication flow with backend API.
* Added protected pages for authenticated users.
* Connected production frontend to production backend using environment variables.
* Deployed frontend to Vercel.
* Tested production frontend-backend-database communication.

---

## Project Structure

```text
assistant-builder/
├── app/
│   ├── assistants/
│   ├── chat/
│   ├── login/
│   ├── register/
│   └── verify-email/
├── components/
├── lib/
├── prisma/
├── public/
└── scripts/
```

---

## Local Development

Clone the repository:

```bash
git clone https://github.com/Kulbedka/assistant-builder.git
cd assistant-builder
```

Install dependencies:

```bash
npm install
```

Create `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Run the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Production

Frontend is deployed on **Vercel**.

Production backend API is deployed separately on a **VPS** using **Nginx** and **PM2**.

The frontend communicates with the backend through:

```env
NEXT_PUBLIC_API_URL
```

---

## Status

The project is currently in active development.

Implemented:

* Frontend pages
* Assistant list
* Assistant creation
* Chat UI
* Registration
* Login
* Logout
* Email verification page
* Protected pages
* Production deployment

Planned improvements:

* Chat editing
* Chat deletion
* Chat duplication
* User permissions
* Assistant sharing
* Improved AI assistant functionality
