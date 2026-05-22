# Database & Backend Design — Aysar App

**Date:** 2026-05-21
**Status:** Draft
**Scope:** Express.js custom server, Prisma ORM, PostgreSQL, admin auth, home page DB-driven

---

## 1. Architecture Overview

```
Client (Next.js SSR + Client Components)
    │
    ▼
Express.js Custom Server (port 3000)
    ├── Next.js App Router (handles pages/rendering)
    ├── API Middleware (auth, CORS, error handling)
    └── API Routes (REST endpoints)
            │
            ▼
    Prisma Client (ORM)
            │
            ▼
    PostgreSQL Database
```

Express.js wraps Next.js as a custom server. This keeps everything in one process with shared TypeScript types, shared Prisma client, and no CORS issues between frontend and API.

**Tech stack additions:**
- `express`, `@types/express` — custom server
- `prisma`, `@prisma/client` — ORM
- `bcryptjs` / `jsonwebtoken` — auth
- `cookie-parser` — cookie utilities

---

## 2. Database Schema (Prisma)

### 2.1 Models Overview

```
User                (normalized, many rows — admin auth)
HomePage            (singleton — one row)
PlansPage           (singleton — one row)
ContactPage         (singleton — one row)
SiteSettings        (singleton — one row)
Policies            (singleton — one row)
ContactMessage      (normalized, many rows — form submissions)
```

### 2.2 User Model

```prisma
model User {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String   @map("password_hash")
  name         String
  role         String   @default("ADMIN")  // enum in future: ADMIN, EDITOR
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  @@map("users")
}
```

### 2.3 HomePage (Singleton)

```prisma
model HomePage {
  id              String   @id @default("HOME")
  hero            Json     @default("{}")
  featureSections Json     @default("[]")  @map("feature_sections")
  bentoFeatures   Json     @default("[]")  @map("bento_features")
  projectOverview Json     @default("{}")  @map("project_overview")
  appSection      Json     @default("{}")  @map("app_section")
  ctaSection      Json     @default("{}")  @map("cta_section")
  updatedAt       DateTime @updatedAt @map("updated_at")

  @@map("home_page")
}
```

JSON column shapes match existing Zod schemas:

| Column            | Zod Schema              | Placeholder Source     |
| ----------------- | ----------------------- | ---------------------- |
| `hero`            | `heroSectionSchema`     | `HOME_HERO`            |
| `featureSections` | `featureSectionSchema[]`| `FEATURE_SECTIONS`     |
| `bentoFeatures`   | `bentoFeatureSchema[]`  | `BENTO_FEATURES`       |
| `projectOverview` | (nested object)         | `PROJECT_OVERVIEW`     |
| `appSection`      | (nested object)         | `APP_SECTION`          |
| `ctaSection`      | (nested object)         | `CTA_SECTION`          |

### 2.4 PlansPage (Singleton)

```prisma
model PlansPage {
  id          String   @id @default("PLANS")
  plans       Json     @default("[]")  // planSchema[]
  compareRows Json     @default("[]")  @map("compare_rows")
  faqItems    Json     @default("[]")  @map("faq_items")  // faqItemSchema[]
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@map("plans_page")
}
```

### 2.5 ContactPage (Singleton)

```prisma
model ContactPage {
  id             String   @id @default("CONTACT")
  hero           Json     @default("{}")
  channels       Json     @default("[]")  // contactChannelSchema[]
  inquiryOptions Json     @default("[]")  @map("inquiry_options")
  updatedAt      DateTime @updatedAt @map("updated_at")

  @@map("contact_page")
}
```

### 2.6 Policies (Singleton)

```prisma
model Policies {
  id        String   @id @default("POLICIES")
  privacy   Json     @default("{}")  // policySchema
  terms     Json     @default("{}")  // policySchema
  returns   Json     @default("{}")  // policySchema
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("policies")
}
```

### 2.7 SiteSettings (Singleton)

```prisma
model SiteSettings {
  id          String   @id @default("SETTINGS")
  siteTitle   String   @default("")  @map("site_title")
  siteDescription String @default("") @map("site_description")
  faviconUrl  String?  @map("favicon_url")
  seoKeywords String   @default("")  @map("seo_keywords")
  navLinks    Json     @default("[]")  @map("nav_links")  // navLinkSchema[]
  socialLinks Json     @default("{}")  @map("social_links")  // socialLinksSchema
  appLinks    Json     @default("{}")  @map("app_links")  // appLinksSchema
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@map("site_settings")
}
```

### 2.8 ContactMessage (Normalized, many rows)

```prisma
model ContactMessage {
  id        String   @id @default(uuid())
  fullName  String   @map("full_name")
  email     String
  phone     String?
  inquiry   String
  subject   String
  message   String   @db.Text
  isRead    Boolean  @default(false) @map("is_read")
  createdAt DateTime @default(now()) @map("created_at")

  @@map("contact_messages")
}
```

---

## 3. API Endpoints

### 3.1 Auth

| Method | Path              | Body                      | Response      | Notes                        |
| ------ | ----------------- | ------------------------- | ------------- | ---------------------------- |
| POST   | `/api/auth/login` | `{ email, password }`     | `{ token }`   | Sets httpOnly cookie          |
| POST   | `/api/auth/logout`| —                         | `{}`          | Clears cookie                |
| GET    | `/api/auth/me`    | —                         | `{ user }`    | Requires auth middleware      |

### 3.2 Home Page (Public Read + Admin Write)

| Method | Path               | Auth     | Body                    | Response        |
| ------ | ------------------ | -------- | ----------------------- | --------------- |
| GET    | `/api/home-page`   | Public   | —                       | `HomePage` JSON |
| PATCH  | `/api/home-page`   | Admin    | `{ hero?, featureSections?, ... }` | Updated row |

`GET /api/home-page` is public — the SSR page fetches it at request time.
`PATCH` accepts partial updates per section.

### 3.3 Future Endpoints (not implemented in this phase)

| Method | Path                    | Auth  |
| ------ | ----------------------- | ----- |
| GET    | `/api/plans-page`       | Public|
| PATCH  | `/api/plans-page`       | Admin |
| GET    | `/api/contact-page`     | Public|
| PATCH  | `/api/contact-page`     | Admin |
| GET    | `/api/policies/:type`   | Public|
| PATCH  | `/api/policies`         | Admin |
| GET    | `/api/settings`         | Public|
| PATCH  | `/api/settings`         | Admin |
| POST   | `/api/messages`         | Public|
| GET    | `/api/messages`         | Admin |

---

## 4. Authentication Flow

1. Admin logs in via `/dashboard/login` → POST `/api/auth/login`
2. Server verifies password with bcrypt, issues JWT
3. JWT stored in httpOnly cookie + returned in response
4. `authMiddleware` extracts JWT from cookie, verifies, attaches `req.user`
5. Admin-only routes check `req.user.role === "ADMIN"`
6. Logout clears cookie

**Cookie config:**
- `httpOnly: true`
- `secure: true` (production only)
- `sameSite: "lax"`
- `path: "/"`

---

## 5. Data Flow: DB → Home Page

### Current (Hardcoded)
```
page.tsx → imports hardcoded strings/jsx → renders
```

### After (DB-driven)
```
Request to / → Next.js SSR fetches GET /api/home-page → passes data to page component as props
page.tsx → receives props → renders same sections with DB data
```

The page component signature changes from:
```tsx
export default function Home() {
  // hardcoded
}
```

To:
```tsx
async function getHomePageData(): Promise<HomePageData> {
  const res = await fetch(`${baseUrl}/api/home-page`);
  return res.json();
}

export default async function Home() {
  const data = await getHomePageData();
  // pass data to sections
}
```

### Fallback / Migration Safety
If DB is empty (first run), the API returns the existing hardcoded placeholder data as defaults.
Seeding populates the DB with current placeholder values on first migration.

---

## 6. File Structure (new additions)

```
aysar-app/
├── server.ts                        # Express custom server entry
├── app/
│   ├── api/                         # Express API routes
│   │   ├── auth/
│   │   │   ├── login.ts            # POST handler
│   │   │   ├── logout.ts           # POST handler
│   │   │   └── me.ts               # GET handler
│   │   ├── home-page/
│   │   │   ├── get.ts             # GET handler
│   │   │   └── patch.ts           # PATCH handler (admin)
│   │   └── index.ts               # Route registrations
│   ├── middleware/
│   │   ├── auth.ts                 # JWT verification middleware
│   │   └── error-handler.ts       # Global error handler
│   └── (public)/page.tsx           # Updated: fetches from API
├── prisma/
│   ├── schema.prisma               # All models
│   ├── seed.ts                     # Seed with current placeholder data
│   └── migrations/
├── app/lib/
│   ├── db.ts                       # Prisma client singleton
│   └── validation.ts               # Zod validation (reuse existing schemas)
```

**Key principle:** API route handlers are plain functions (not Next.js route files) since Express handles routing. They live in `app/api/` for path aliasing convenience but are imported by `server.ts`.

---

## 7. Migration Strategy

### Phase 1: Home Page (this phase)
1. Add Express.js, Prisma, auth dependencies
2. Create Prisma schema with all models
3. Create Express server wrapping Next.js
4. Implement `/api/auth/*` endpoints
5. Implement `/api/home-page` GET + PATCH endpoints
6. Seed database with current placeholder data
7. Update `app/(public)/page.tsx` to fetch from API
8. Update dashboard home-page editor to save to API
9. Add `/dashboard/login` page

### Phase 2: Remaining Pages (future)
- Follow same pattern per page
- Each page gets GET/PATCH endpoint, dashboard editor connects, public page fetches from API

### Phase 3: Polish (future)
- Add validation middleware (Zod per-section)
- Add rate limiting
- Add audit logging on content changes

---

## 8. Error Handling

- Global Express error handler catches all thrown errors
- Auth errors → 401 Unauthorized
- Validation errors → 422 Unprocessable Entity
- Not found → 404
- Server errors → 500 (logged, sanitized message)
- All API responses follow envelope: `{ success: boolean, data?: T, error?: string }`

---

## 9. Prisma Client Management

Singleton pattern — prevents multiple PrismaClient instances in dev (hot reload issue):
```ts
// lib/db.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

---

## 10. Type Safety Between API and Frontend

Shared types derived from Zod schemas (already exist):
```ts
// app/lib/dashboard/schemas.ts
export const heroSectionSchema = z.object({ ... });
export type HeroSection = z.infer<typeof heroSectionSchema>;
```

API validates with Zod on write, types flow to frontend via `z.infer`.

---

## 11. Environment Variables

```env
DATABASE_URL="postgresql://user:password@localhost:5432/aysar"
JWT_SECRET="<random-secret>"
NODE_ENV="development"
```

---

## 12. Commands After Setup

```bash
pnpm prisma migrate dev --name init    # Create first migration
pnpm prisma db seed                     # Seed database
pnpm dev                                # Start Express+Next.js dev server
```
