# JobHub – Backend

This is the backend for the JobHub application built using **NestJS**, **PostgreSQL**, and **TypeORM**. It provides APIs for job listings, apply to those jobs and creating new jobs.

---

## 🧰 Tech Stack

- NestJS
- TypeORM
- PostgreSQL
- pnpm

---

## ⚙️ Getting Started

### 📦 Prerequisites

- PostgreSQL running locally or via Docker/cloud
- Node.js v18+
- pnpm (install via `npm i -g pnpm`)

### 🛠 Installation

```bash
pnpm install
```

Create the database in psql : createdb -U your_username your_database_name

setup environmental variable for database, admin credentials and jwt tokens from .env.example -

for development server - 

```
pnpm start:dev
```

Then visit - http://localhost:3300/api/v1 to see Hello World !!|

Live backend in Production - https://job-board-backend-eta.vercel.app/api/v1

Production admin credentials - username : admin , password : admin1234

Deployment : Deployment is handled by Vercel.

CI/CD Pipeline - Push to main branch triggers a deployment. You can also trigger deployments manually from the Vercel dashboard.
