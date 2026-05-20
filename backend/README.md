# InternFlow AI — Backend API

Production-ready REST API for the InternFlow AI intern management platform.

## Stack

- Node.js + Express 5 + TypeScript
- Prisma ORM (PostgreSQL) — see [prisma/DATABASE_DESIGN.md](./prisma/DATABASE_DESIGN.md) for full schema & ER diagram
- JWT authentication (access + refresh tokens)
- bcrypt, Multer, Zod validation
- Helmet, CORS, Morgan

## Quick start

```bash
cd backend
cp .env.example .env
# Edit .env — set DATABASE_URL and JWT secrets (min 32 chars)

npm install
npx prisma migrate dev --name init
npm run dev
```

API base: `http://localhost:4000/api/v1`

## API endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/health` | — | Health check |
| POST | `/auth/register/admin` | — | Register company admin |
| POST | `/auth/register/intern` | — | Register intern (multipart) |
| POST | `/auth/login` | — | Login |
| POST | `/auth/logout` | — | Revoke refresh token |
| GET | `/auth/me` | Bearer | Current user |
| PATCH | `/users/profile` | Bearer | Update profile |
| POST | `/uploads/resume` | Bearer (intern) | Upload resume |
| POST | `/uploads/profile-photo` | Bearer (intern) | Upload profile photo |

## Intern registration (multipart)

Fields: `fullName`, `email`, `password`, `confirmPassword`, `phone`, `college`, `degree`, `branch`, `internshipRole`, `skills`, `linkedinUrl`, `githubUrl`, `startDate`, `endDate`, `terms`, `resume` (file), `profilePhoto` (file).

## Scripts

- `npm run dev` — development with hot reload
- `npm run build` — compile TypeScript
- `npm start` — run production build
- `npm run prisma:migrate` — run migrations
- `npm run prisma:studio` — Prisma Studio
