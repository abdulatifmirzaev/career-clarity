import crypto from 'crypto';
import {
  AssessmentDto,
  AssessmentQuizQuestion,
  CareerClarityReport,
  CompanyDto,
  InterviewQuestionDto,
  LevelComparisonResult,
  RoadmapNodeDto,
  RoleType,
  SkillDto,
  SkillProgressStatus,
  UserProfile,
  UserSkillProgressDto,
} from '@career-clarity/shared-types';

// JWT Configuration
const JWT_ACCESS_SECRET =
  process.env['JWT_ACCESS_SECRET'] || 'career_clarity_prod_jwt_access_secret_2026_min32';
const JWT_REFRESH_SECRET =
  process.env['JWT_REFRESH_SECRET'] || 'career_clarity_prod_jwt_refresh_secret_2026_min32';

export interface JwtPayload {
  sub: string;
  email: string;
  exp?: number;
  iat?: number;
}

// Pure Node.js Web-Safe HMAC-SHA256 JWT
export function signJwt(
  payload: Omit<JwtPayload, 'iat' | 'exp'>,
  secret: string,
  expiresInSec: number,
): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload: JwtPayload = {
    ...payload,
    iat: now,
    exp: now + expiresInSec,
  };

  const encode = (obj: object) => Buffer.from(JSON.stringify(obj)).toString('base64url');
  const encodedHeader = encode(header);
  const encodedPayload = encode(fullPayload);
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export function verifyJwt(token: string, secret: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [headerB64, payloadB64, signature] = parts;

    const expectedSig = crypto
      .createHmac('sha256', secret)
      .update(`${headerB64}.${payloadB64}`)
      .digest('base64url');

    if (signature !== expectedSig) return null;

    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString()) as JwtPayload;
    if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export function generateAuthTokens(userId: string, email: string) {
  const accessToken = signJwt({ sub: userId, email }, JWT_ACCESS_SECRET, 15 * 60); // 15 mins
  const refreshToken = signJwt({ sub: userId, email }, JWT_REFRESH_SECRET, 7 * 24 * 60 * 60); // 7 days
  return { accessToken, refreshToken };
}

export function verifyAccessToken(token: string): JwtPayload | null {
  return verifyJwt(token, JWT_ACCESS_SECRET);
}

export function verifyRefreshToken(token: string): JwtPayload | null {
  return verifyJwt(token, JWT_REFRESH_SECRET);
}

// -------------------------------------------------------------
// Seed Data & In-Memory Store
// -------------------------------------------------------------

export interface InternalUser {
  id: string;
  email: string;
  passwordHash: string; // or plain check for demo
  name: string | null;
  yearsExp: number | null;
  primaryStack: string | null;
  createdAt: string;
}

// Global In-Memory Store for Serverless Resilience
declare global {
  var __careerClarityStore:
    | {
        users: Map<string, InternalUser>;
        skillProgress: Map<string, UserSkillProgressDto>; // key: `${userId}_${skillId}`
        questionAttempts: Map<
          string,
          { userId: string; questionId: string; solved: boolean; notes?: string }
        >;
        assessments: Map<string, AssessmentDto[]>; // key: userId
      }
    | undefined;
}

export const COMPANIES_DATA: CompanyDto[] = [
  {
    id: 'google',
    name: 'Google',
    levels: [
      {
        id: 'google-l3',
        companyId: 'google',
        companyName: 'Google',
        levelName: 'L3',
        levelOrder: 1,
        yearsExpMin: 0,
        yearsExpMax: 2,
        description:
          'Entry-level Software Engineer. Core algorithms, clean code, scoped task execution.',
      },
      {
        id: 'google-l4',
        companyId: 'google',
        companyName: 'Google',
        levelName: 'L4',
        levelOrder: 2,
        yearsExpMin: 2,
        yearsExpMax: 5,
        description:
          'Mid-Level Software Engineer. Self-directed, designs medium components, resolves ambiguity.',
      },
      {
        id: 'google-l5',
        companyId: 'google',
        companyName: 'Google',
        levelName: 'L5',
        levelOrder: 3,
        yearsExpMin: 4,
        yearsExpMax: 8,
        description:
          'Senior Software Engineer. Leads system design, architecture, mentorship, cross-team alignment.',
      },
      {
        id: 'google-l6',
        companyId: 'google',
        companyName: 'Google',
        levelName: 'L6',
        levelOrder: 4,
        yearsExpMin: 7,
        yearsExpMax: 12,
        description:
          'Staff Software Engineer. Multi-team architectural strategy, scalability, organizational impact.',
      },
      {
        id: 'google-l7',
        companyId: 'google',
        companyName: 'Google',
        levelName: 'L7',
        levelOrder: 5,
        yearsExpMin: 10,
        yearsExpMax: 16,
        description:
          'Senior Staff / Principal Engineer. Organization-wide technical bets, platform reliability.',
      },
    ],
  },
  {
    id: 'meta',
    name: 'Meta',
    levels: [
      {
        id: 'meta-e3',
        companyId: 'meta',
        companyName: 'Meta',
        levelName: 'E3',
        levelOrder: 1,
        yearsExpMin: 0,
        yearsExpMax: 2,
        description:
          'Rotational / Entry Software Engineer. Strong coding fundamentals, fast shipping cadence.',
      },
      {
        id: 'meta-e4',
        companyId: 'meta',
        companyName: 'Meta',
        levelName: 'E4',
        levelOrder: 2,
        yearsExpMin: 2,
        yearsExpMax: 5,
        description:
          'Software Engineer. Autonomous execution, unblocks oneself, contributes to component architecture.',
      },
      {
        id: 'meta-e5',
        companyId: 'meta',
        companyName: 'Meta',
        levelName: 'E5',
        levelOrder: 3,
        yearsExpMin: 4,
        yearsExpMax: 8,
        description:
          'Senior Software Engineer. Owns entire product surfaces, balances trade-offs, drives technical standards.',
      },
      {
        id: 'meta-e6',
        companyId: 'meta',
        companyName: 'Meta',
        levelName: 'E6',
        levelOrder: 4,
        yearsExpMin: 7,
        yearsExpMax: 12,
        description:
          'Staff Software Engineer. Pillar-level impact, solves complex distributed scale bottlenecks.',
      },
      {
        id: 'meta-e7',
        companyId: 'meta',
        companyName: 'Meta',
        levelName: 'E7',
        levelOrder: 5,
        yearsExpMin: 10,
        yearsExpMax: 16,
        description:
          'Principal Engineer. Directs company-wide architectural direction and high-stakes infrastructure.',
      },
    ],
  },
  {
    id: 'stripe',
    name: 'Stripe',
    levels: [
      {
        id: 'stripe-l1',
        companyId: 'stripe',
        companyName: 'Stripe',
        levelName: 'L1 (SE I)',
        levelOrder: 1,
        yearsExpMin: 0,
        yearsExpMax: 2,
        description:
          'Software Engineer I. Writes safe, maintainable code with high test coverage and precision.',
      },
      {
        id: 'stripe-l2',
        companyId: 'stripe',
        companyName: 'Stripe',
        levelName: 'L2 (SE II)',
        levelOrder: 2,
        yearsExpMin: 2,
        yearsExpMax: 5,
        description:
          'Software Engineer II. Operational reliability, distributed incident debugging, complex refactoring.',
      },
      {
        id: 'stripe-l3',
        companyId: 'stripe',
        companyName: 'Stripe',
        levelName: 'L3 (Senior SE)',
        levelOrder: 3,
        yearsExpMin: 5,
        yearsExpMax: 9,
        description:
          'Senior Software Engineer. Technical specs, API ergonomics, zero-downtime database migrations.',
      },
      {
        id: 'stripe-l4',
        companyId: 'stripe',
        companyName: 'Stripe',
        levelName: 'L4 (Staff SE)',
        levelOrder: 4,
        yearsExpMin: 8,
        yearsExpMax: 13,
        description:
          'Staff Software Engineer. Multi-region infrastructure, latency optimization, global standards.',
      },
      {
        id: 'stripe-l5',
        companyId: 'stripe',
        companyName: 'Stripe',
        levelName: 'L5 (Principal)',
        levelOrder: 5,
        yearsExpMin: 12,
        yearsExpMax: 18,
        description:
          'Principal Engineer. Stripe-wide architectural vision, long-term protocol standards.',
      },
    ],
  },
  {
    id: 'regional-tier1',
    name: 'Tier-1 Regional Tech',
    levels: [
      {
        id: 'reg-l1',
        companyId: 'regional-tier1',
        companyName: 'Tier-1 Regional Tech',
        levelName: 'Junior Engineer',
        levelOrder: 1,
        yearsExpMin: 0,
        yearsExpMax: 2,
        description:
          'Junior Software Engineer. Feature development, bug fixes, Git workflows and team conventions.',
      },
      {
        id: 'reg-l2',
        companyId: 'regional-tier1',
        companyName: 'Tier-1 Regional Tech',
        levelName: 'Mid-Level Engineer',
        levelOrder: 2,
        yearsExpMin: 2,
        yearsExpMax: 4,
        description:
          'Mid-Level Software Engineer. Independently ships features end-to-end, writes unit/integration tests.',
      },
      {
        id: 'reg-l3',
        companyId: 'regional-tier1',
        companyName: 'Tier-1 Regional Tech',
        levelName: 'Senior Engineer',
        levelOrder: 3,
        yearsExpMin: 4,
        yearsExpMax: 7,
        description:
          'Senior Software Engineer. Leads project delivery, stack architecture, on-call incident triage.',
      },
      {
        id: 'reg-l4',
        companyId: 'regional-tier1',
        companyName: 'Tier-1 Regional Tech',
        levelName: 'Tech Lead / Staff',
        levelOrder: 4,
        yearsExpMin: 6,
        yearsExpMax: 10,
        description:
          'Tech Lead / Staff Engineer. Aligns engineering with business metrics, governs microservices.',
      },
      {
        id: 'reg-l5',
        companyId: 'regional-tier1',
        companyName: 'Tier-1 Regional Tech',
        levelName: 'Principal Architect',
        levelOrder: 5,
        yearsExpMin: 9,
        yearsExpMax: 15,
        description:
          'Principal Architect. Evaluates enterprise-scale software purchases, disaster recovery, cloud costs.',
      },
    ],
  },
];

export const SKILLS_DATA: SkillDto[] = [
  {
    id: 'skill-dist-sys',
    name: 'Distributed Systems & Consensus',
    category: 'System Design',
    aiRelevance: 'critical',
  },
  {
    id: 'skill-db-index',
    name: 'Database Indexing & Query Execution Plans',
    category: 'Backend',
    aiRelevance: 'critical',
  },
  {
    id: 'skill-microservices',
    name: 'Microservices & Fault Tolerance Patterns',
    category: 'System Design',
    aiRelevance: 'critical',
  },
  {
    id: 'skill-observability',
    name: 'Observability, APM & Root Cause Analysis',
    category: 'DevOps',
    aiRelevance: 'critical',
  },
  {
    id: 'skill-architecture',
    name: 'System Architecture & Trade-Off Modeling',
    category: 'System Design',
    aiRelevance: 'critical',
  },
  {
    id: 'skill-security',
    name: 'Security Architecture & Zero Trust',
    category: 'Security',
    aiRelevance: 'critical',
  },
  {
    id: 'skill-web-vitals',
    name: 'Frontend Core Web Vitals & Hydration Internals',
    category: 'Frontend',
    aiRelevance: 'critical',
  },
  {
    id: 'skill-llm-rag',
    name: 'LLM Systems & RAG Architecture',
    category: 'AI / ML',
    aiRelevance: 'critical',
  },
  {
    id: 'skill-api-contract',
    name: 'API Contract Governance & Backward Compatibility',
    category: 'Backend',
    aiRelevance: 'critical',
  },
  {
    id: 'skill-concurrency',
    name: 'Concurrency, Mutexes & Lock Contention',
    category: 'Backend',
    aiRelevance: 'critical',
  },
  {
    id: 'skill-crud',
    name: 'CRUD REST Endpoint Generation',
    category: 'Backend',
    aiRelevance: 'eased_by_ai',
  },
  {
    id: 'skill-tests',
    name: 'Unit & Snapshot Test Boilerplate',
    category: 'Backend',
    aiRelevance: 'eased_by_ai',
  },
  {
    id: 'skill-tailwind',
    name: 'Tailwind CSS Layout & Responsive Slicing',
    category: 'Frontend',
    aiRelevance: 'eased_by_ai',
  },
  {
    id: 'skill-regex',
    name: 'Regular Expressions & Pattern Matching',
    category: 'Backend',
    aiRelevance: 'eased_by_ai',
  },
  {
    id: 'skill-docker',
    name: 'Dockerfile & CI Pipeline YAML Templating',
    category: 'DevOps',
    aiRelevance: 'eased_by_ai',
  },
  {
    id: 'skill-db-migrate',
    name: 'Database Migration Scripts Writing',
    category: 'Backend',
    aiRelevance: 'eased_by_ai',
  },
  {
    id: 'skill-docs',
    name: 'Technical Documentation & Swagger Annotations',
    category: 'Architecture',
    aiRelevance: 'eased_by_ai',
  },
  {
    id: 'skill-redux',
    name: 'Handwritten State Machine Redux Boilerplate',
    category: 'Frontend',
    aiRelevance: 'declining',
  },
  {
    id: 'skill-raw-fetch',
    name: 'Raw XMLHttpRequest / Vanilla Fetch Wrappers',
    category: 'Frontend',
    aiRelevance: 'declining',
  },
  {
    id: 'skill-soap',
    name: 'Manual XML & SOAP Integration',
    category: 'Backend',
    aiRelevance: 'declining',
  },
];

export const ROADMAP_NODES: Record<RoleType, RoadmapNodeDto[]> = {
  backend: [
    {
      id: 'be-node-1',
      skillId: 'skill-api-contract',
      skill: SKILLS_DATA.find((s) => s.id === 'skill-api-contract')!,
      role: 'backend',
      levelOrder: 1,
      parentNodeId: null,
    },
    {
      id: 'be-node-2',
      skillId: 'skill-crud',
      skill: SKILLS_DATA.find((s) => s.id === 'skill-crud')!,
      role: 'backend',
      levelOrder: 1,
      parentNodeId: 'be-node-1',
    },
    {
      id: 'be-node-3',
      skillId: 'skill-db-index',
      skill: SKILLS_DATA.find((s) => s.id === 'skill-db-index')!,
      role: 'backend',
      levelOrder: 2,
      parentNodeId: 'be-node-1',
    },
    {
      id: 'be-node-4',
      skillId: 'skill-concurrency',
      skill: SKILLS_DATA.find((s) => s.id === 'skill-concurrency')!,
      role: 'backend',
      levelOrder: 3,
      parentNodeId: 'be-node-3',
    },
    {
      id: 'be-node-5',
      skillId: 'skill-microservices',
      skill: SKILLS_DATA.find((s) => s.id === 'skill-microservices')!,
      role: 'backend',
      levelOrder: 3,
      parentNodeId: 'be-node-3',
    },
    {
      id: 'be-node-6',
      skillId: 'skill-dist-sys',
      skill: SKILLS_DATA.find((s) => s.id === 'skill-dist-sys')!,
      role: 'backend',
      levelOrder: 4,
      parentNodeId: 'be-node-5',
    },
    {
      id: 'be-node-7',
      skillId: 'skill-architecture',
      skill: SKILLS_DATA.find((s) => s.id === 'skill-architecture')!,
      role: 'backend',
      levelOrder: 5,
      parentNodeId: 'be-node-6',
    },
  ],
  frontend: [
    {
      id: 'fe-node-1',
      skillId: 'skill-tailwind',
      skill: SKILLS_DATA.find((s) => s.id === 'skill-tailwind')!,
      role: 'frontend',
      levelOrder: 1,
      parentNodeId: null,
    },
    {
      id: 'fe-node-2',
      skillId: 'skill-raw-fetch',
      skill: SKILLS_DATA.find((s) => s.id === 'skill-raw-fetch')!,
      role: 'frontend',
      levelOrder: 1,
      parentNodeId: 'fe-node-1',
    },
    {
      id: 'fe-node-3',
      skillId: 'skill-web-vitals',
      skill: SKILLS_DATA.find((s) => s.id === 'skill-web-vitals')!,
      role: 'frontend',
      levelOrder: 2,
      parentNodeId: 'fe-node-1',
    },
    {
      id: 'fe-node-4',
      skillId: 'skill-redux',
      skill: SKILLS_DATA.find((s) => s.id === 'skill-redux')!,
      role: 'frontend',
      levelOrder: 2,
      parentNodeId: 'fe-node-3',
    },
    {
      id: 'fe-node-5',
      skillId: 'skill-security',
      skill: SKILLS_DATA.find((s) => s.id === 'skill-security')!,
      role: 'frontend',
      levelOrder: 3,
      parentNodeId: 'fe-node-3',
    },
    {
      id: 'fe-node-6',
      skillId: 'skill-observability',
      skill: SKILLS_DATA.find((s) => s.id === 'skill-observability')!,
      role: 'frontend',
      levelOrder: 4,
      parentNodeId: 'fe-node-5',
    },
  ],
  fullstack: [
    {
      id: 'fs-node-1',
      skillId: 'skill-tailwind',
      skill: SKILLS_DATA.find((s) => s.id === 'skill-tailwind')!,
      role: 'fullstack',
      levelOrder: 1,
      parentNodeId: null,
    },
    {
      id: 'fs-node-2',
      skillId: 'skill-crud',
      skill: SKILLS_DATA.find((s) => s.id === 'skill-crud')!,
      role: 'fullstack',
      levelOrder: 1,
      parentNodeId: 'fs-node-1',
    },
    {
      id: 'fs-node-3',
      skillId: 'skill-db-index',
      skill: SKILLS_DATA.find((s) => s.id === 'skill-db-index')!,
      role: 'fullstack',
      levelOrder: 2,
      parentNodeId: 'fs-node-2',
    },
    {
      id: 'fs-node-4',
      skillId: 'skill-security',
      skill: SKILLS_DATA.find((s) => s.id === 'skill-security')!,
      role: 'fullstack',
      levelOrder: 3,
      parentNodeId: 'fs-node-3',
    },
    {
      id: 'fs-node-5',
      skillId: 'skill-architecture',
      skill: SKILLS_DATA.find((s) => s.id === 'skill-architecture')!,
      role: 'fullstack',
      levelOrder: 4,
      parentNodeId: 'fs-node-4',
    },
  ],
  ai_engineer: [
    {
      id: 'ai-node-1',
      skillId: 'skill-api-contract',
      skill: SKILLS_DATA.find((s) => s.id === 'skill-api-contract')!,
      role: 'ai_engineer',
      levelOrder: 1,
      parentNodeId: null,
    },
    {
      id: 'ai-node-2',
      skillId: 'skill-db-index',
      skill: SKILLS_DATA.find((s) => s.id === 'skill-db-index')!,
      role: 'ai_engineer',
      levelOrder: 2,
      parentNodeId: 'ai-node-1',
    },
    {
      id: 'ai-node-3',
      skillId: 'skill-llm-rag',
      skill: SKILLS_DATA.find((s) => s.id === 'skill-llm-rag')!,
      role: 'ai_engineer',
      levelOrder: 3,
      parentNodeId: 'ai-node-2',
    },
    {
      id: 'ai-node-4',
      skillId: 'skill-dist-sys',
      skill: SKILLS_DATA.find((s) => s.id === 'skill-dist-sys')!,
      role: 'ai_engineer',
      levelOrder: 4,
      parentNodeId: 'ai-node-3',
    },
    {
      id: 'ai-node-5',
      skillId: 'skill-architecture',
      skill: SKILLS_DATA.find((s) => s.id === 'skill-architecture')!,
      role: 'ai_engineer',
      levelOrder: 5,
      parentNodeId: 'ai-node-4',
    },
  ],
};

export const INTERVIEW_QUESTIONS: (InterviewQuestionDto & { role?: string })[] = [
  {
    id: 'iq-1',
    question:
      'Explain the difference between optimistic and pessimistic locking in relational databases.',
    answer:
      'Pessimistic locking locks the selected record upfront (e.g. SELECT FOR UPDATE), preventing concurrent transactions from modifying it until the current transaction completes. Optimistic locking relies on a version or timestamp column; modifications check if the version changed prior to update and abort/retry if a conflict occurred. Optimistic is superior for read-heavy workflows, while pessimistic is safer in high-contention financial ledger writes.',
    hint: 'Think about version columns vs explicit SELECT FOR UPDATE statements.',
    category: 'Backend',
    role: 'backend',
    levelOrder: 2,
  },
  {
    id: 'iq-2',
    question:
      'What is the N+1 query problem in ORMs (like Prisma, Hibernate), and how do you prevent it?',
    answer:
      'The N+1 problem occurs when an application executes 1 query to fetch a parent collection of size N, and then triggers N separate secondary queries to load related child records for each row. It is resolved via eager loading (JOINs), batch fetching (Prisma DataLoader pattern / WHERE parent_id IN (...)), or selecting only required columns.',
    hint: 'Consider how many database roundtrips occur when iterating over a loop of parent records.',
    category: 'Backend',
    role: 'backend',
    levelOrder: 2,
  },
  {
    id: 'iq-3',
    question:
      'Explain how JWT authentication works, and why storing JWTs in localStorage poses security risks.',
    answer:
      'A JWT is a cryptographically signed, stateless token consisting of Header, Payload, and Signature. Storing sensitive JWTs in browser localStorage makes them vulnerable to Cross-Site Scripting (XSS) attacks because any malicious script injected into the DOM can read localStorage. Using httpOnly, Secure, SameSite cookies protects tokens from client-side JavaScript access.',
    hint: 'Consider XSS vulnerabilities vs CSRF trade-offs with httpOnly cookies.',
    category: 'Security',
    role: 'fullstack',
    levelOrder: 2,
  },
  {
    id: 'iq-4',
    question:
      'What is the difference between React Server Components (RSC) and standard Client Components?',
    answer:
      'React Server Components execute exclusively on the server at build or request time, outputting a serialized JSON representation of the component tree without adding to the client JavaScript bundle. Client Components (marked with "use client") are hydrated in the browser, allowing interactive state (useState), lifecycle hooks (useEffect), and browser event listeners.',
    hint: 'Think about bundle size reduction and where JavaScript execution happens.',
    category: 'Frontend',
    role: 'frontend',
    levelOrder: 2,
  },
  {
    id: 'iq-5',
    question:
      'Design a distributed Rate Limiter capable of handling 100,000 requests per second across 50 nodes.',
    answer:
      'A production rate limiter utilizes Redis clusters running sliding window log or token bucket algorithms. By executing atomic Lua scripts in Redis (EVALSHA), counter increments and TTL expiration happen in a single roundtrip without race conditions. Client requests pass through an API gateway layer with in-memory local caching to absorb bursts.',
    hint: 'Mention Sliding Window Counter algorithm and atomic Redis Lua scripts.',
    category: 'System Design',
    role: 'backend',
    levelOrder: 3,
  },
  {
    id: 'iq-6',
    question:
      'How do you design a database schema migration on a 500-million-row table with zero downtime?',
    answer:
      'Never run destructive DDL directly. Follow the Expand/Contract (Parallel Run) pattern: 1) Add the new column/table as nullable in Phase 1. 2) Update application code to dual-write to both old and new schema. 3) Backfill historical data in chunked background worker batches. 4) Switch application reads to the new schema. 5) Deprecate writes to old schema and drop old columns in Phase 2.',
    hint: 'Explain the Expand and Contract pattern with dual-writing and background backfills.',
    category: 'Backend',
    role: 'backend',
    levelOrder: 3,
  },
  {
    id: 'iq-7',
    question:
      'Explain the Saga Pattern in distributed microservices: Choreography vs Orchestration.',
    answer:
      'The Saga pattern coordinates distributed transactions across multiple independent databases without two-phase commit (2PC). Choreography uses event streams (Kafka/RabbitMQ) where each service listens and publishes events; Orchestration uses a centralized orchestrator service that commands participants sequentially and triggers compensating transactions if any step fails.',
    hint: 'Compare event-driven decentralized choreography with centralized state-machine orchestrators.',
    category: 'System Design',
    role: 'backend',
    levelOrder: 3,
  },
  {
    id: 'iq-8',
    question: 'What are Core Web Vitals (LCP, INP, CLS) and how do you diagnose and improve them?',
    answer:
      'LCP (Largest Contentful Paint < 2.5s) measures render speed of main visual content (optimized via CDN, image preloading, SSR). INP (Interaction to Next Paint < 200ms) measures responsiveness to user actions (optimized by breaking long JavaScript tasks, web workers, requestIdleCallback). CLS (Cumulative Layout Shift < 0.1) measures visual stability (optimized by reserving width/height on images and fonts).',
    hint: 'Define LCP, INP, CLS thresholds and their main browser remediation techniques.',
    category: 'Frontend',
    role: 'frontend',
    levelOrder: 3,
  },
  {
    id: 'iq-9',
    question:
      'Explain the principles of Retrieval-Augmented Generation (RAG) and how vector embeddings are retrieved.',
    answer:
      'RAG enriches LLM queries with private or updated external context: 1) Documents are chunked (semantic/recursive), 2) Converted to dense vectors via embedding models, 3) Stored in vector indices (HNSW, IVFFlat), 4) User query is embedded, performing cosine similarity/dot-product nearest neighbor search, 5) Top-K chunks are reranked (cross-encoders) and passed into LLM prompt with citations.',
    hint: 'Outline chunking, embedding generation, approximate nearest neighbor (ANN) search, and reranking.',
    category: 'AI Engineering',
    role: 'ai_engineer',
    levelOrder: 3,
  },
  {
    id: 'iq-10',
    question: 'How do you prevent Prompt Injection attacks in production LLM applications?',
    answer:
      'Treat user input as untrusted data similar to SQL injection. Mitigations include: 1) Strict boundary delimiters in system prompts (e.g. XML tags like <user_input>), 2) Dual-LLM architecture (classifier guardrail model vetting input before main inference), 3) Output validation and schema enforcement (e.g. structured JSON decoding), 4) Least-privilege API tool execution.',
    hint: 'Mention delimiter encapsulation, input guardrails, and structured output parsing.',
    category: 'AI Engineering',
    role: 'ai_engineer',
    levelOrder: 3,
  },
  {
    id: 'iq-11',
    question:
      'Architect an enterprise Global Event Bus handling 10 billion events per day with strict ordering per entity.',
    answer:
      'Deploy Apache Kafka or AWS Kinesis partitioned by Entity UUID (e.g. account_id or order_id). In Kafka, ordering is guaranteed within a single partition. Downstream consumers consume partitions using consumer groups with commit offsets. Dead-letter queues (DLQ) handle unprocessable poison pills without stalling the partition. Change Data Capture (CDC) via Debezium extracts state changes directly from database write-ahead logs.',
    hint: 'Partitioning keys, consumer offset management, and Outbox Pattern with Debezium CDC.',
    category: 'System Design',
    role: 'backend',
    levelOrder: 4,
  },
  {
    id: 'iq-12',
    question:
      'Explain the Transactional Outbox Pattern and why it is critical for dual-write reliability.',
    answer:
      'When an application needs to update a database and publish an event to a message broker, a dual-write failure can cause data inconsistency (DB commits but Kafka publish fails, or vice-versa). The Outbox Pattern writes the event to an "outbox" table within the exact same atomic database transaction. An asynchronous CDC process (like Debezium) or poller reads the outbox table and guarantees at-least-once delivery to Kafka.',
    hint: 'Atomic DB transaction committing both entity and outbox table rows.',
    category: 'System Design',
    role: 'backend',
    levelOrder: 4,
  },
  {
    id: 'iq-13',
    question:
      'How do Raft and Paxos achieve consensus in distributed systems during network partitions?',
    answer:
      'Raft simplifies consensus by electing a single leader via randomized election timeouts. All state machine changes flow through the leader. A log entry is committed only when replicated across a strict majority (Quorum: N/2 + 1) of nodes. During a network partition (Split Brain), the minority partition cannot reach quorum and rejects writes, preserving linearizability and preventing split-brain corruption.',
    hint: 'Quorum majorities (N/2 + 1), leader election, and log replication invariants.',
    category: 'System Design',
    role: 'backend',
    levelOrder: 4,
  },
  {
    id: 'iq-14',
    question:
      'As Principal Architect, how do you resolve a bitter engineering divide between rewrite vs refactor?',
    answer:
      'Ground the decision in business risk, customer impact, and quantifiable metrics rather than emotional attachment. Quantify tech debt cost (incident frequency, regression rates, deployment lead time). Propose the Strangler Fig Pattern: incrementally migrate bounded contexts behind an API façade while keeping the legacy core alive, avoiding high-risk "big bang" rewrites that historically suffer 80%+ failure rates.',
    hint: 'Strangler Fig pattern, quantifiable incident metrics, and risk-mitigated incremental delivery.',
    category: 'Architecture',
    role: 'fullstack',
    levelOrder: 5,
  },
  {
    id: 'iq-15',
    question:
      'Design a planetary-scale, multi-master globally distributed database with linearizable reads.',
    answer:
      'Reference Google Spanner and CockroachDB. Linearizable transactions across geographically distributed datacenters require external consistency without locking the entire planet. Spanner achieves this using TrueTime API (synchronized atomic clocks and GPS receivers in each datacenter with bounded time uncertainty ε), allowing two-phase commit over Paxos groups to assign monotonically increasing commit timestamps.',
    hint: 'Reference Google Spanner, TrueTime API with bounded uncertainty ε, and Paxos consensus.',
    category: 'System Design',
    role: 'backend',
    levelOrder: 5,
  },
];

export const QUIZ_BANK: Record<RoleType, (AssessmentQuizQuestion & { correctOption: number })[]> = {
  backend: [
    {
      id: 'be-q1',
      question:
        'What is the most effective mitigation against Cache Stampede (Thundering Herd) under high traffic spikes?',
      options: [
        'Increasing cache expiration TTL to 24 hours',
        'Using singleflight mutual exclusion locking or probabilistic early recomputation',
        'Adding more replica read databases without caching',
        'Disabling caching entirely during peak loads',
      ],
      correctOption: 1,
      role: 'backend',
      levelOrder: 3,
    },
    {
      id: 'be-q2',
      question:
        'When performing a schema migration on a 100M-row table in PostgreSQL, how do you prevent blocking write locks?',
      options: [
        'Run ALTER TABLE with table exclusive lock during off-peak hours',
        'Use the Expand and Contract pattern with CREATE INDEX CONCURRENTLY and background dual-writes',
        'Restart the PostgreSQL daemon before applying the DDL',
        'Drop the primary key constraint temporarily',
      ],
      correctOption: 1,
      role: 'backend',
      levelOrder: 3,
    },
    {
      id: 'be-q3',
      question:
        'How does Raft maintain linearizability during a network partition where the leader is in the minority partition?',
      options: [
        'The minority leader continues accepting writes without quorum',
        'Writes require acknowledgment from a majority quorum (N/2 + 1); hence minority writes fail',
        'The minority partition deletes all previous uncommitted logs immediately',
        'The cluster automatically switches to eventually consistent gossip protocol',
      ],
      correctOption: 1,
      role: 'backend',
      levelOrder: 4,
    },
    {
      id: 'be-q4',
      question:
        'In the era of AI code generation (Copilot/Claude), which backend engineering capability yields the highest long-term leverage?',
      options: [
        'Speed of typing boilerplate CRUD controller code',
        'System decomposition, failure domains, and distributed consistency trade-off judgment',
        'Memorizing raw regex syntax flags',
        'Writing repetitive manual mock setups for unit tests',
      ],
      correctOption: 1,
      role: 'backend',
      levelOrder: 3,
    },
  ],
  frontend: [
    {
      id: 'fe-q1',
      question:
        'How do React Server Components (RSC) primarily improve mobile web performance over standard client-side SPAs?',
      options: [
        'By executing all user event listeners on the remote edge server',
        'By reducing client JavaScript bundle size and streaming prerendered UI components directly',
        'By replacing CSS styles with Canvas WebGL rendering',
        'By disabling HTTP caching on all fetch requests',
      ],
      correctOption: 1,
      role: 'frontend',
      levelOrder: 2,
    },
    {
      id: 'fe-q2',
      question:
        'Which metric measures visual responsiveness to user clicks/taps, and what is its Core Web Vitals target threshold?',
      options: [
        'LCP (Largest Contentful Paint) < 2.5 seconds',
        'INP (Interaction to Next Paint) < 200 milliseconds',
        'CLS (Cumulative Layout Shift) < 0.25',
        'TTFB (Time to First Byte) < 800 milliseconds',
      ],
      correctOption: 1,
      role: 'frontend',
      levelOrder: 3,
    },
    {
      id: 'fe-q3',
      question:
        'In modern frontend development with AI copilots, what architectural responsibility remains exclusively high-leverage for human engineers?',
      options: [
        'Generating Tailwind utility classes for responsive grids',
        'Architecting client-server data boundaries, cache invalidation policies, and hydration stability',
        'Writing switch-case actions in boilerplate Redux reducers',
        'Manually writing cross-browser XMLHttpRequest polyfills',
      ],
      correctOption: 1,
      role: 'frontend',
      levelOrder: 3,
    },
  ],
  fullstack: [
    {
      id: 'fs-q1',
      question:
        'How should sensitive authentication JWT refresh tokens be stored on the web client?',
      options: [
        'Stored in browser localStorage for easy access across iframes',
        'Stored in httpOnly, Secure, SameSite cookies to protect against XSS extraction',
        'Encoded in URL query parameters on each request',
        'Stored in client-side IndexedDB without encryption',
      ],
      correctOption: 1,
      role: 'fullstack',
      levelOrder: 2,
    },
    {
      id: 'fs-q2',
      question:
        'What pattern prevents dual-write inconsistency when updating a database and publishing an event to a message broker?',
      options: [
        'Transactional Outbox Pattern with Change Data Capture (CDC)',
        'Two separate try/catch blocks without transaction boundary',
        'Sending the message broker event first, then retrying DB commit in memory',
        'Polling the database every 10 milliseconds with SELECT *',
      ],
      correctOption: 0,
      role: 'fullstack',
      levelOrder: 3,
    },
    {
      id: 'fs-q3',
      question:
        'What is the most sustainable approach to handling tech debt when business demands continuous feature velocity?',
      options: [
        'Halting all feature shipping for a 6-month big-bang rewrite',
        'Incremental refactoring via Strangler Fig pattern with telemetry validation',
        'Ignoring tech debt until production crashes occur',
        'Outsourcing legacy code maintenance to an offshore team',
      ],
      correctOption: 1,
      role: 'fullstack',
      levelOrder: 4,
    },
  ],
  ai_engineer: [
    {
      id: 'ai-q1',
      question:
        'What is the primary vulnerability addressed by input delimiter boundary tags (e.g. XML delimiters) in LLM system prompts?',
      options: [
        'Model quantization memory leaks',
        'Direct and indirect prompt injection attacks',
        'Token rate limit exhaustion',
        'Vector database cosine similarity degradation',
      ],
      correctOption: 1,
      role: 'ai_engineer',
      levelOrder: 3,
    },
    {
      id: 'ai-q2',
      question:
        'In enterprise RAG architectures, why is hybrid search (BM25 lexical + dense vector embeddings) preferred over vector-only search?',
      options: [
        'It eliminates the need for vector databases entirely',
        'Dense embeddings struggle with exact keywords (SKUs, IDs, error codes), which BM25 captures accurately',
        'BM25 is 100x faster than vector dot product in all cases',
        'Hybrid search prevents the LLM from hallucinating entirely',
      ],
      correctOption: 1,
      role: 'ai_engineer',
      levelOrder: 4,
    },
    {
      id: 'ai-q3',
      question:
        'How do production AI teams evaluate LLM output quality without manual human inspection on every query?',
      options: [
        'Relying solely on unit test code coverage metrics',
        'Automated evaluation pipelines with LLM-as-a-judge (Ragas metrics: faithfulness, answer relevance)',
        'Measuring only inference latency and token counts',
        'Checking that the response length matches prompt length',
      ],
      correctOption: 1,
      role: 'ai_engineer',
      levelOrder: 4,
    },
  ],
};

// Initialize Store Singleton
function getStore() {
  if (!global.__careerClarityStore) {
    const users = new Map<string, InternalUser>();
    const skillProgress = new Map<string, UserSkillProgressDto>();
    const questionAttempts = new Map<
      string,
      { userId: string; questionId: string; solved: boolean; notes?: string }
    >();
    const assessments = new Map<string, AssessmentDto[]>();

    // Seed Demo User (Alex Chen)
    const demoUserId = 'usr_alex_chen_demo';
    users.set('alex.chen@careerclarity.dev', {
      id: demoUserId,
      email: 'alex.chen@careerclarity.dev',
      passwordHash: 'demo12345',
      name: 'Alex Chen',
      yearsExp: 4,
      primaryStack: 'TypeScript, React, Node.js, PostgreSQL',
      createdAt: '2026-01-15T10:00:00.000Z',
    });

    // Seed initial progress for demo user
    skillProgress.set(`${demoUserId}_skill-dist-sys`, {
      id: 'prog-1',
      userId: demoUserId,
      skillId: 'skill-dist-sys',
      status: 'in_progress',
      updatedAt: new Date().toISOString(),
    });

    skillProgress.set(`${demoUserId}_skill-db-index`, {
      id: 'prog-2',
      userId: demoUserId,
      skillId: 'skill-db-index',
      status: 'mastered',
      updatedAt: new Date().toISOString(),
    });

    skillProgress.set(`${demoUserId}_skill-crud`, {
      id: 'prog-3',
      userId: demoUserId,
      skillId: 'skill-crud',
      status: 'mastered',
      updatedAt: new Date().toISOString(),
    });

    // Seed initial question attempt
    questionAttempts.set(`${demoUserId}_iq-1`, {
      userId: demoUserId,
      questionId: 'iq-1',
      solved: true,
      notes:
        'Mastered optimistic locking via version column and pessimistic locking using SELECT FOR UPDATE.',
    });

    // Seed initial assessment report
    const initialReport: CareerClarityReport = {
      overallLevelOrder: 3,
      overallTitle: 'Senior Software Engineer (L5 / E5 Equivalent)',
      role: 'fullstack',
      yearsExp: 4,
      summary:
        'Demonstrates strong full-stack execution autonomy with deep database and API design fundamentals. Ready to transition into multi-team distributed architecture and high-scale system resilience.',
      skillAnalysis: {
        criticalSkillsToLearn: [
          'Distributed Systems & Consensus (Raft / Eventual Consistency)',
          'System Architecture & Trade-Off Modeling',
          'LLM Systems & RAG Architecture',
        ],
        aiLeverageOpportunities: [
          'CRUD REST Endpoint Generation (Automate with Copilot)',
          'Unit & Snapshot Test Suite Drafting',
          'Tailwind CSS Component Slicing',
        ],
        deprecatedOrDecliningSkills: [
          'Manual XML & SOAP Integration',
          'Handwritten Redux Boilerplate',
          'Raw XMLHttpRequest Wrappers',
        ],
      },
      recommendedNextSteps: [
        'Master Distributed Systems fault-tolerance patterns (Circuit breakers, Saga pattern)',
        'Complete 5 Senior System Design mock interview questions in the Question Bank',
        'Deploy an end-to-end RAG application with vector search and evaluation guardrails',
      ],
      benchmarks: [
        { companyName: 'Google', equivalentLevel: 'L5 (Senior)' },
        { companyName: 'Meta', equivalentLevel: 'E5 (Senior)' },
        { companyName: 'Stripe', equivalentLevel: 'L3 (Senior SE)' },
        { companyName: 'Regional Tier-1', equivalentLevel: 'Senior Engineer' },
      ],
    };

    assessments.set(demoUserId, [
      {
        id: 'asm-demo-1',
        userId: demoUserId,
        resultLevelOrder: 3,
        reportJson: initialReport,
        createdAt: new Date().toISOString(),
      },
    ]);

    global.__careerClarityStore = {
      users,
      skillProgress,
      questionAttempts,
      assessments,
    };
  }

  return global.__careerClarityStore;
}

export const serverStore = {
  findUserByEmail(email: string): InternalUser | null {
    const store = getStore();
    return store.users.get(email.toLowerCase().trim()) || null;
  },

  findUserById(id: string): InternalUser | null {
    const store = getStore();
    for (const u of store.users.values()) {
      if (u.id === id) return u;
    }
    return null;
  },

  createUser(data: {
    email: string;
    passwordHash: string;
    name?: string;
    yearsExp?: number;
    primaryStack?: string;
  }): InternalUser {
    const store = getStore();
    const newUser: InternalUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      email: data.email.toLowerCase().trim(),
      passwordHash: data.passwordHash,
      name: data.name || null,
      yearsExp: data.yearsExp ?? null,
      primaryStack: data.primaryStack || null,
      createdAt: new Date().toISOString(),
    };
    store.users.set(newUser.email, newUser);
    return newUser;
  },

  updateUser(id: string, data: Partial<InternalUser>): InternalUser | null {
    const user = this.findUserById(id);
    if (!user) return null;
    Object.assign(user, data);
    return user;
  },

  getUserSkillProgress(userId: string): Map<string, SkillProgressStatus> {
    const store = getStore();
    const map = new Map<string, SkillProgressStatus>();
    for (const p of store.skillProgress.values()) {
      if (p.userId === userId) {
        map.set(p.skillId, p.status);
      }
    }
    return map;
  },

  updateSkillProgress(
    userId: string,
    skillId: string,
    status: SkillProgressStatus,
  ): UserSkillProgressDto {
    const store = getStore();
    const key = `${userId}_${skillId}`;
    const progress: UserSkillProgressDto = {
      id: `prog_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
      userId,
      skillId,
      status,
      updatedAt: new Date().toISOString(),
    };
    store.skillProgress.set(key, progress);
    return progress;
  },

  getProgressSummary(userId: string) {
    const store = getStore();
    const totalSkills = SKILLS_DATA.length;
    const userEntries: UserSkillProgressDto[] = [];
    for (const p of store.skillProgress.values()) {
      if (p.userId === userId) userEntries.push(p);
    }

    const mastered = userEntries.filter((p) => p.status === 'mastered').length;
    const inProgress = userEntries.filter((p) => p.status === 'in_progress').length;
    const notStarted = Math.max(0, totalSkills - (mastered + inProgress));
    const completionPercentage = totalSkills > 0 ? Math.round((mastered / totalSkills) * 100) : 0;

    const recentUpdates = userEntries.slice(0, 5).map((p) => {
      const skill = SKILLS_DATA.find((s) => s.id === p.skillId);
      return {
        skillName: skill?.name || p.skillId,
        category: skill?.category || 'General',
        aiRelevance: skill?.aiRelevance || 'critical',
        status: p.status,
        updatedAt: p.updatedAt,
      };
    });

    return {
      totalSkills,
      mastered,
      inProgress,
      notStarted,
      completionPercentage,
      recentUpdates,
    };
  },

  getInterviewStats(userId?: string) {
    const store = getStore();
    const totalQuestions = INTERVIEW_QUESTIONS.length;
    let solvedCount = 0;

    const levelCounts: Record<number, { total: number; solved: number }> = {
      1: { total: 0, solved: 0 },
      2: { total: 0, solved: 0 },
      3: { total: 0, solved: 0 },
      4: { total: 0, solved: 0 },
      5: { total: 0, solved: 0 },
    };

    for (const q of INTERVIEW_QUESTIONS) {
      const entry = levelCounts[q.levelOrder] || { total: 0, solved: 0 };
      entry.total += 1;
      levelCounts[q.levelOrder] = entry;
    }

    if (userId) {
      for (const a of store.questionAttempts.values()) {
        if (a.userId === userId && a.solved) {
          solvedCount += 1;
          const q = INTERVIEW_QUESTIONS.find((item) => item.id === a.questionId);
          if (q && levelCounts[q.levelOrder]) {
            levelCounts[q.levelOrder].solved += 1;
          }
        }
      }
    }

    return {
      totalQuestions,
      solvedCount,
      progressPercentage: totalQuestions > 0 ? Math.round((solvedCount / totalQuestions) * 100) : 0,
      levelBreakdown: levelCounts,
    };
  },

  recordQuestionAttempt(userId: string, questionId: string, solved: boolean, notes?: string) {
    const store = getStore();
    const key = `${userId}_${questionId}`;
    const attempt = { userId, questionId, solved, notes };
    store.questionAttempts.set(key, attempt);
    return attempt;
  },

  getQuestionAttempt(userId: string, questionId: string) {
    const store = getStore();
    return store.questionAttempts.get(`${userId}_${questionId}`) || null;
  },

  getLatestAssessment(userId: string): AssessmentDto | null {
    const store = getStore();
    const list = store.assessments.get(userId);
    if (!list || list.length === 0) return null;
    return list[list.length - 1] ?? null;
  },

  saveAssessment(userId: string, assessment: AssessmentDto) {
    const store = getStore();
    const list = store.assessments.get(userId) || [];
    list.push(assessment);
    store.assessments.set(userId, list);
  },

  compareLevel(
    yearsExp: number,
    systemDesignScore = 3,
    leadershipScore = 3,
  ): LevelComparisonResult {
    let calculatedOrder = 1;
    if (yearsExp >= 11) {
      calculatedOrder = 5;
    } else if (yearsExp >= 7) {
      calculatedOrder = 4;
    } else if (yearsExp >= 4) {
      calculatedOrder = 3;
    } else if (yearsExp >= 2) {
      calculatedOrder = 2;
    } else {
      calculatedOrder = 1;
    }

    const competencyAvg = (systemDesignScore + leadershipScore) / 2;
    if (competencyAvg >= 4.5 && yearsExp >= 3 && calculatedOrder < 5) {
      calculatedOrder += 1;
    } else if (competencyAvg <= 1.5 && calculatedOrder > 1) {
      calculatedOrder -= 1;
    }

    calculatedOrder = Math.max(1, Math.min(5, calculatedOrder));

    const titleMap: Record<number, string> = {
      1: 'Junior / Entry-Level Software Engineer (L3 / E3 Equivalent)',
      2: 'Mid-Level Software Engineer (L4 / E4 Equivalent)',
      3: 'Senior Software Engineer (L5 / E5 Equivalent)',
      4: 'Staff Software Engineer / Tech Lead (L6 / E6 Equivalent)',
      5: 'Principal Engineer / Architect (L7 / E7 Equivalent)',
    };

    const companyBreakdown = COMPANIES_DATA.map((company) => {
      const matched =
        company.levels.find((l) => l.levelOrder === calculatedOrder) ||
        company.levels.reduce((prev, curr) =>
          Math.abs(curr.levelOrder - calculatedOrder) < Math.abs(prev.levelOrder - calculatedOrder)
            ? curr
            : prev,
        );

      return {
        companyId: company.id,
        companyName: company.name,
        matchedLevel: matched.levelName,
        levelOrder: matched.levelOrder,
        difference: matched.levelOrder - calculatedOrder,
      };
    });

    return {
      estimatedLevelOrder: calculatedOrder,
      estimatedTitle: titleMap[calculatedOrder] ?? 'Software Engineer',
      companyBreakdown,
    };
  },
};

// Standard API JSON Response Helpers
export function jsonSuccess<T>(data: T, status = 200) {
  return Response.json(
    {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    },
    { status },
  );
}

export function jsonError(message: string, status = 400) {
  return Response.json(
    {
      success: false,
      message,
      timestamp: new Date().toISOString(),
    },
    { status },
  );
}

export function getAuthUserFromRequest(request: Request): UserProfile | null {
  const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.slice(7).trim();
  const payload = verifyAccessToken(token);
  if (!payload) return null;

  const user = serverStore.findUserById(payload.sub);
  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    yearsExp: user.yearsExp,
    primaryStack: user.primaryStack,
    createdAt: user.createdAt,
  };
}
