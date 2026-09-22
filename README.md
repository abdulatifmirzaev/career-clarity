# 🧭 Career Clarity

<div align="center">

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.2-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11.0-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Turborepo](https://img.shields.io/badge/Turborepo-2.11-EF4444?style=for-the-badge&logo=turborepo&logoColor=white)](https://turbo.build/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

<br />

**Production-grade, full-stack monorepo for software engineering career navigation, cross-company leveling benchmarks, AI-era skill roadmaps, and targeted interview preparation.**

[Architecture](#-system-architecture) • [Features](#-core-features) • [Demo Account](#-quick-demo-access) • [Getting Started](#-getting-started) • [Deployment](#-production-deployment) • [CI/CD](#-cicd-pipeline)

</div>

---

## 🌟 Problem Statement

Software engineers navigating the transition from Mid-level to Senior and Staff engineering face three critical ambiguities:

1. **The Leveling Matrix Chaos:** A "Senior" title at a local tech company or startup frequently maps to "L4 / Mid-Level" at Google or Meta. Conversely, a high-bar fintech like Stripe uses a distinct 4-level scale (L1–L4). Engineers lack objective cross-company calibration.
2. **AI-Era Skill Disruption:** Generative AI tools (Claude Code, Cursor, Copilot) are rapidly commoditizing boilerplate CRUD endpoints, basic SQL queries, and repetitive tests. Engineers struggle to identify which core systems invariants remain **human-critical** versus **AI-accelerated**.
3. **Fragmented Interview Preparation:** Developers spend hundreds of hours solving uncalibrated algorithmic puzzles without role-tailored systems design depth, failure-domain considerations, or production trade-off insights.

**Career Clarity** unifies these dimensions into an enterprise-grade platform offering standardized cross-company calibration, interactive dependency roadmaps, role-calibrated interview deep-dives, and automated diagnostic reports.

---

## ⚡ Quick Demo Access

The platform comes pre-seeded with a complete engineer profile, active roadmap progress, diagnostic reports, and solved interview problems:

| Credential        | Value                                                                                                |
| :---------------- | :--------------------------------------------------------------------------------------------------- |
| **Demo Email**    | `alex.chen@careerclarity.dev`                                                                        |
| **Password**      | `demo12345`                                                                                          |
| **Profile State** | Senior Software Engineer (4 YOE, Backend Track, Google L5 / Meta E5 benchmark, 50% roadmap progress) |
| **1-Click Login** | Available directly via the **"1-Click Demo Sign-in"** button on the `/auth/login` page               |

---

## 🏗️ System Architecture

Built as an enterprise monorepo using **Turborepo** and **pnpm workspaces**, ensuring strict boundary isolation between presentation, domain logic, and data layers:

```
career-clarity/
├── apps/
│   ├── web/                     # Next.js 15 App Router (React 19, Tailwind CSS, shadcn/ui primitives)
│   └── api/                     # NestJS 11 Layered Architecture (REST API, Swagger, JWT Auth, Passport)
├── packages/
│   ├── database/                # Prisma ORM schema, PostgreSQL client singleton, migrations & seeds
│   ├── shared-types/            # Shared TypeScript domain contracts, DTOs & API response envelopes
│   └── typescript-config/       # Unified tsconfig presets (strict base, nextjs, nestjs)
├── .github/
│   └── workflows/ci.yml         # GitHub Actions automated CI/CD pipeline (matrix test + build)
├── docker-compose.yml           # Full production container orchestration (Postgres, API, Web)
├── railway.json / render.yaml   # 1-click cloud deployment specifications
└── turbo.json                   # Turborepo task pipeline & caching rules
```

### Architectural Data Flow

```mermaid
flowchart TD
    subgraph Client["Frontend Application (apps/web - Next.js 15)"]
        UI["React 19 Server & Client Components"]
        State["Zustand Auth Store (Hydrated)"]
        Query["TanStack Query v5 (Optimistic Updates)"]
        Graph["React Flow v12 (Interactive Graph Engine)"]
    end

    subgraph API["Backend Service (apps/api - NestJS 11)"]
        Guards["JwtAuthGuard & OptionalJwtGuard"]
        Interceptor["TransformInterceptor (Envelope Standard)"]
        Filter["HttpExceptionFilter (Global Error Handling)"]

        subgraph Modules["Feature Modules"]
            AuthMod["AuthModule (Dual JWT + Refresh Queue)"]
            LevelMod["LevelingModule (Algorithmic Comparator)"]
            RoadmapMod["RoadmapModule (Dependency Tree Graph)"]
            InterviewMod["InterviewModule (Calibrated Question Bank)"]
            AssessMod["AssessmentModule (Diagnostic Scoring Engine)"]
        end

        Swagger["Swagger OpenAPI Engine (/api/docs)"]
    end

    subgraph Core["Shared Workspace Contracts (packages/*)"]
        Types["@career-clarity/shared-types"]
        DBPkg["@career-clarity/database (Prisma Client)"]
    end

    subgraph Storage["Persistence Layer"]
        Postgres[(PostgreSQL 16 Engine)]
    end

    UI --> Query
    UI --> State
    Query -->|REST API + Bearer Token| Guards
    Guards --> Interceptor
    Interceptor --> Modules
    Modules --> DBPkg
    DBPkg --> Postgres
    Modules -.-> Filter
    UI -.-> Types
    Modules -.-> Types
```

---

## 🚀 Core Features

### 1. 📊 Cross-Company Level Comparator (`/leveling`)

- **Algorithmic Calibration**: Normalizes years of experience, current title, system design scope (1–5), and leadership scope (1–5) into standardized industry level orders (L1 to L5+).
- **Big Tech Parity Mapping**: Side-by-side equivalent title mapping across **Google** (L3–L7), **Meta** (E3–E7), **Stripe** (L1–L4), and **Regional Tier-1** tech.
- **Delta Indicator Tags**: Instant visual feedback showing `On Level`, `+1 Stretch Target`, or `-1 Target Gap`.
- **Standard Matrix Grid**: Complete reference table mapping engineering tiers across all supported organizations.

### 2. 🗺️ Interactive AI-Era Skill Roadmap (`/roadmap`)

- **Dual Presentation Engine**:
  - **Interactive Node Graph (Desktop $\ge$ 768px)**: Built with `@xyflow/react` (React Flow v12), featuring custom skill nodes, animated bezier edges, zoom controls, and a MiniMap.
  - **Timeline / Accordion View (Mobile < 768px)**: Grouped hierarchically by Level (Level 1 to 5) with $\ge$ 44x44px touch targets.
- **AI-Era Skill Classification**:
  - 🔥 **Critical (Irreplaceable)**: Distributed consensus (Raft/Paxos), failure domains, execution plans, concurrency invariants.
  - ⚡ **AI Accelerated**: CRUD REST endpoints, unit test fixtures, boilerplate CSS slicing.
  - ⚠️ **Declining Focus**: Handwritten state boilerplate, manual memory wrappers.
- **Optimistic UI Updates**: Instant node status cycling (`not_started` $\rightarrow$ `in_progress` $\rightarrow$ `mastered`) with automatic server rollback on failure.
- **Discipline Tracks**: Support for `Backend`, `Frontend`, `Fullstack`, and `AI Systems Engineer`.

### 3. 🎯 Targeted Interview Question Bank (`/interview-prep`)

- **Role & Level Calibrated**: Filterable by category (System Design, Backend, Security, Distributed Systems), level order (L1–L5), and keywords.
- **Interactive Problem Cards**:
  - Direct solved status checkbox syncing with the backend.
  - Expandable **Interview Hint Accordion** for guided thinking without giving away solutions.
  - Expandable **Architectural Deep-Dive Accordion** analyzing trade-offs, invariant guarantees, and failure modes.
  - **Personal Architectural Notes** textarea saved per attempt.
- **Live Progress Tracking**: Solved question counter and dynamic completion progress indicator.

### 4. 🧭 Executive Career Dashboard (`/dashboard`)

- **Executive Diagnostic Summary**: Evaluates profile readiness against the 2026 AI-driven engineering landscape.
- **High-Leverage Next Steps**: Sequential action items prioritized by career return-on-investment.
- **AI Skill Relevance Matrix**: 3-column breakdown of critical systems depth versus commoditized tasks.
- **Live KPI Metrics**: Assessed level badge, mastered skills counter, solved questions counter, and target tech tier alignment.

### 5. ⚡ Diagnostic Self-Assessment (`/assessment`)

- **Domain Diagnostic Quiz**: Tailored conceptual questions per engineering discipline.
- **Real-Time Scoring Engine**: Submits answers to calculate level order, generate custom skill analyses, and synthesize the official **Career Clarity Report**.
- **Report & Retake Toggle**: Seamless transition between active quiz and rendered report with historical tracking.

---

## 🛠️ Tech Stack & Engineering Standards

| Area                      | Technology                                                                                 | Architectural Rationale                                                                      |
| :------------------------ | :----------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------- |
| **Monorepo Engine**       | [Turborepo 2](https://turbo.build/) + [pnpm 10](https://pnpm.io/)                          | Remote build caching, strict package boundaries, rapid workspace linking.                    |
| **Frontend Framework**    | [Next.js 15](https://nextjs.org/) (App Router) + [React 19](https://react.dev/)            | React Server Components, streaming SSR, optimized route prefetching.                         |
| **Styling & Design**      | [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)             | Mobile-first 8px grid design system, dark/light theme switching (`next-themes`).             |
| **State & Data Fetching** | [TanStack Query v5](https://tanstack.com/query) + [Zustand](https://zustand-demo.pmnd.rs/) | Declarative server-state caching, optimistic mutations, client hydration.                    |
| **Interactive Graph**     | [React Flow v12](https://reactflow.dev/) (`@xyflow/react`)                                 | Custom SVG nodes, animated dependency edges, canvas viewport controls.                       |
| **Backend Framework**     | [NestJS 11](https://nestjs.com/) (Express platform)                                        | Enterprise modular architecture (Controller $\rightarrow$ Service $\rightarrow$ Repository). |
| **Database & ORM**        | [PostgreSQL 16](https://www.postgresql.org/) + [Prisma ORM 6](https://www.prisma.io/)      | Strongly-typed migrations, relational schema modeling, connection pooling.                   |
| **Authentication**        | Passport JWT + Bcrypt                                                                      | Dual JWT architecture (15m access + 7d refresh token rotation queue).                        |
| **API Docs & Validation** | Swagger OpenAPI + `class-validator`                                                        | Automatic interactive OpenAPI documentation at `/api/docs`.                                  |
| **Code Quality**          | ESLint 9 + Prettier + Husky 9 + lint-staged                                                | TypeScript Strict Mode (`no-explicit-any`), automated pre-commit hooks.                      |
| **Testing**               | Jest + Supertest + `@nestjs/testing`                                                       | 21 automated unit & end-to-end critical journey test cases.                                  |

---

## 🚦 Verification Results & Quality Metrics

All test suites and strict compiler checks pass across the entire monorepo:

| Verification Stage    | Tooling                            | Result                                                        |
| :-------------------- | :--------------------------------- | :------------------------------------------------------------ |
| **Type Safety**       | TypeScript 5.8 (`tsc --noEmit`)    | ✅ **0 Errors** across all 5 workspace packages               |
| **Lint & Formatting** | ESLint 9 Flat Config + Prettier    | ✅ **0 Errors / 0 Warnings**                                  |
| **Automated Tests**   | Jest (Unit + E2E Critical Journey) | ✅ **21/21 Tests Passed** (4 test suites)                     |
| **Production Build**  | `next build` & `nest build`        | ✅ **12 Next.js static routes compiled + NestJS clean build** |
| **Pre-commit Guards** | Husky 9 + lint-staged              | ✅ **Auto-formats and lints on git commit**                   |
| **CI/CD Pipeline**    | GitHub Actions Workflow (`ci.yml`) | ✅ **PostgreSQL container matrix build & validation**         |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v20.x` or `v22.x` LTS
- **pnpm**: `v9.x` or `v10.x` (`npm install -g pnpm`)
- **PostgreSQL**: Local instance or hosted connection string (Supabase, Neon, Railway)

### 1. Clone & Install

```bash
git clone https://github.com/abdulatifmirzaev/career-clarity.git
cd career-clarity
pnpm install
```

### 2. Configure Environment Variables

Create `.env` in the root directory (or use default development values):

```env
# Database
DATABASE_URL="postgresql://postgres:postgrespassword@localhost:5432/career_clarity_dev?schema=public"

# Backend Auth Secrets
JWT_ACCESS_SECRET="career_clarity_access_token_secret_key_2026_min32chars"
JWT_REFRESH_SECRET="career_clarity_refresh_token_secret_key_2026_min32chars"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Frontend API URL
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
```

### 3. Database Migration & Seeding

```bash
# Run migrations to set up PostgreSQL schema
pnpm --filter @career-clarity/database db:migrate

# Seed benchmark companies, 21 skills, 30 questions & demo user
pnpm --filter @career-clarity/database db:seed
```

### 4. Run Development Servers

```bash
pnpm dev
```

- **Web Application**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:3001/api](http://localhost:3001/api)
- **Swagger Documentation**: [http://localhost:3001/api/docs](http://localhost:3001/api/docs)

---

## 🐳 Production Deployment

### Option A: Docker Compose (All-in-One)

Launch the entire production stack (PostgreSQL, NestJS API, Next.js Web) with a single command:

```bash
docker compose up --build -d
```

Access the application at `http://localhost:3000`.

### Option B: Cloud Deployment (Vercel + Railway / Render)

1. **Frontend (Vercel)**:
   - Connect repository to [Vercel](https://vercel.com).
   - Root Directory: `apps/web`.
   - Build Command: `pnpm --filter @career-clarity/web build`.
   - Environment Variable: `NEXT_PUBLIC_API_URL=https://your-api.railway.app/api`.
2. **Backend API (Railway / Render)**:
   - Deploy using `apps/api/Dockerfile` or `render.yaml` / `railway.json`.
   - Provision a managed PostgreSQL instance and set `DATABASE_URL`.
   - Run `pnpm --filter @career-clarity/database db:migrate && pnpm --filter @career-clarity/database db:seed`.

---

## 🛡️ License

This project is licensed under the [MIT License](LICENSE).

Developed with architectural precision by [Abdulatif Mirzaev](https://github.com/abdulatifmirzaev).
