# Editorial Lume | Premium Blog Platform

A sophisticated, role-based blog platform built with **Next.js**, **Node.js**, and **PostgreSQL**.

## ✨ Features

- **Premium Design**: "Stitch-inspired" editorial aesthetic with glassmorphism and modern typography.
- **RBAC (Role-Based Access Control)**: 
  - **Admin**: Can manage all posts and access the Admin Portal.
  - **User**: Can create, read, and manage their own essays.
- **Secure Auth**: Powered by **NextAuth.js v5** with hashed passwords via **bcrypt**.
- **Modern Stack**: Server Actions, App Router, and Prisma ORM.

## 🚀 Getting Started

### 1. Database Setup (PostgreSQL)

You can host your database for free using **Vercel Postgres (Neon)** or **Supabase**:

- **Option A: Vercel Postgres**
  1. Push this project to a GitHub repository.
  2. Import the project into Vercel.
  3. Go to the **Storage** tab and select **Postgres**.
  4. Vercel will automatically inject the `DATABASE_URL`.

- **Option B: Supabase**
  1. Create a new project on [Supabase](https://supabase.com/).
  2. Copy the **Connection String** (Transaction mode).
  3. Create a `.env` file and add: `DATABASE_URL="your_connection_string"`

### 2. Environment Variables

Create a `.env` file in the root:

```env
DATABASE_URL="your_postgresql_url"
AUTH_SECRET="run_npx_auth_secret_to_generate"
```

### 3. Installation & Seeding

```bash
# Install dependencies
npm install

# Push schema to database
npx prisma db push

# Seed default users (Admin: admin@blog.com | User: user@blog.com)
# Password for both: admin123 / user123
npm run prisma:seed
```

### 4. Run Development Server

```bash
npm run dev
```

## 🛠 Tech Stack

- **Frontend**: Next.js 15 (App Router)
- **Database**: PostgreSQL (Prisma)
- **Auth**: NextAuth.js v5
- **Styling**: Vanilla CSS (Premium Custom System)
- **Icons**: Lucide React
