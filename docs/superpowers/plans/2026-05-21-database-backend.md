# Database & Backend Implementation Plan — Home Page DB-Driven

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace hardcoded homepage content with database-driven content served via Express.js + Prisma + PostgreSQL, with JWT admin auth for the dashboard CMS.

**Architecture:** Express.js custom server wraps Next.js 16 — API routes for auth and content, Prisma ORM with singleton page tables using JSON columns matching existing Zod schemas, httpOnly JWT cookie auth. Home page SSR fetches from API; dashboard editor saves via PATCH.

**Tech Stack:** Express.js, Prisma + PostgreSQL, bcryptjs + jsonwebtoken, cookie-parser, tsx (dev server)

---

## File Structure

```
aysar-app/
├── server.ts                        # NEW: Express custom server wrapper
├── app/
│   ├── api/
│   │   ├── index.ts                # NEW: API router, registers all sub-routes
│   │   ├── auth/
│   │   │   ├── index.ts            # NEW: Auth router (login/logout/me)
│   │   │   └── handlers.ts         # NEW: Auth route handlers
│   │   ├── home-page/
│   │   │   ├── index.ts            # NEW: Home-page router (GET/PATCH)
│   │   │   └── handlers.ts         # NEW: Home-page route handlers
│   ├── middleware/
│   │   └── auth.ts                 # NEW: JWT auth middleware
│   ├── lib/
│   │   ├── db.ts                   # NEW: Prisma client singleton
│   │   └── shared-types.ts         # NEW: API response types + validation
│   ├── (public)/page.tsx           # MODIFY: Fetch data from API
│   ├── (dashboard)/dashboard/
│   │   ├── home-page/page.tsx      # MODIFY: Load from API, save via PATCH
│   │   └── login/
│   │       └── page.tsx            # NEW: Admin login page
├── prisma/
│   ├── schema.prisma               # NEW: Full schema (7 models)
│   └── seed.ts                     # NEW: Seed with placeholder data
├── .env                            # MODIFY: Add DATABASE_URL, JWT_SECRET
└── package.json                    # MODIFY: Add deps, update scripts
```

---

### Task 1: Install Dependencies and Configure Environment

**Files:**
- Modify: `package.json`
- Modify: `.env` (create if missing)

- [ ] **Step 1: Install new dependencies**

```bash
pnpm add express cookie-parser @prisma/client bcryptjs jsonwebtoken zod
pnpm add -D prisma @types/express @types/cookie-parser @types/bcryptjs @types/jsonwebtoken tsx
```

- [ ] **Step 2: Update package.json scripts**

Replace:
```
"dev": "next dev",
"start": "next start",
```

With:
```
"dev": "tsx server.ts",
"start": "NODE_ENV=production tsx server.ts",
"postinstall": "prisma generate",
```

```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

- [ ] **Step 3: Create/update .env**

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/aysar"
JWT_SECRET="aysar-dev-secret-change-in-production"
NODE_ENV="development"
```

- [ ] **Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml .env
git commit -m "chore: add Express, Prisma, auth dependencies and env config"
```

---

### Task 2: Create Prisma Schema

**Files:**
- Create: `prisma/schema.prisma`

- [ ] **Step 1: Create prisma/schema.prisma**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String   @map("password_hash")
  name         String   @default("Admin")
  role         String   @default("ADMIN")
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  @@map("users")
}

model HomePage {
  id              String   @id @default("HOME")
  hero            Json     @default("{}")
  featureSections Json     @default("[]") @map("feature_sections")
  bentoFeatures   Json     @default("[]") @map("bento_features")
  projectOverview Json     @default("{}") @map("project_overview")
  appSection      Json     @default("{}") @map("app_section")
  ctaSection      Json     @default("{}") @map("cta_section")
  updatedAt       DateTime @updatedAt @map("updated_at")

  @@map("home_page")
}

model PlansPage {
  id          String   @id @default("PLANS")
  plans       Json     @default("[]")
  compareRows Json     @default("[]") @map("compare_rows")
  faqItems    Json     @default("[]") @map("faq_items")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@map("plans_page")
}

model ContactPage {
  id             String   @id @default("CONTACT")
  hero           Json     @default("{}")
  channels       Json     @default("[]")
  inquiryOptions Json     @default("[]") @map("inquiry_options")
  updatedAt      DateTime @updatedAt @map("updated_at")

  @@map("contact_page")
}

model Policies {
  id        String   @id @default("POLICIES")
  privacy   Json     @default("{}")
  terms     Json     @default("{}")
  returns   Json     @default("{}")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("policies")
}

model SiteSettings {
  id              String   @id @default("SETTINGS")
  siteTitle       String   @default("") @map("site_title")
  siteDescription String   @default("") @map("site_description")
  faviconUrl      String?  @map("favicon_url")
  seoKeywords     String   @default("") @map("seo_keywords")
  navLinks        Json     @default("[]") @map("nav_links")
  socialLinks     Json     @default("{}") @map("social_links")
  appLinks        Json     @default("{}") @map("app_links")
  updatedAt       DateTime @updatedAt @map("updated_at")

  @@map("site_settings")
}

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

- [ ] **Step 2: Run Prisma migrate**

```bash
pnpm prisma migrate dev --name init
```

Expected: Creates migration + generates PrismaClient

- [ ] **Step 3: Commit**

```bash
git add prisma/ prisma/migrations/
git commit -m "feat: add Prisma schema with all models"
```

---

### Task 3: Create Prisma Client Singleton and Shared Types

**Files:**
- Create: `app/lib/db.ts`
- Create: `app/lib/shared-types.ts`

- [ ] **Step 1: Create app/lib/db.ts**

```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

- [ ] **Step 2: Create app/lib/shared-types.ts**

```ts
import { z } from "zod";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export const loginSchema = z.object({
  email: z.string().email("بريد إلكتروني غير صالح"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const homePageUpdateSchema = z.object({
  hero: z.any().optional(),
  featureSections: z.any().optional(),
  bentoFeatures: z.any().optional(),
  projectOverview: z.any().optional(),
  appSection: z.any().optional(),
  ctaSection: z.any().optional(),
});

export type HomePageUpdate = z.infer<typeof homePageUpdateSchema>;

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export interface AuthenticatedRequest extends Express.Request {
  user?: JwtPayload;
}
```

- [ ] **Step 3: Commit**

```bash
git add app/lib/db.ts app/lib/shared-types.ts
git commit -m "feat: add Prisma client singleton and shared types"
```

**Note:** The `AuthenticatedRequest` import for `Express.Request` won't resolve yet. We add `import type { Request } from "express";` at the top when we create middleware that uses it. For now, add:

```ts
import type { Request } from "express";

export type AuthenticatedRequest = Request & { user?: JwtPayload };
```

---

### Task 4: Create Auth Middleware

**Files:**
- Create: `app/middleware/auth.ts`

- [ ] **Step 1: Create app/middleware/auth.ts**

```ts
import type { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload, AuthenticatedRequest } from "@/app/lib/shared-types";

const JWT_SECRET = process.env.JWT_SECRET || "aysar-dev-secret-change-in-production";

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({ success: false, error: "الرجاء تسجيل الدخول" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ success: false, error: "انتهت الجلسة، الرجاء إعادة تسجيل الدخول" });
  }
}

export function adminMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    res.status(401).json({ success: false, error: "الرجاء تسجيل الدخول" });
    return;
  }

  if (req.user.role !== "ADMIN") {
    res.status(403).json({ success: false, error: "غير مصرح" });
    return;
  }

  next();
}
```

- [ ] **Step 2: Commit**

```bash
git add app/middleware/auth.ts
git commit -m "feat: add JWT auth + admin middleware"
```

---

### Task 5: Create Auth API Routes

**Files:**
- Create: `app/api/auth/handlers.ts`
- Create: `app/api/auth/index.ts`

- [ ] **Step 1: Create app/api/auth/handlers.ts**

```ts
import type { Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/app/lib/db";
import { loginSchema } from "@/app/lib/shared-types";
import type { AuthenticatedRequest, ApiResponse } from "@/app/lib/shared-types";

const JWT_SECRET = process.env.JWT_SECRET || "aysar-dev-secret-change-in-production";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export async function loginHandler(
  req: AuthenticatedRequest,
  res: Response<ApiResponse<{ token: string; user: { id: string; email: string; name: string; role: string } }>>
): Promise<void> {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ success: false, error: "بيانات غير صالحة" });
    return;
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(401).json({ success: false, error: "بريد إلكتروني أو كلمة مرور غير صحيحة" });
    return;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ success: false, error: "بريد إلكتروني أو كلمة مرور غير صحيحة" });
    return;
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("token", token, COOKIE_OPTIONS);
  res.json({
    success: true,
    data: {
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    },
  });
}

export async function logoutHandler(
  _req: AuthenticatedRequest,
  res: Response<ApiResponse>
): Promise<void> {
  res.clearCookie("token", { path: "/" });
  res.json({ success: true });
}

export async function meHandler(
  req: AuthenticatedRequest,
  res: Response<ApiResponse<{ id: string; email: string; name: string; role: string }>>
): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, error: "غير مصرح" });
    return;
  }

  const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
  if (!user) {
    res.status(401).json({ success: false, error: "المستخدم غير موجود" });
    return;
  }

  res.json({
    success: true,
    data: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
}
```

- [ ] **Step 2: Create app/api/auth/index.ts**

```ts
import { Router } from "express";
import { authMiddleware } from "@/app/middleware/auth";
import { loginHandler, logoutHandler, meHandler } from "./handlers";

export const authRouter = Router();

authRouter.post("/login", loginHandler);
authRouter.post("/logout", logoutHandler);
authRouter.get("/me", authMiddleware, meHandler);
```

- [ ] **Step 3: Commit**

```bash
git add app/api/auth/
git commit -m "feat: add auth API routes (login/logout/me)"
```

---

### Task 6: Create Home-Page API Routes

**Files:**
- Create: `app/api/home-page/handlers.ts`
- Create: `app/api/home-page/index.ts`

- [ ] **Step 1: Create app/api/home-page/handlers.ts**

```ts
import type { Response } from "express";
import { prisma } from "@/app/lib/db";
import { homePageUpdateSchema } from "@/app/lib/shared-types";
import type { AuthenticatedRequest, ApiResponse } from "@/app/lib/shared-types";
import {
  HOME_HERO,
  FEATURE_SECTIONS,
  BENTO_FEATURES,
  PROJECT_OVERVIEW,
  APP_SECTION,
  CTA_SECTION,
} from "@/app/lib/dashboard/placeholders";

function buildDefaultHomePage() {
  return {
    id: "HOME",
    hero: HOME_HERO,
    featureSections: FEATURE_SECTIONS,
    bentoFeatures: BENTO_FEATURES,
    projectOverview: PROJECT_OVERVIEW,
    appSection: APP_SECTION,
    ctaSection: CTA_SECTION,
    updatedAt: new Date().toISOString(),
  };
}

export async function getHomePageHandler(
  _req: AuthenticatedRequest,
  res: Response<ApiResponse>
): Promise<void> {
  let page = await prisma.homePage.findUnique({ where: { id: "HOME" } });

  if (!page) {
    const defaults = buildDefaultHomePage();
    res.json({ success: true, data: defaults });
    return;
  }

  res.json({ success: true, data: page });
}

export async function updateHomePageHandler(
  req: AuthenticatedRequest,
  res: Response<ApiResponse>
): Promise<void> {
  const parsed = homePageUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ success: false, error: "بيانات غير صالحة" });
    return;
  }

  const page = await prisma.homePage.upsert({
    where: { id: "HOME" },
    create: {
      id: "HOME",
      hero: parsed.data.hero ?? HOME_HERO,
      featureSections: parsed.data.featureSections ?? FEATURE_SECTIONS,
      bentoFeatures: parsed.data.bentoFeatures ?? BENTO_FEATURES,
      projectOverview: parsed.data.projectOverview ?? PROJECT_OVERVIEW,
      appSection: parsed.data.appSection ?? APP_SECTION,
      ctaSection: parsed.data.ctaSection ?? CTA_SECTION,
    },
    update: parsed.data,
  });

  res.json({ success: true, data: page });
}
```

- [ ] **Step 2: Create app/api/home-page/index.ts**

```ts
import { Router } from "express";
import { authMiddleware, adminMiddleware } from "@/app/middleware/auth";
import { getHomePageHandler, updateHomePageHandler } from "./handlers";

export const homePageRouter = Router();

homePageRouter.get("/", getHomePageHandler);
homePageRouter.patch("/", authMiddleware, adminMiddleware, updateHomePageHandler);
```

- [ ] **Step 3: Commit**

```bash
git add app/api/home-page/
git commit -m "feat: add home-page API routes (GET/PATCH)"
```

---

### Task 7: Create API Router and Express Server

**Files:**
- Create: `app/api/index.ts`
- Create: `server.ts`

- [ ] **Step 1: Create app/api/index.ts**

```ts
import { Router } from "express";
import { authRouter } from "./auth";
import { homePageRouter } from "./home-page";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/home-page", homePageRouter);
```

- [ ] **Step 2: Create server.ts**

```ts
import express from "express";
import next from "next";
import cookieParser from "cookie-parser";
import { apiRouter } from "./app/api";

const dev = process.env.NODE_ENV !== "production";
const port = parseInt(process.env.PORT || "3000", 10);

const nextApp = next({ dev, port });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const server = express();

  server.use(cookieParser());
  server.use(express.json());

  server.use("/api", apiRouter);

  server.all("*", (req, res) => handle(req, res));

  server.listen(port, () => {
    console.log(`> Server running on http://localhost:${port}`);
  });
});
```

- [ ] **Step 3: Verify server starts**

```bash
pnpm dev
```

Expected: `> Server running on http://localhost:3000`

- [ ] **Step 4: Test GET /api/home-page (without seed — should return defaults)**

```bash
curl http://localhost:3000/api/home-page | head -c 200
```

Expected: Returns placeholder data as defaults

- [ ] **Step 5: Commit**

```bash
git add app/api/index.ts server.ts
git commit -m "feat: add API router and Express custom server"
```

---

### Task 8: Create Seed Script

**Files:**
- Create: `prisma/seed.ts`

- [ ] **Step 1: Create prisma/seed.ts**

```ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  HOME_HERO,
  FEATURE_SECTIONS,
  BENTO_FEATURES,
  PROJECT_OVERVIEW,
  APP_SECTION,
  CTA_SECTION,
} from "../app/lib/dashboard/placeholders";

const prisma = new PrismaClient();

async function main() {
  // Admin user
  const passwordHash = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@aysar.sa" },
    update: {},
    create: {
      email: "admin@aysar.sa",
      passwordHash,
      name: "مدير النظام",
      role: "ADMIN",
    },
  });

  // HomePage
  // Build featureSections with layout and accentColor matching the FEATURE_SECTIONS array structure
  await prisma.homePage.upsert({
    where: { id: "HOME" },
    update: {},
    create: {
      id: "HOME",
      hero: HOME_HERO,
      featureSections: FEATURE_SECTIONS,
      bentoFeatures: BENTO_FEATURES,
      projectOverview: PROJECT_OVERVIEW,
      appSection: APP_SECTION,
      ctaSection: CTA_SECTION,
    },
  });

  console.log("Seed complete: admin user + home page data created");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

- [ ] **Step 2: Run seed**

```bash
pnpm prisma db seed
```

Expected: `Seed complete: admin user + home page data created`

- [ ] **Step 3: Verify data in DB**

```bash
pnpm prisma studio
```

Check: `home_page` table has one row with `HOME` ID and all JSON columns populated. `users` table has `admin@aysar.sa` user.

- [ ] **Step 4: Test login**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@aysar.sa","password":"admin123"}' -c /tmp/cookies.txt
```

Expected: `{"success":true,"data":{"token":"...","user":{...}}}`

- [ ] **Step 5: Test GET /api/home-page with DB data**

```bash
curl http://localhost:3000/api/home-page | python3 -m json.tool | head -30
```

Expected: Returns seeded data

- [ ] **Step 6: Commit**

```bash
git add prisma/seed.ts
git commit -m "feat: add seed script with admin user and home page data"
```

---

### Task 9: Update Home Page to Fetch from API

**Files:**
- Modify: `app/(public)/page.tsx`

- [ ] **Step 1: Create a data-fetching helper**

Create `app/lib/home-page-data.ts`:

```ts
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export interface HomePageResponse {
  id: string;
  hero: {
    badge?: string | null;
    title: string;
    titleAccent?: string | null;
    subtitle: string;
    primaryCtaLabel?: string | null;
    primaryCtaHref?: string | null;
    secondaryCtaLabel?: string | null;
    secondaryCtaHref?: string | null;
  };
  featureSections: Array<{
    eyebrow: string;
    title: string;
    titleAccent?: string | null;
    description: string;
    features: string[];
    layout: string;
    accentColor: string;
  }>;
  bentoFeatures: Array<{
    iconName: string;
    title: string;
    description: string;
    iconBg: string;
    iconColor: string;
  }>;
  projectOverview: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    description: string;
    checkItems: Array<{ bold: string; detail: string }>;
    linkLabel: string;
    linkHref: string;
  };
  appSection: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    description: string;
    appStoreUrl: string;
    googlePlayUrl: string;
  };
  ctaSection: {
    title: string;
    subtitle: string;
    primaryCtaLabel?: string | null;
    primaryCtaHref?: string | null;
    secondaryCtaLabel?: string | null;
    secondaryCtaHref?: string | null;
    note?: string | null;
    variant: string;
  };
  updatedAt: string;
}

export async function getHomePageData(): Promise<HomePageResponse> {
  const res = await fetch(`${BASE_URL}/api/home-page`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch home page data: ${res.statusText}`);
  }

  const json = await res.json();
  if (!json.success || !json.data) {
    throw new Error("Invalid API response");
  }

  return json.data as HomePageResponse;
}
```

- [ ] **Step 2: Update app/(public)/page.tsx**

Replace the existing component with one that fetches from API. The key change: the component becomes `async` and calls `getHomePageData()`. Section props are extracted from the API response.

```tsx
import HeroSection from "../sections/HeroSection";
import CTASection from "../sections/CTASection";
import { FeatureSection } from "../components/FeatureSection";
import { DashboardMockup } from "../components/DashboardMockup";
import { StagesMockup } from "../components/StagesMockup";
import { MaintenanceMockup } from "../components/MaintenanceMockup";
import { BookingsMockup } from "../components/BookingsMockup";
import { TemplatesMockup } from "../components/TemplatesMockup";
import { FeaturesGrid } from "../sections/FeaturesGrid";
import { ProjectOverview } from "../sections/ProjectOverview";
import { AppSection } from "../sections/AppSection";
import { getHomePageData } from "../lib/home-page-data";

const MOCKUPS = [<StagesMockup key="stages" />, <MaintenanceMockup key="maintenance" />, <BookingsMockup key="bookings" />, <TemplatesMockup key="templates" />];

const FEATURE_BG_COLORS = ["bg-white", "bg-[#f7f8fa]", "bg-white", "bg-[#f7f8fa]"];
const FEATURE_BADGE_BG_COLORS = ["#f0f4ff", "#feeeee", "#fff7ed", "#fff7ed"];

export default async function Home() {
  const data = await getHomePageData();
  const { hero, featureSections, projectOverview, ctaSection } = data;

  return (
    <>
      <HeroSection
        badge={hero.badge ?? undefined}
        title={hero.title}
        titleAccent={hero.titleAccent ?? undefined}
        subtitle={hero.subtitle}
        primaryCta={hero.primaryCtaLabel ? { label: hero.primaryCtaLabel, href: hero.primaryCtaHref || "#" } : undefined}
        secondaryCta={hero.secondaryCtaLabel ? { label: hero.secondaryCtaLabel, href: hero.secondaryCtaHref || "#" } : undefined}
      >
        <DashboardMockup />
      </HeroSection>

      <div id="features">
        {featureSections.map((section, idx) => (
          <FeatureSection
            key={idx}
            eyebrow={section.eyebrow}
            title={section.title}
            titleAccent={section.titleAccent ?? ""}
            description={section.description}
            features={section.features.map((text: string) => ({
              iconColor: section.accentColor,
              text,
            }))}
            mockup={MOCKUPS[idx]}
            layout={section.layout as "text-left" | "text-right"}
            bgColor={FEATURE_BG_COLORS[idx]}
            accentColor={section.accentColor}
            badgeBgColor={FEATURE_BADGE_BG_COLORS[idx]}
          />
        ))}
      </div>

      <FeaturesGrid />

      <ProjectOverview
        eyebrow={projectOverview.eyebrow}
        title={projectOverview.title}
        titleAccent={projectOverview.titleAccent}
        description={projectOverview.description}
        checkItems={projectOverview.checkItems}
        linkLabel={projectOverview.linkLabel}
        linkHref={projectOverview.linkHref}
      />

      <AppSection />

      <CTASection
        variant={ctaSection.variant as "dark" | "light"}
        title={ctaSection.title}
        subtitle={ctaSection.subtitle}
        primaryCta={ctaSection.primaryCtaLabel ? { label: ctaSection.primaryCtaLabel, href: ctaSection.primaryCtaHref || "#" } : undefined}
        secondaryCta={ctaSection.secondaryCtaLabel ? { label: ctaSection.secondaryCtaLabel, href: ctaSection.secondaryCtaHref || "#" } : undefined}
        note={ctaSection.note ?? undefined}
      />
    </>
  );
}
```

- [ ] **Step 3: Update ProjectOverview to accept props**

Read `app/sections/ProjectOverview.tsx` — it currently has hardcoded `checkItems` and hardcoded strings. Update it to accept props:

Add interface and replace the hardcoded checks. The component signature changes from:

```tsx
export function ProjectOverview() {
```

To:

```tsx
interface ProjectOverviewProps {
  eyebrow?: string;
  title?: string;
  titleAccent?: string;
  description?: string;
  checkItems?: Array<{ bold: string; detail: string }>;
  linkLabel?: string;
  linkHref?: string;
}

export function ProjectOverview({
  eyebrow = "لوحة التحكم",
  title = "كل مشاريعك",
  titleAccent = "في نظرة واحدة",
  description = "لوحة تحكم احترافية تعطيك صورة كاملة عن جميع مشاريعك، وحداتك، وعملاءك — محدّثة لحظياً.",
  checkItems = [
    { bold: "إدارة مشاريع متعددة", detail: " — فيلات، شقق، تجاري من لوحة واحدة" },
    { bold: "تتبع نسبة الإنجاز", detail: " لكل مشروع ولكل مرحلة بدقة" },
    { bold: "توثيق بالصور والفيديو", detail: " — يراها العميل فور رفعها" },
    { bold: "سحابي 100%", detail: " — من أي جهاز وأي مكان بدون تثبيت" },
  ],
  linkLabel = "ادخل لوحة التحكم",
  linkHref = "https://platform.aysar.sa/",
}: ProjectOverviewProps) {
```

Then replace every hardcoded string in the JSX with the corresponding prop.

Full updated file:

```tsx
"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";

interface ProjectCardData {
  initial: string;
  name: string;
  units: string;
  location: string;
  delivery: string;
  progress: number;
  progressColor: string;
  initialBg: string;
  clients: string;
  remaining: string;
}

interface ProjectOverviewProps {
  eyebrow?: string;
  title?: string;
  titleAccent?: string;
  description?: string;
  checkItems?: Array<{ bold: string; detail: string }>;
  linkLabel?: string;
  linkHref?: string;
}

const projects: ProjectCardData[] = [
  {
    initial: "و",
    name: "واحة الأمير",
    units: "88 وحدة",
    location: "الدمام",
    delivery: "تسليم مايو 2025",
    progress: 92,
    progressColor: "#1a9a5a",
    initialBg: "#1a9a5a",
    clients: "14 عميل نشط",
    remaining: "6 وحدات متبقية",
  },
  {
    initial: "ن",
    name: "نخيل الشرق",
    units: "56 وحدة",
    location: "جدة",
    delivery: "تسليم يونيو 2026",
    progress: 45,
    progressColor: "#f59e0b",
    initialBg: "#2d2e83",
    clients: "18 عميل نشط",
    remaining: "24 وحدة متبقية",
  },
  {
    initial: "ب",
    name: "برج الخزامى",
    units: "124 وحدة",
    location: "الرياض",
    delivery: "تسليم مارس 2026",
    progress: 78,
    progressColor: "#2d2e83",
    initialBg: "#0c2954",
    clients: "31 عميل نشط",
    remaining: "12 وحدة متبقية",
  },
];

function AnimatedProgress({ targetPercentage, color, delay = 0 }: { targetPercentage: number; color: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const timer = setTimeout(() => {
      const start = performance.now();
      const dur = 1200;
      const step = (now: number) => {
        const p = Math.min((now - start) / dur, 1);
        setWidth(targetPercentage * p);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(timer);
  }, [isInView, targetPercentage, delay]);

  return (
    <div ref={ref} className="flex-1 h-[5px] bg-[#e8edf5] rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-none"
        style={{ width: `${width}%`, backgroundColor: color }}
      />
    </div>
  );
}

export function ProjectOverview({
  eyebrow = "لوحة التحكم",
  title = "كل مشاريعك",
  titleAccent = "في نظرة واحدة",
  description = "لوحة تحكم احترافية تعطيك صورة كاملة عن جميع مشاريعك، وحداتك، وعملاءك — محدّثة لحظياً.",
  checkItems = [
    { bold: "إدارة مشاريع متعددة", detail: " — فيلات، شقق، تجاري من لوحة واحدة" },
    { bold: "تتبع نسبة الإنجاز", detail: " لكل مشروع ولكل مرحلة بدقة" },
    { bold: "توثيق بالصور والفيديو", detail: " — يراها العميل فور رفعها" },
    { bold: "سحابي 100%", detail: " — من أي جهاز وأي مكان بدون تثبيت" },
  ],
  linkLabel = "ادخل لوحة التحكم",
  linkHref = "https://platform.aysar.sa/",
}: ProjectOverviewProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="bg-white">
      <div className="section-aysar" ref={ref}>
        <div className="container-aysar grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text */}
          <div className="order-1">
            <motion.div
              className="eyebrow"
              variants={textVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              {eyebrow}
            </motion.div>

            <motion.h2
              className="text-[clamp(28px,4vw,48px)] font-bold text-text leading-[1.15] tracking-tight mb-4"
              variants={textVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              transition={{ delay: 0.1 }}
            >
              {title}
              <br />
              <span className="text-indigo">{titleAccent}</span>
            </motion.h2>

            <motion.p
              className="text-[17px] text-muted leading-[1.75] max-w-[560px] mb-7"
              variants={textVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              transition={{ delay: 0.2 }}
            >
              {description}
            </motion.p>

            <motion.div
              className="flex flex-col gap-[13px] mb-8"
              variants={textVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              transition={{ delay: 0.3 }}
            >
              {checkItems.map((item, idx) => (
                <motion.div
                  key={idx}
                  className="flex items-start gap-2.5"
                  variants={textVariants}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  transition={{ delay: 0.35 + idx * 0.08 }}
                >
                  <div className="w-5 h-5 rounded-full bg-green-light flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#0c2954"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <span className="text-[15px] text-text-secondary leading-[1.6]">
                    <strong className="text-text">{item.bold}</strong>
                    {item.detail}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              variants={textVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              transition={{ delay: 0.7 }}
            >
              <Link
                href={linkHref}
                target="_blank"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-navy border-b-2 border-navy pb-1 hover:text-indigo hover:border-indigo transition-colors duration-150"
              >
                {linkLabel} ←
              </Link>
            </motion.div>
          </div>

          {/* Visual — Project Cards */}
          <div className="order-2">
            <motion.div
              className="bg-[#f4f6fb] border border-border rounded-[20px] p-5"
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {/* Mini header */}
              <div className="flex items-center justify-between mb-3.5">
                <span className="text-[13px] font-bold text-text">
                  كل المشاريع
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="bg-white border border-[#e0e6ef] rounded-md px-2.5 py-1 text-[10px] text-muted">
                    ترتيب ▾
                  </span>
                  <span className="bg-navy rounded-md px-2.5 py-1 text-[10px] text-white font-semibold">
                    + مشروع جديد
                  </span>
                </div>
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-2.5">
                {projects.map((project, idx) => (
                  <motion.div
                    key={idx}
                    className="bg-white border border-[#e8ecf4] rounded-[14px] p-4 flex items-center gap-3.5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                    transition={{
                      delay: 0.4 + idx * 0.15,
                      duration: 0.5,
                      ease: "easeOut",
                    }}
                    whileHover={{
                      y: -2,
                      boxShadow: "0 8px 24px rgba(12,41,84,0.06)",
                      transition: { duration: 0.25 },
                    }}
                  >
                    {/* Initial circle */}
                    <div
                      className="w-[38px] h-[38px] rounded-[10px] flex-shrink-0 flex items-center justify-center text-[15px] font-bold text-white"
                      style={{ backgroundColor: project.initialBg }}
                    >
                      {project.initial}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[13px] font-bold text-text truncate">
                          {project.name}
                        </span>
                        <span
                          className="text-[13px] font-bold"
                          style={{ color: project.progressColor }}
                        >
                          {project.progress}%
                        </span>
                      </div>
                      <div className="text-[11px] text-muted mb-2">
                        {project.units} · {project.location} ·{" "}
                        {project.delivery}
                      </div>

                      <AnimatedProgress
                        targetPercentage={project.progress}
                        color={project.progressColor}
                        delay={200 + idx * 150}
                      />

                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[10px] text-muted">
                          {project.clients}
                        </span>
                        <span className="text-[10px] text-muted">
                          {project.remaining}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Verify home page renders from DB**

```bash
pnpm dev
# Visit http://localhost:3000
```

Expected: Home page renders with content from DB (should look identical to before since seed matches placeholder data).

- [ ] **Step 5: Commit**

```bash
git add app/(public)/page.tsx app/sections/ProjectOverview.tsx app/lib/home-page-data.ts
git commit -m "feat: update home page to fetch content from API/DB"
```

---

### Task 10: Create Dashboard Login Page

**Files:**
- Create: `app/(dashboard)/dashboard/login/page.tsx`

- [ ] **Step 1: Create app/(dashboard)/dashboard/login/page.tsx**

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/app/components/ui/Input";
import { DashboardButton } from "@/app/components/dashboard/DashboardButton";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();

      if (!json.success) {
        setError(json.error || "حدث خطأ");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("تعذر الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-[400px] bg-white rounded-xl border border-[#e8edf5] p-8">
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-[#0c2954] mb-1">تسجيل الدخول</h1>
          <p className="text-sm text-[#6b7a94]">أدخل بياناتك للوصول إلى لوحة التحكم</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="البريد الإلكتروني"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="كلمة المرور"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 text-sm text-red-700">
              {error}
            </div>
          )}

          <DashboardButton type="submit" disabled={loading} className="w-full">
            {loading ? "جاري الدخول..." : "دخول"}
          </DashboardButton>
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify login flow**

```bash
pnpm dev
# Visit http://localhost:3000/dashboard/login
# Login with admin@aysar.sa / admin123
```

Expected: Redirects to /dashboard after successful login.

- [ ] **Step 3: Commit**

```bash
git add app/\(dashboard\)/dashboard/login/page.tsx
git commit -m "feat: add admin login page"
```

---

### Task 11: Update Dashboard Home-Page Editor to Load from and Save to API

**Files:**
- Modify: `app/(dashboard)/dashboard/home-page/page.tsx`

- [ ] **Step 1: Rewrite app/(dashboard)/dashboard/home-page/page.tsx**

Replace the entire file. Key changes:
- Load data from `GET /api/home-page` on mount (fetch + useEffect)
- Add loading spinner state while fetching
- Each section's save button now calls `PATCH /api/home-page` with only that section's data
- Remove `placeholders` import (used only as defaults now, fallback if API fails)

```tsx
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Input, Textarea } from "@/app/components/ui/Input";
import { DashboardButton } from "@/app/components/dashboard/DashboardButton";
import { Badge } from "@/components/ui/badge";
import { ContentCard } from "@/app/components/dashboard/ContentCard";
import { SaveBar } from "@/app/components/dashboard/SaveBar";
import { DynamicList } from "@/app/components/dashboard/DynamicList";
import {
  HOME_HERO,
  FEATURE_SECTIONS,
  BENTO_FEATURES,
  PROJECT_OVERVIEW,
  APP_SECTION,
  CTA_SECTION,
} from "@/app/lib/dashboard/placeholders";
import { ScrollText, ChevronUp, Loader2 } from "lucide-react";

const sections = [
  { id: "banner", label: "البانر الرئيسي" },
  { id: "features", label: "المميزات الرئيسية" },
  { id: "bento", label: "شبكة المميزات" },
  { id: "overview", label: "نظرة على المشروع" },
  { id: "app", label: "قسم التطبيق" },
  { id: "cta", label: "دعوة للعمل" },
];

interface HomePageData {
  hero: typeof HOME_HERO;
  featureSections: typeof FEATURE_SECTIONS;
  bentoFeatures: typeof BENTO_FEATURES;
  projectOverview: typeof PROJECT_OVERVIEW;
  appSection: typeof APP_SECTION;
  ctaSection: typeof CTA_SECTION;
}

const DEFAULTS: HomePageData = {
  hero: HOME_HERO,
  featureSections: FEATURE_SECTIONS,
  bentoFeatures: BENTO_FEATURES,
  projectOverview: PROJECT_OVERVIEW,
  appSection: APP_SECTION,
  ctaSection: CTA_SECTION,
};

async function saveSection(section: string, data: unknown): Promise<boolean> {
  try {
    const res = await fetch("/api/home-page", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ [section]: data }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export default function HomePageEditor() {
  const [data, setData] = useState<HomePageData>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [lastSaved, setLastSaved] = useState<string>();
  const [activeSection, setActiveSection] = useState("banner");
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/home-page");
        const json = await res.json();
        if (json.success && json.data) {
          const d = json.data;
          setData({
            hero: d.hero || DEFAULTS.hero,
            featureSections: d.featureSections || DEFAULTS.featureSections,
            bentoFeatures: d.bentoFeatures || DEFAULTS.bentoFeatures,
            projectOverview: d.projectOverview || DEFAULTS.projectOverview,
            appSection: d.appSection || DEFAULTS.appSection,
            ctaSection: d.ctaSection || DEFAULTS.ctaSection,
          });
        }
      } catch {
        setFetchError("تعذر تحميل البيانات، تم استخدام القيم الافتراضية");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!pageRef.current) return;
      const els = sections.map((s) => document.getElementById(s.id));
      const scrollY = pageRef.current.scrollTop + 100;
      for (let i = els.length - 1; i >= 0; i--) {
        const el = els[i];
        if (el && el.offsetTop <= scrollY) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };
    const el = pageRef.current;
    el?.addEventListener("scroll", handleScroll);
    return () => el?.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el && pageRef.current) {
      pageRef.current.scrollTo({ top: el.offsetTop - 16, behavior: "smooth" });
    }
  };

  const handleSectionSave = useCallback(async (sectionKey: string, sectionData: unknown) => {
    const ok = await saveSection(sectionKey, sectionData);
    if (ok) {
      setLastSaved(new Date().toLocaleTimeString("ar-SA"));
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#2d2e83] mx-auto mb-3" />
          <p className="text-sm text-[#6b7a94]">جارٍ تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-120px)]">
      <div ref={pageRef} className="flex-1 overflow-y-auto pr-2 -mr-2">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-[#0c2954] mb-1">الصفحة الرئيسية</h1>
          <p className="text-sm text-[#6b7a94]">تعديل محتوى الصفحة الرئيسية — البانر، المميزات، شبكة المميزات، وغيرها</p>
          {fetchError && <p className="text-xs text-amber-600 mt-1">{fetchError}</p>}
        </div>
        <div className="space-y-6 pb-24">
          <BannerSection data={data.hero} onSave={(d) => handleSectionSave("hero", d)} />
          <FeaturesSection data={data.featureSections} onSave={(d) => handleSectionSave("featureSections", d)} />
          <BentoSection data={data.bentoFeatures} onSave={(d) => handleSectionSave("bentoFeatures", d)} />
          <OverviewSection data={data.projectOverview} onSave={(d) => handleSectionSave("projectOverview", d)} />
          <AppSectionEditor data={data.appSection} onSave={(d) => handleSectionSave("appSection", d)} />
          <CTASectionEditor data={data.ctaSection} onSave={(d) => handleSectionSave("ctaSection", d)} />
        </div>
        {lastSaved && <SaveBar isDirty={true} isSubmitting={false} onReset={() => {}} lastSaved={lastSaved} />}
      </div>
      <div className="hidden xl:block w-[200px] shrink-0">
        <div className="sticky top-0">
          <div className="bg-white rounded-xl border border-[#e8edf5] p-4">
            <p className="text-xs font-bold text-[#0c2954] mb-3 flex items-center gap-1.5">
              <ScrollText className="w-3.5 h-3.5" /> الأقسام
            </p>
            <nav className="space-y-1">
              {sections.map((s) => (
                <button key={s.id} onClick={() => scrollTo(s.id)}
                  className={`w-full text-right text-xs py-1.5 px-2 rounded-md transition-colors ${activeSection === s.id ? "bg-[#0c2954]/5 text-[#0c2954] font-medium" : "text-[#6b7a94] hover:text-[#0c2954] hover:bg-[#f5f6f9]"}`}
                >{s.label}</button>
              ))}
            </nav>
            <button onClick={() => pageRef.current?.scrollTo({ top: 0, behavior: "smooth" })}
              className="mt-3 w-full flex items-center justify-center gap-1 text-[10px] text-[#6b7a94] hover:text-[#0c2954] py-1.5 rounded-md hover:bg-[#f5f6f9] transition-colors"
            ><ChevronUp className="w-3 h-3" /> العودة للأعلى</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BannerSection({ data: initial, onSave }: { data: typeof HOME_HERO; onSave: (d: typeof HOME_HERO) => void }) {
  const [data, setData] = useState(initial);
  return (
    <section id="banner">
      <ContentCard title="البانر الرئيسي" subtitle="عنوان الصفحة الرئيسية والوصف والأزرار">
        <div className="form-grid-2">
          <Input label="الشارة (Badge)" value={data.badge || ""} onChange={(e) => setData({ ...data, badge: e.target.value })} />
          <Input label="العنوان الرئيسي" value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />
          <Input label="عنوان مميز" value={data.titleAccent || ""} onChange={(e) => setData({ ...data, titleAccent: e.target.value })} />
          <Textarea label="الوصف" value={data.subtitle} onChange={(e) => setData({ ...data, subtitle: e.target.value })} rows={3} />
          <Input label="زر رئيسي — النص" value={data.primaryCtaLabel || ""} onChange={(e) => setData({ ...data, primaryCtaLabel: e.target.value })} />
          <Input label="زر رئيسي — الرابط" value={data.primaryCtaHref || ""} onChange={(e) => setData({ ...data, primaryCtaHref: e.target.value })} />
          <Input label="زر ثانوي — النص" value={data.secondaryCtaLabel || ""} onChange={(e) => setData({ ...data, secondaryCtaLabel: e.target.value })} />
          <Input label="زر ثانوي — الرابط" value={data.secondaryCtaHref || ""} onChange={(e) => setData({ ...data, secondaryCtaHref: e.target.value })} />
        </div>
        <div className="mt-5 flex justify-end">
          <DashboardButton onClick={() => onSave(data)}>حفظ التغييرات</DashboardButton>
        </div>
      </ContentCard>
    </section>
  );
}

function FeaturesSection({ data: initial, onSave }: { data: typeof FEATURE_SECTIONS; onSave: (d: typeof FEATURE_SECTIONS) => void }) {
  const [sectionsData, setSectionsData] = useState(initial);
  return (
    <section id="features">
      <ContentCard title="المميزات الرئيسية" subtitle="4 أقسام مميزات رئيسية للمنصة">
        <div className="space-y-6">
          {sectionsData.map((sec, idx) => (
            <div key={idx} className="rounded-lg border border-[#e8edf5] p-4 bg-[#fafbfc]">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className="text-[10px]">{sec.eyebrow.split(" — ")[0]}</Badge>
                <span className="text-sm font-bold text-[#0c2954]">{sec.title}</span>
              </div>
              <div className="form-grid-2">
                <Input label="العنوان الفرعي" value={sec.eyebrow} onChange={(e) => { const n = [...sectionsData]; n[idx] = { ...n[idx], eyebrow: e.target.value }; setSectionsData(n); }} />
                <Input label="العنوان" value={sec.title} onChange={(e) => { const n = [...sectionsData]; n[idx] = { ...n[idx], title: e.target.value }; setSectionsData(n); }} />
                <Input label="عنوان مميز" value={sec.titleAccent || ""} onChange={(e) => { const n = [...sectionsData]; n[idx] = { ...n[idx], titleAccent: e.target.value }; setSectionsData(n); }} />
                <div className="form-group-contact">
                  <label>لون التمييز</label>
                  <div className="flex items-center gap-2">
                    <input className="form-control-contact" value={sec.accentColor} onChange={(e) => { const n = [...sectionsData]; n[idx] = { ...n[idx], accentColor: e.target.value }; setSectionsData(n); }} />
                    <div className="w-6 h-6 rounded border border-[#e8edf5] shrink-0" style={{ backgroundColor: sec.accentColor }} />
                  </div>
                </div>
                <Textarea label="الوصف" value={sec.description} onChange={(e) => { const n = [...sectionsData]; n[idx] = { ...n[idx], description: e.target.value }; setSectionsData(n); }} rows={2} />
              </div>
              <div className="mt-3">
                <DynamicList
                  label="نقاط المميزات"
                  items={sec.features}
                  onChange={(items) => { const n = [...sectionsData]; n[idx] = { ...n[idx], features: items }; setSectionsData(n); }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 flex justify-end">
          <DashboardButton onClick={() => onSave(sectionsData)}>حفظ التغييرات</DashboardButton>
        </div>
      </ContentCard>
    </section>
  );
}

function BentoSection({ data: initial, onSave }: { data: typeof BENTO_FEATURES; onSave: (d: typeof BENTO_FEATURES) => void }) {
  const [features, setFeatures] = useState(initial);
  return (
    <section id="bento">
      <ContentCard title="شبكة المميزات (Bento)" subtitle="8 بطاقات مميزة في الشبكة">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feat, idx) => (
            <div key={idx} className="rounded-lg border border-[#e8edf5] p-4 bg-[#fafbfc]">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: feat.iconColor }}>
                  {feat.iconName[0]}
                </div>
                <span className="text-sm font-bold text-[#0c2954]">{feat.title}</span>
              </div>
              <div className="form-grid-2">
                <Input label="الأيقونة" value={feat.iconName} onChange={(e) => { const n = [...features]; n[idx] = { ...n[idx], iconName: e.target.value }; setFeatures(n); }} />
                <Input label="العنوان" value={feat.title} onChange={(e) => { const n = [...features]; n[idx] = { ...n[idx], title: e.target.value }; setFeatures(n); }} />
                <Input label="الوصف" value={feat.description} onChange={(e) => { const n = [...features]; n[idx] = { ...n[idx], description: e.target.value }; setFeatures(n); }} />
                <div className="form-group-contact">
                  <label>لون الخلفية</label>
                  <div className="flex items-center gap-2">
                    <input className="form-control-contact" value={feat.iconBg} onChange={(e) => { const n = [...features]; n[idx] = { ...n[idx], iconBg: e.target.value }; setFeatures(n); }} />
                    <div className="w-6 h-6 rounded border border-[#e8edf5] shrink-0" style={{ backgroundColor: feat.iconBg }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 flex justify-end">
          <DashboardButton onClick={() => onSave(features)}>حفظ التغييرات</DashboardButton>
        </div>
      </ContentCard>
    </section>
  );
}

function OverviewSection({ data: initial, onSave }: { data: typeof PROJECT_OVERVIEW; onSave: (d: typeof PROJECT_OVERVIEW) => void }) {
  const [data, setData] = useState(initial);
  return (
    <section id="overview">
      <ContentCard title="نظرة على المشروع" subtitle="قسم النظرة العامة مع إحصائيات المشاريع">
        <div className="form-grid-2">
          <Input label="العنوان الفرعي" value={data.eyebrow} onChange={(e) => setData({ ...data, eyebrow: e.target.value })} />
          <Input label="العنوان" value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />
          <Input label="عنوان مميز" value={data.titleAccent} onChange={(e) => setData({ ...data, titleAccent: e.target.value })} />
          <Textarea label="الوصف" value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })} rows={3} />
          <Input label="نص الرابط" value={data.linkLabel} onChange={(e) => setData({ ...data, linkLabel: e.target.value })} />
          <Input label="الرابط" value={data.linkHref} onChange={(e) => setData({ ...data, linkHref: e.target.value })} />
        </div>
        <div className="mt-5">
          <DynamicList
            label="نقاط المميزات"
            items={data.checkItems.map((i) => `${i.bold} — ${i.detail}`)}
            onChange={(items) => {
              const parsed = items.map((item) => { const parts = item.split(" — "); return { bold: parts[0] || "", detail: parts[1] || "" }; });
              setData({ ...data, checkItems: parsed });
            }}
          />
        </div>
        <div className="mt-5 flex justify-end">
          <DashboardButton onClick={() => onSave(data)}>حفظ التغييرات</DashboardButton>
        </div>
      </ContentCard>
    </section>
  );
}

function AppSectionEditor({ data: initial, onSave }: { data: typeof APP_SECTION; onSave: (d: typeof APP_SECTION) => void }) {
  const [data, setData] = useState(initial);
  return (
    <section id="app">
      <ContentCard title="قسم التطبيق" subtitle="روابط تحميل تطبيق أيسَر">
        <div className="form-grid-2">
          <Input label="العنوان الفرعي" value={data.eyebrow} onChange={(e) => setData({ ...data, eyebrow: e.target.value })} />
          <Input label="العنوان" value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />
          <Input label="عنوان مميز" value={data.titleAccent} onChange={(e) => setData({ ...data, titleAccent: e.target.value })} />
          <Textarea label="الوصف" value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })} rows={3} />
          <Input label="App Store" value={data.appStoreUrl} onChange={(e) => setData({ ...data, appStoreUrl: e.target.value })} />
          <Input label="Google Play" value={data.googlePlayUrl} onChange={(e) => setData({ ...data, googlePlayUrl: e.target.value })} />
        </div>
        <div className="mt-5 flex justify-end">
          <DashboardButton onClick={() => onSave(data)}>حفظ التغييرات</DashboardButton>
        </div>
      </ContentCard>
    </section>
  );
}

function CTASectionEditor({ data: initial, onSave }: { data: typeof CTA_SECTION; onSave: (d: typeof CTA_SECTION) => void }) {
  const [data, setData] = useState(initial);
  return (
    <section id="cta">
      <ContentCard title="دعوة للعمل (CTA)" subtitle="القسم الأخير في الصفحة الرئيسية">
        <div className="form-grid-2">
          <Input label="العنوان" value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />
          <Textarea label="الوصف" value={data.subtitle} onChange={(e) => setData({ ...data, subtitle: e.target.value })} rows={2} />
          <Input label="زر رئيسي — النص" value={data.primaryCtaLabel} onChange={(e) => setData({ ...data, primaryCtaLabel: e.target.value })} />
          <Input label="زر رئيسي — الرابط" value={data.primaryCtaHref} onChange={(e) => setData({ ...data, primaryCtaHref: e.target.value })} />
          <Input label="زر ثانوي — النص" value={data.secondaryCtaLabel} onChange={(e) => setData({ ...data, secondaryCtaLabel: e.target.value })} />
          <Input label="زر ثانوي — الرابط" value={data.secondaryCtaHref} onChange={(e) => setData({ ...data, secondaryCtaHref: e.target.value })} />
          <Input label="ملاحظة" value={data.note || ""} onChange={(e) => setData({ ...data, note: e.target.value })} />
        </div>
        <div className="mt-5 flex justify-end">
          <DashboardButton onClick={() => onSave(data)}>حفظ التغييرات</DashboardButton>
        </div>
      </ContentCard>
    </section>
  );
}
```

- [ ] **Step 2: Verify dashboard editor saves to API**

```bash
pnpm dev
# Visit http://localhost:3000/dashboard/login, login
# Navigate to http://localhost:3000/dashboard/home-page
# Edit a field, click "حفظ التغييرات"
# Refresh — changes should persist
```

Expected: Data loads from DB, edits save and persist across page reloads.

- [ ] **Step 3: Commit**

```bash
git add app/\(dashboard\)/dashboard/home-page/page.tsx
git commit -m "feat: update dashboard home-page editor to use API for load/save"
```

---

### Task 12: Add Auth Guard to Dashboard Layout

**Files:**
- Modify: `app/(dashboard)/layout.tsx`

- [ ] **Step 1: Read current dashboard layout**

Read the existing layout to understand its structure. The layout wraps children with `DashboardSidebar` + `DashboardTopbar`. We need to add an auth check.

- [ ] **Step 2: Add client-side auth check wrapper**

Create `app/(dashboard)/components/AuthGuard.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === "/dashboard/login") {
      setAuthorized(true);
      setChecking(false);
      return;
    }

    async function check() {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        const json = await res.json();
        if (json.success) {
          setAuthorized(true);
        } else {
          router.push("/dashboard/login");
        }
      } catch {
        router.push("/dashboard/login");
      } finally {
        setChecking(false);
      }
    }

    check();
  }, [pathname, router]);

  if (checking) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f5f6f9]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#2d2e83] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-[#6b7a94]">جارٍ التحقق...</p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return <>{children}</>;
}
```

- [ ] **Step 3: Update layout.tsx**

Wrap children with AuthGuard:

```tsx
import { AuthGuard } from "./components/AuthGuard";

// ... in the layout component:
return (
  <AuthGuard>
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardTopbar />
        <main className="flex-1 overflow-y-auto bg-[#f5f6f9] p-6">
          {children}
        </main>
      </div>
    </div>
  </AuthGuard>
);
```

Note: This depends on the current layout structure. Read the actual file first and wrap appropriately.

- [ ] **Step 4: Verify auth guard works**

```bash
# Visit /dashboard without logging in → should redirect to /dashboard/login
# Login → should see dashboard
# Clear cookies → should redirect again
```

- [ ] **Step 5: Commit**

```bash
git add app/\(dashboard\)/components/AuthGuard.tsx app/\(dashboard\)/layout.tsx
git commit -m "feat: add auth guard to dashboard layout"
```

---

### Task 13: Final Verification and Cleanup

**Files:**
- Read: `server.ts`, `app/api/index.ts`, `app/lib/db.ts`, `app/lib/shared-types.ts`

- [ ] **Step 1: Full dev test**

```bash
pnpm dev
```

1. Visit `http://localhost:3000` — home page renders from DB (identical to before)
2. Visit `http://localhost:3000/dashboard/login` — login page renders
3. Login with `admin@aysar.sa` / `admin123`
4. Navigate to `http://localhost:3000/dashboard/home-page`
5. Edit hero badge text, click save
6. Refresh home page — see the change
7. Click different sections in dashboard sidebar navigation — all pages should load normally (though only home-page editor is functional)
8. Logout (clear cookies manually or navigate and the next auth check will fail)

- [ ] **Step 2: Run Prisma Studio to verify DB state**

```bash
pnpm prisma studio
```

- [ ] **Step 3: Build check**

```bash
pnpm build
```

Expected: Production build succeeds. May show warnings about new deps but no errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: final verification and cleanup"
```

---

## Self-Review Checklist

- [x] Spec coverage: Each section of the spec maps to tasks — Task 2 (schema), Task 4-5 (auth), Task 6 (home-page API), Task 7 (server), Task 8 (seed), Task 9 (public page), Task 10 (login), Task 11 (dashboard editor), Task 12 (auth guard)
- [x] No placeholders: All code is complete with actual file paths, actual imports
- [x] Type consistency: `homePageUpdateSchema` matches JSON column names in Prisma schema; `HomePageResponse` type matches API handler output; `JwtPayload` matches JWT sign payload; `AuthenticatedRequest` matches middleware usage
- [x] Existing conventions respected: `@/*` path aliases, pnpm, Arabic RTL, Tailwind v4, dashboard component patterns (ContentCard, SaveBar, etc.)
- [x] No orphan tasks: Every task depends on prior tasks in a logical order
