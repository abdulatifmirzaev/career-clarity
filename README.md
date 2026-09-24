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

[Live Application](https://career-clarity-one.vercel.app) • [Architecture](#-system-architecture) • [Features](#-core-features) • [Getting Started](#-getting-started) • [Production Deployment](#-production-deployment)

</div>

---

## 🌐 Live Production Links

| Target Service               | URL                                                                                        | Access Mode                                    |
| :--------------------------- | :----------------------------------------------------------------------------------------- | :--------------------------------------------- |
| **Main Public Web Platform** | [https://career-clarity-one.vercel.app](https://career-clarity-one.vercel.app)             | 100% Free Open Access (No Registration Needed) |
| **Admin Superconsole**       | [https://admin.career-clarity-one.vercel.app](https://admin.career-clarity-one.vercel.app) | Secure Owner & Superadmin Authentication       |

---

## 🌟 Key Product Value Proposition

Software engineers navigating the transition from Mid-level to Senior and Staff engineering face three critical ambiguities:

1. **The Leveling Matrix Chaos:** A "Senior" title at a local tech company or startup frequently maps to "L4 / Mid-Level" at Google or Meta. Conversely, a high-bar fintech like Stripe uses a distinct 4-level scale (L1–L4). Engineers lack objective cross-company calibration.
2. **AI-Era Skill Disruption:** Generative AI tools (Claude Code, Cursor, Copilot) are rapidly commoditizing boilerplate CRUD endpoints, basic SQL queries, and repetitive tests. Engineers struggle to identify which core systems invariants remain **human-critical** versus **AI-accelerated**.
3. **Fragmented Interview Preparation:** Developers spend hundreds of hours solving uncalibrated algorithmic puzzles without role-tailored systems design depth, failure-domain considerations, or production trade-off insights.

**Career Clarity** unifies these dimensions into an enterprise-grade platform offering standardized cross-company calibration, interactive dependency roadmaps, role-calibrated interview deep-dives, and automated diagnostic reports.

---

## 🚀 Core Platform Features

### 1. 🌐 Light-Mode High-Converting Landing Page (`/`)

- Clean, bright, ultra-modern Light Mode layout built with white slate surfaces and royal indigo/emerald typography accents.
- 1-Click CTA **"Try Free Diagnostic"** leading directly into the sequential 4-step diagnostic workflow.

### 2. 📋 Sequential Diagnostic Workflow (`/onboarding` & `/assessment`)

- **Step 1 (Track & Stack Survey)**: Choose engineering discipline (Backend, Frontend, Full-Stack, AI/ML) and tech stack.
- **Step 2 (AI & System Quiz)**: 5 high-bar calibration questions evaluating architecture, concurrency, and AI tool autonomy.
- **Step 3 (Level Calibration)**: Instant mapping to Big Tech & Startup tiers (L3 Junior -> L7 Principal).
- **Step 4 (Skill Roadmap & Interview Prep)**: Tailored action plan with 2026 skill classification.

### 3. 📊 Cross-Company Level Comparator (`/leveling`)

- Normalizes experience, current title, system design scope (1–5), and leadership scope (1–5) into standardized industry level orders (L1 to L5+).
- Side-by-side equivalent title mapping across **Google** (L3–L7), **Meta** (E3–E7), **Stripe** (L1–L4), and **Regional Tier-1** tech.

### 4. 🗺️ Interactive AI-Era Skill Roadmap (`/roadmap`)

- Built with `@xyflow/react` (React Flow v12) featuring custom nodes, animated bezier edges, and zoom controls.
- Classifies skills into 🔥 **Critical (Irreplaceable)**, ⚡ **AI-Accelerated**, and ⚠️ **Declining Focus**.

### 5. 🎯 Targeted Interview Question Bank (`/interview-prep`)

- Filterable by category (System Design, Backend, Security, Distributed Systems) and level order (L1–L5).
- Detailed architectural deep-dives analyzing trade-offs, invariant guarantees, and production failure modes.

---

## 🏗️ System Architecture

Built as an enterprise monorepo using **Turborepo** and **pnpm workspaces**:

```
career-clarity/
├── apps/
│   ├── web/                     # Next.js 15 App Router (React 19, Tailwind CSS, shadcn/ui)
│   └── api/                     # NestJS 11 Layered Architecture (REST API, Swagger, Passport)
├── packages/
│   ├── database/                # Prisma ORM schema, PostgreSQL client singleton, migrations & seeds
│   ├── shared-types/            # Shared TypeScript domain contracts & DTOs
│   └── typescript-config/       # Unified tsconfig presets
├── .github/
│   └── workflows/ci.yml         # GitHub Actions automated CI/CD pipeline
├── docker-compose.yml           # Full production container orchestration
└── turbo.json                   # Turborepo task pipeline & caching rules
```

---

## 🛠️ Tech Stack

| Area                   | Technology                                           |
| :--------------------- | :--------------------------------------------------- |
| **Monorepo Engine**    | Turborepo 2 + pnpm workspaces                        |
| **Frontend Framework** | Next.js 15 (App Router) + React 19                   |
| **Styling & UI**       | Tailwind CSS + Light-Mode Slate/Indigo Design System |
| **State & Fetching**   | TanStack Query v5 + Zustand                          |
| **Interactive Graph**  | React Flow v12 (`@xyflow/react`)                     |
| **Backend API**        | NestJS 11 + Passport JWT                             |
| **Database & ORM**     | PostgreSQL 16 + Prisma ORM 6                         |
| **Deployment**         | Vercel Production                                    |

---

## 🚦 Verification & Quality Metrics

- **Type Safety**: TypeScript 5.8 (`tsc --noEmit`) ✅ **0 Errors** across all workspace packages
- **Lint & Formatting**: ESLint 9 + Prettier ✅ **0 Errors / 0 Warnings**
- **Production Build**: `next build` ✅ **37 static/dynamic routes compiled cleanly**

---

## 🛠️ Local Development

```bash
# 1. Clone repo
git clone https://github.com/abdulatifmirzaev/career-clarity.git
cd career-clarity

# 2. Install dependencies
pnpm install

# 3. Start development server
pnpm dev
```

Visit `http://localhost:3000` to launch the application.

---

## 🛡️ License

Developed with architectural precision by [Abdulatif Mirzaev](https://github.com/abdulatifmirzaev). MIT License.
