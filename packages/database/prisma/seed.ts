import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding for Career Clarity...');

  // 1. Clean existing records (in dependency order)
  await prisma.userQuestionAttempt.deleteMany();
  await prisma.userSkillProgress.deleteMany();
  await prisma.assessment.deleteMany();
  await prisma.roadmapNode.deleteMany();
  await prisma.interviewQuestion.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.companyLevel.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned existing database tables.');

  // 2. Seed Companies & Company Levels
  const companiesData = [
    {
      name: 'Google',
      slug: 'google',
      levels: [
        {
          levelName: 'L3',
          levelOrder: 1,
          yearsExpMin: 0,
          yearsExpMax: 2,
          description:
            'Entry-level Software Engineer. Focuses on task execution, core algorithms, and clean code within scoped tasks.',
        },
        {
          levelName: 'L4',
          levelOrder: 2,
          yearsExpMin: 2,
          yearsExpMax: 5,
          description:
            'Mid-Level Software Engineer. Self-directed, designs small-to-medium components, and manages ambiguous technical problems.',
        },
        {
          levelName: 'L5',
          levelOrder: 3,
          yearsExpMin: 4,
          yearsExpMax: 8,
          description:
            'Senior Software Engineer. Leads system design, team-wide technical architecture, mentorship, and cross-functional alignment.',
        },
        {
          levelName: 'L6',
          levelOrder: 4,
          yearsExpMin: 7,
          yearsExpMax: 12,
          description:
            'Staff Software Engineer. Solves multi-team architectural challenges, sets engineering strategy, and drives high organizational impact.',
        },
        {
          levelName: 'L7',
          levelOrder: 5,
          yearsExpMin: 10,
          yearsExpMax: 16,
          description:
            'Senior Staff / Principal Engineer. Organization-wide technical leader, defines long-term technology bets and platform reliability.',
        },
      ],
    },
    {
      name: 'Meta',
      slug: 'meta',
      levels: [
        {
          levelName: 'E3',
          levelOrder: 1,
          yearsExpMin: 0,
          yearsExpMax: 2,
          description:
            'Rotational / Entry Software Engineer. Strong coding foundations, learns internal frameworks, fast shipping velocity.',
        },
        {
          levelName: 'E4',
          levelOrder: 2,
          yearsExpMin: 2,
          yearsExpMax: 5,
          description:
            'Software Engineer. Autonomous execution, unblocks oneself, contributes to architecture discussions and feature delivery.',
        },
        {
          levelName: 'E5',
          levelOrder: 3,
          yearsExpMin: 4,
          yearsExpMax: 8,
          description:
            'Senior Software Engineer. High execution autonomy, owns entire product surfaces, balances trade-offs, and mentors engineers.',
        },
        {
          levelName: 'E6',
          levelOrder: 4,
          yearsExpMin: 7,
          yearsExpMax: 12,
          description:
            'Staff Software Engineer. Pillar-level impact, solves ambiguous scaling and data consistency bottlenecks across systems.',
        },
        {
          levelName: 'E7',
          levelOrder: 5,
          yearsExpMin: 10,
          yearsExpMax: 16,
          description:
            'Principal Engineer. Directs company-wide architectural direction, high-stakes infrastructure, and cross-org initiatives.',
        },
      ],
    },
    {
      name: 'Stripe',
      slug: 'stripe',
      levels: [
        {
          levelName: 'L1 (SE I)',
          levelOrder: 1,
          yearsExpMin: 0,
          yearsExpMax: 2,
          description:
            'Software Engineer I. Writes safe, maintainable code with high test coverage and attention to financial-grade correctness.',
        },
        {
          levelName: 'L2 (SE II)',
          levelOrder: 2,
          yearsExpMin: 2,
          yearsExpMax: 5,
          description:
            'Software Engineer II. Owns operational reliability of services, debugs distributed incidents, and refactors complex workflows.',
        },
        {
          levelName: 'L3 (Senior SE)',
          levelOrder: 3,
          yearsExpMin: 5,
          yearsExpMax: 9,
          description:
            'Senior Software Engineer. Drives technical specs, defines API ergonomics, fault tolerance, and zero-downtime migrations.',
        },
        {
          levelName: 'L4 (Staff SE)',
          levelOrder: 4,
          yearsExpMin: 8,
          yearsExpMax: 13,
          description:
            'Staff Software Engineer. Multi-region infrastructure, latency optimizations, and company-wide standards definition.',
        },
        {
          levelName: 'L5 (Principal)',
          levelOrder: 5,
          yearsExpMin: 12,
          yearsExpMax: 18,
          description:
            'Principal Engineer. Sets Stripe-wide technical vision, long-term protocol standards, and foundational platform architecture.',
        },
      ],
    },
    {
      name: 'Tier-1 Regional Tech (High-Growth Tech Hub)',
      slug: 'regional-tier1',
      levels: [
        {
          levelName: 'Junior Engineer',
          levelOrder: 1,
          yearsExpMin: 0,
          yearsExpMax: 2,
          description:
            'Junior Software Engineer. Focuses on feature development, bug fixes, and learning team conventions and Git workflows.',
        },
        {
          levelName: 'Mid-Level Engineer',
          levelOrder: 2,
          yearsExpMin: 2,
          yearsExpMax: 4,
          description:
            'Mid-Level Software Engineer. Independently ships features end-to-end, writes unit/integration tests, handles code reviews.',
        },
        {
          levelName: 'Senior Engineer',
          levelOrder: 3,
          yearsExpMin: 4,
          yearsExpMax: 7,
          description:
            'Senior Software Engineer. Leads project delivery, makes tech stack decisions, mentors juniors, and manages on-call incidents.',
        },
        {
          levelName: 'Tech Lead / Staff',
          levelOrder: 4,
          yearsExpMin: 6,
          yearsExpMax: 10,
          description:
            'Tech Lead / Staff Engineer. Aligns engineering with business metrics, governs microservices architecture, and reduces tech debt.',
        },
        {
          levelName: 'Principal Architect',
          levelOrder: 5,
          yearsExpMin: 9,
          yearsExpMax: 15,
          description:
            'Principal Architect. Evaluates enterprise-scale software purchases vs. builds, guides disaster recovery and cloud costs.',
        },
      ],
    },
  ];

  for (const company of companiesData) {
    await prisma.company.create({
      data: {
        name: company.name,
        slug: company.slug,
        levels: {
          create: company.levels,
        },
      },
    });
  }
  console.log(`✅ Seeded ${companiesData.length} companies with normalized levels.`);

  // 3. Seed Skills (AI-Era Relevance: critical, eased_by_ai, declining)
  const skillsData = [
    // Critical (Irreplaceable & High-Leverage in AI Era)
    {
      name: 'Distributed Systems & Consensus',
      category: 'System Design',
      aiRelevance: 'critical',
      description:
        'Understanding CAP theorem, Raft/Paxos, event-driven eventual consistency, and idempotency guarantees.',
    },
    {
      name: 'Database Indexing & Query Execution Plans',
      category: 'Backend',
      aiRelevance: 'critical',
      description:
        'Deep understanding of B-Tree vs LSM trees, WAL, EXPLAIN ANALYZE, vacuuming, and transaction isolation levels.',
    },
    {
      name: 'Microservices & Fault Tolerance Patterns',
      category: 'System Design',
      aiRelevance: 'critical',
      description:
        'Circuit breakers, rate limiters, bulkhead pattern, saga pattern, and dead letter queues in high-throughput environments.',
    },
    {
      name: 'Observability, APM & Root Cause Analysis',
      category: 'DevOps',
      aiRelevance: 'critical',
      description:
        'Distributed tracing (OpenTelemetry), structured logging, Prometheus metrics, and production triage under pressure.',
    },
    {
      name: 'System Architecture & Trade-Off Modeling',
      category: 'System Design',
      aiRelevance: 'critical',
      description:
        'Evaluating latency vs throughput, synchronous vs asynchronous, read vs write heavy trade-offs with business impact.',
    },
    {
      name: 'Security Architecture & Zero Trust',
      category: 'Security',
      aiRelevance: 'critical',
      description:
        'OAuth2/OIDC, mTLS, RBAC/ABAC authorization models, cryptographic key rotation, and supply chain security.',
    },
    {
      name: 'Frontend Core Web Vitals & Hydration Internals',
      category: 'Frontend',
      aiRelevance: 'critical',
      description:
        'Optimizing LCP, INP, CLS, understanding React Server Components, streaming SSR, and micro-frontend boundaries.',
    },
    {
      name: 'LLM Systems & RAG Architecture',
      category: 'AI / ML',
      aiRelevance: 'critical',
      description:
        'Vector databases, hybrid search (BM25 + embeddings), reranking, context window management, and hallucination guardrails.',
    },
    {
      name: 'API Contract Governance & Backward Compatibility',
      category: 'Backend',
      aiRelevance: 'critical',
      description:
        'Semantic versioning, protobuf/gRPC schemas, OpenAPI spec generation, and non-breaking database schema evolution.',
    },
    {
      name: 'Concurrency, Mutexes & Lock Contention',
      category: 'Backend',
      aiRelevance: 'critical',
      description:
        'Preventing deadlocks, thread-safety, memory barriers, atomic operations, and optimistic vs pessimistic locking.',
    },

    // Eased by AI (Accelerated via AI Copilots)
    {
      name: 'CRUD REST Endpoint Generation',
      category: 'Backend',
      aiRelevance: 'eased_by_ai',
      description:
        'Writing standard boilerplate controllers, services, and basic validation schemas. AI generates 90% in seconds.',
    },
    {
      name: 'Unit & Snapshot Test Boilerplate',
      category: 'Backend',
      aiRelevance: 'eased_by_ai',
      description:
        'Writing repetitive unit test mocks, assertions, and boundary fixtures. AI drafts suites rapidly with prompt supervision.',
    },
    {
      name: 'Tailwind CSS Layout & Responsive Slicing',
      category: 'Frontend',
      aiRelevance: 'eased_by_ai',
      description:
        'Translating Figma designs into responsive flexbox/grid Tailwind markup. AI handles styling directly from mockups.',
    },
    {
      name: 'Regular Expressions & Pattern Matching',
      category: 'Backend',
      aiRelevance: 'eased_by_ai',
      description:
        'Constructing esoteric regex patterns for text parsing. AI produces correct patterns and explanations instantly.',
    },
    {
      name: 'Dockerfile & CI Pipeline YAML Templating',
      category: 'DevOps',
      aiRelevance: 'eased_by_ai',
      description:
        'Standard GitHub Actions workflows and multi-stage container builds. AI synthesizes configurations with minimal tuning.',
    },
    {
      name: 'Database Migration Scripts Writing',
      category: 'Backend',
      aiRelevance: 'eased_by_ai',
      description:
        'Drafting DDL ALTER TABLE statements and index creations. Automated by ORMs and AI assistants.',
    },
    {
      name: 'Technical Documentation & Swagger Annotations',
      category: 'Architecture',
      aiRelevance: 'eased_by_ai',
      description:
        'Generating docstrings, Markdown guides, and OpenAPI decorators from existing code signatures.',
    },

    // Declining (Decreasing Value / Automating Away)
    {
      name: 'Manual Memory Allocation for Web Services',
      category: 'Backend',
      aiRelevance: 'declining',
      description:
        'Low-level manual memory bookkeeping for standard web APIs. High-level managed runtimes make this niche.',
    },
    {
      name: 'Handwritten State Machine Redux Boilerplate',
      category: 'Frontend',
      aiRelevance: 'declining',
      description:
        'Writing voluminous action types, action creators, and reducer switch-case matrices without modern lightweight primitives.',
    },
    {
      name: 'Raw XMLHttpRequest / Vanilla Fetch Wrappers',
      category: 'Frontend',
      aiRelevance: 'declining',
      description:
        'Writing custom caching and retry loops manually instead of using TanStack Query, SWR, or framework loaders.',
    },
    {
      name: 'Manual XML & SOAP Integration',
      category: 'Backend',
      aiRelevance: 'declining',
      description:
        'Legacy web service protocols largely replaced by JSON REST, GraphQL, and modern gRPC/Protobuf protocols.',
    },
  ];

  const skillMap = new Map<string, string>();
  for (const skill of skillsData) {
    const created = await prisma.skill.create({
      data: skill,
    });
    skillMap.set(created.name, created.id);
  }
  console.log(`✅ Seeded ${skillsData.length} skills categorized with AI relevance.`);

  // 4. Seed Roadmap Nodes (Tree Hierarchy for Backend & Frontend roles)
  const backendRoadmap = [
    {
      skillName: 'API Contract Governance & Backward Compatibility',
      role: 'backend',
      levelOrder: 1,
      parentSkillName: null,
    },
    {
      skillName: 'CRUD REST Endpoint Generation',
      role: 'backend',
      levelOrder: 1,
      parentSkillName: 'API Contract Governance & Backward Compatibility',
    },
    {
      skillName: 'Database Indexing & Query Execution Plans',
      role: 'backend',
      levelOrder: 2,
      parentSkillName: 'API Contract Governance & Backward Compatibility',
    },
    {
      skillName: 'Concurrency, Mutexes & Lock Contention',
      role: 'backend',
      levelOrder: 3,
      parentSkillName: 'Database Indexing & Query Execution Plans',
    },
    {
      skillName: 'Microservices & Fault Tolerance Patterns',
      role: 'backend',
      levelOrder: 3,
      parentSkillName: 'Database Indexing & Query Execution Plans',
    },
    {
      skillName: 'Distributed Systems & Consensus',
      role: 'backend',
      levelOrder: 4,
      parentSkillName: 'Microservices & Fault Tolerance Patterns',
    },
    {
      skillName: 'System Architecture & Trade-Off Modeling',
      role: 'backend',
      levelOrder: 5,
      parentSkillName: 'Distributed Systems & Consensus',
    },
  ];

  const frontendRoadmap = [
    {
      skillName: 'Tailwind CSS Layout & Responsive Slicing',
      role: 'frontend',
      levelOrder: 1,
      parentSkillName: null,
    },
    {
      skillName: 'Raw XMLHttpRequest / Vanilla Fetch Wrappers',
      role: 'frontend',
      levelOrder: 1,
      parentSkillName: 'Tailwind CSS Layout & Responsive Slicing',
    },
    {
      skillName: 'Frontend Core Web Vitals & Hydration Internals',
      role: 'frontend',
      levelOrder: 2,
      parentSkillName: 'Tailwind CSS Layout & Responsive Slicing',
    },
    {
      skillName: 'Handwritten State Machine Redux Boilerplate',
      role: 'frontend',
      levelOrder: 2,
      parentSkillName: 'Frontend Core Web Vitals & Hydration Internals',
    },
    {
      skillName: 'Security Architecture & Zero Trust',
      role: 'frontend',
      levelOrder: 3,
      parentSkillName: 'Frontend Core Web Vitals & Hydration Internals',
    },
    {
      skillName: 'Observability, APM & Root Cause Analysis',
      role: 'frontend',
      levelOrder: 4,
      parentSkillName: 'Security Architecture & Zero Trust',
    },
  ];

  const aiEngineerRoadmap = [
    {
      skillName: 'API Contract Governance & Backward Compatibility',
      role: 'ai_engineer',
      levelOrder: 1,
      parentSkillName: null,
    },
    {
      skillName: 'Database Indexing & Query Execution Plans',
      role: 'ai_engineer',
      levelOrder: 2,
      parentSkillName: 'API Contract Governance & Backward Compatibility',
    },
    {
      skillName: 'LLM Systems & RAG Architecture',
      role: 'ai_engineer',
      levelOrder: 3,
      parentSkillName: 'Database Indexing & Query Execution Plans',
    },
    {
      skillName: 'Distributed Systems & Consensus',
      role: 'ai_engineer',
      levelOrder: 4,
      parentSkillName: 'LLM Systems & RAG Architecture',
    },
    {
      skillName: 'System Architecture & Trade-Off Modeling',
      role: 'ai_engineer',
      levelOrder: 5,
      parentSkillName: 'Distributed Systems & Consensus',
    },
  ];

  // Helper to insert tree nodes preserving parent-child relations
  async function insertRoadmapNodes(nodes: typeof backendRoadmap) {
    const nodeMap = new Map<string, string>();
    for (const node of nodes) {
      const skillId = skillMap.get(node.skillName);
      if (!skillId) continue;

      const parentNodeId = node.parentSkillName ? nodeMap.get(node.parentSkillName) || null : null;

      const createdNode = await prisma.roadmapNode.create({
        data: {
          skillId,
          role: node.role,
          levelOrder: node.levelOrder,
          parentNodeId,
        },
      });
      nodeMap.set(node.skillName, createdNode.id);
    }
  }

  await insertRoadmapNodes(backendRoadmap);
  await insertRoadmapNodes(frontendRoadmap);
  await insertRoadmapNodes(aiEngineerRoadmap);
  console.log('✅ Seeded interactive roadmap nodes with hierarchical links.');

  // 5. Seed 30+ Interview Questions
  const interviewQuestionsData = [
    // Level 1-2 (Junior / Mid)
    {
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
      question:
        'How does indexing with B-Trees speed up queries, and why do too many indexes harm write performance?',
      answer:
        'B-Tree indexes maintain a balanced tree structure with O(log N) search, range scan, and ordering characteristics. While they dramatically accelerate SELECT queries with WHERE/ORDER BY clauses, every INSERT, UPDATE, or DELETE operation requires updating the underlying table pages plus every associated index B-Tree, increasing disk I/O and lock duration.',
      hint: 'Consider read latency vs write amplification on disk.',
      category: 'Backend',
      role: 'backend',
      levelOrder: 2,
    },
    {
      question:
        'Explain the difference between process memory, heap, and call stack in Node.js / V8.',
      answer:
        'The call stack holds primitive variables and references to active execution frames (LIFO). The memory heap allocates dynamic objects, arrays, and closures. V8 garbage collector (Scavenge for young generation, Mark-Sweep-Compact for old generation) reclaims unreferenced heap allocations.',
      hint: 'Recall primitive allocations vs reference objects and garbage collection phases.',
      category: 'Backend',
      role: 'backend',
      levelOrder: 2,
    },
    {
      question:
        'What causes React component re-renders, and how does useMemo / useCallback optimize them?',
      answer:
        'Re-renders occur when component state updates, parent components re-render, or consumed React Context changes. useMemo caches expensive calculation results between renders until dependencies change; useCallback caches function reference identities to prevent child memoized components (React.memo) from invalidating unnecessarily.',
      hint: 'Reference equality across re-render cycles.',
      category: 'Frontend',
      role: 'frontend',
      levelOrder: 1,
    },
    {
      question:
        'What are database ACID properties, and what does the "I" (Isolation) specifically govern?',
      answer:
        'ACID stands for Atomicity, Consistency, Isolation, Durability. Isolation defines how concurrent transactions view and modify shared data, preventing anomalies like Dirty Reads, Non-Repeatable Reads, and Phantom Reads through ANSI isolation levels: Read Uncommitted, Read Committed, Repeatable Read, and Serializable.',
      hint: 'Focus on dirty reads, non-repeatable reads, and serializable locks.',
      category: 'Backend',
      role: 'backend',
      levelOrder: 2,
    },

    // Level 3 (Senior Engineer)
    {
      question:
        'Design a distributed Rate Limiter capable of handling 100,000 requests per second across 50 nodes.',
      answer:
        'A production rate limiter utilizes Redis clusters running sliding window log or token bucket algorithms. By executing atomic Lua scripts in Redis (EVALSHA), counter increments and TTL expiration happen in a single roundtrip without race conditions. Client requests pass through an API gateway layer with in-memory local caching (e.g. token bucket with sync) to absorb bursts and prevent Redis starvation.',
      hint: 'Mention Sliding Window Counter algorithm and atomic Redis Lua scripts.',
      category: 'System Design',
      role: 'backend',
      levelOrder: 3,
    },
    {
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
      question:
        'How does the Event Loop handle Macrotasks vs Microtasks in modern JavaScript and Node.js?',
      answer:
        'The Event Loop processes phases: timers, I/O polling, check (setImmediate). Microtasks (process.nextTick, Promise.then/catch/finally, queueMicrotask) take highest precedence: the microtask queue is completely drained after each individual macrotask and between event loop phases, which can cause starvation if microtasks recursively enqueue.',
      hint: 'Promises vs setTimeout/setImmediate priority and queue draining.',
      category: 'Frontend',
      role: 'fullstack',
      levelOrder: 3,
    },
    {
      question: 'How would you architect an idempotent payment processing endpoint?',
      answer:
        'Clients generate a UUIDv4 idempotency key passed via header (Idempotency-Key). The server uses an atomic distributed lock (Redis/Postgres) on the key. If the key exists with "COMPLETED" status, return cached response. If "PENDING", reject or poll. If new, insert record with status PENDING within a transaction, invoke payment gateway with idempotency key, update status to COMPLETED, and commit.',
      hint: 'Discuss unique idempotency key headers, distributed locks, and state transitions.',
      category: 'System Design',
      role: 'backend',
      levelOrder: 3,
    },
    {
      question:
        'Explain Cache Stampede (Thundering Herd) and how to mitigate it in high-traffic APIs.',
      answer:
        'A cache stampede happens when a high-traffic cache key expires, causing thousands of concurrent requests to miss cache simultaneously and overwhelm the primary database. Mitigations include: 1) Mutual exclusion locks (singleflight / distributed lock so only one thread recomputes), 2) Probabilistic early expiration (XFetch algorithm), 3) Background asynchronous cache refreshes before TTL expires.',
      hint: 'Mention mutex singleflight locking and probabilistic early background recomputation.',
      category: 'System Design',
      role: 'backend',
      levelOrder: 3,
    },
    {
      question:
        'What are Core Web Vitals (LCP, INP, CLS) and how do you diagnose and improve them?',
      answer:
        'LCP (Largest Contentful Paint < 2.5s) measures render speed of main visual content (optimized via CDN, image preloading, SSR). INP (Interaction to Next Paint < 200ms) measures responsiveness to user actions (optimized by breaking long JavaScript tasks, web workers, requestIdleCallback). CLS (Cumulative Layout Shift < 0.1) measures visual stability (optimized by reserving width/height on images and fonts).',
      hint: 'Define LCP, INP, CLS thresholds and their main browser remediation techniques.',
      category: 'Frontend',
      role: 'frontend',
      levelOrder: 3,
    },
    {
      question:
        'How do you handle WebSocket connection state and reconnection across a multi-instance backend cluster?',
      answer:
        'WebSocket connections are stateful TCP connections tied to a specific server instance. To scale across multiple instances: 1) Put an L7 load balancer with sticky sessions or round-robin in front, 2) Use Redis Pub/Sub or Kafka as a message backplane so messages sent to instance A propagate to connected clients on instance B, 3) Clients implement exponential backoff reconnection with heartbeats (ping/pong).',
      hint: 'Describe Redis Pub/Sub message backplanes and cluster message distribution.',
      category: 'System Design',
      role: 'backend',
      levelOrder: 3,
    },
    {
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
      question: 'How do you prevent Prompt Injection attacks in production LLM applications?',
      answer:
        'Treat user input as untrusted data similar to SQL injection. Mitigations include: 1) Strict boundary delimiters in system prompts (e.g. XML tags like <user_input>), 2) Dual-LLM architecture (classifier guardrail model vetting input before main inference), 3) Output validation and schema enforcement (e.g. structured JSON decoding), 4) Least-privilege API tool execution.',
      hint: 'Mention delimiter encapsulation, input guardrails, and structured output parsing.',
      category: 'AI Engineering',
      role: 'ai_engineer',
      levelOrder: 3,
    },

    // Level 4 (Staff Engineer)
    {
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
      question:
        'Describe how to build a scalable multi-tenant SaaS authorization system (RBAC vs ABAC vs ReBAC).',
      answer:
        'RBAC assigns static permissions to roles (admin, member). ABAC evaluates dynamic attributes (IP, time, ownership). ReBAC (Relationship-Based Access Control, like Google Zanzibar / Oso) models permissions as graph relations (User -> memberOf -> Team -> owns -> Document). In high scale, authorization decisions evaluate locally in <5ms using in-memory cached relationship tuples with spicedb or custom inverted indices.',
      hint: 'Google Zanzibar relationship graphs and in-memory policy enforcement points.',
      category: 'Security',
      role: 'backend',
      levelOrder: 4,
    },
    {
      question:
        'How do you design a graceful degradation strategy during catastrophic cloud outage (e.g. AWS us-east-1 down)?',
      answer:
        'Multi-region active-active or active-passive architecture with Route 53 DNS latency routing and health checks. Critical paths degrade to read-only mode using replicated cross-region replicas. Static content falls back to CDN edge servers. Non-essential microservices (recommendations, analytics) are disabled via dynamic feature flags to conserve capacity for checkout and authentication.',
      hint: 'Multi-region failover, read-only degradation, and circuit-breaker feature flags.',
      category: 'System Design',
      role: 'backend',
      levelOrder: 4,
    },
    {
      question:
        'What are the trade-offs of micro-frontends vs a modular monolithic Next.js repository at scale?',
      answer:
        'Micro-frontends allow independent deployment teams but introduce high runtime overhead: duplicate dependencies, inconsistent UX/styling, complex cross-app communication (CustomEvents, iframe barriers), and difficult routing. A unified modular monorepo (Turborepo) with strict package boundaries, Module Federation, and shared design tokens usually yields superior developer velocity and performance for 95% of organizations.',
      hint: 'Evaluate independent deployment flexibility vs bundle duplication and operational overhead.',
      category: 'Frontend',
      role: 'frontend',
      levelOrder: 4,
    },
    {
      question:
        'How do you evaluate and monitor LLM performance in production (Evals, Ragas, Tracing)?',
      answer:
        'Establish automated evaluation pipelines: 1) Deterministic checks (JSON schema validation, regex syntax), 2) Model-graded evaluations (LLM-as-a-judge for faithfulness, answer relevance, context precision using frameworks like Ragas/DeepEval), 3) End-to-end tracing (Langfuse/Arize Phoenix) tracking latency, token usage, cost per query, and user thumbs-up/down feedback loops.',
      hint: 'LLM-as-a-judge, Ragas metrics (faithfulness, context relevance), and telemetry tools.',
      category: 'AI Engineering',
      role: 'ai_engineer',
      levelOrder: 4,
    },

    // Level 5 (Principal Engineer / Architect)
    {
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
      question:
        'How do you govern technical standards, architecture reviews, and RFCs across 200+ engineers?',
      answer:
        'Implement an asynchronous Lightweight RFC (Request for Comments) process. RFCs outline context, proposed architecture, evaluated alternatives, security/privacy impact, and non-goals. Establish an Architecture Advisory Board that acts as advisors and facilitators rather than bottlenecks. Track architecture decisions via Architecture Decision Records (ADRs) committed directly to repositories.',
      hint: 'Mention RFC template workflows, Architecture Decision Records (ADRs), and advisor models.',
      category: 'Architecture',
      role: 'backend',
      levelOrder: 5,
    },
    {
      question:
        'Design a planetary-scale, multi-master globally distributed database with linearizable reads.',
      answer:
        'Reference Google Spanner and CockroachDB. Linearizable transactions across geographically distributed datacenters require external consistency without locking the entire planet. Spanner achieves this using TrueTime API (synchronized atomic clocks and GPS receivers in each datacenter with bounded time uncertainty ε), allowing two-phase commit over Paxos groups to assign monotonically increasing commit timestamps.',
      hint: 'Reference Google Spanner, TrueTime API with bounded uncertainty ε, and Paxos consensus.',
      category: 'System Design',
      role: 'backend',
      levelOrder: 5,
    },
    {
      question:
        'How do you systematically reduce cloud infrastructure spend by 40% without compromising SLA?',
      answer:
        '1) Compute: Rightsizing over-provisioned Kubernetes nodes, migrating stateless services to Graviton/ARM instances (20% savings), and using Spot/Preemptible instances for background workers. 2) Storage: Lifecycle policies transitioning S3 objects to Glacier, cleaning unattached EBS volumes. 3) Network: Reducing inter-AZ data transfer by collocating chatty microservices. 4) Database: Query optimization to scale down instance tiers.',
      hint: 'Address Compute rightsizing, Spot instances, Graviton ARM, storage lifecycles, and cross-AZ networking.',
      category: 'DevOps',
      role: 'backend',
      levelOrder: 5,
    },
    {
      question:
        'How do you evaluate when to build custom in-house AI infrastructure vs leveraging managed APIs (e.g. OpenAI vs self-hosted vLLM)?',
      answer:
        'Evaluate 4 criteria: 1) Data Privacy & Compliance (HIPAA/finance requirements often mandate VPC-isolated self-hosted weights), 2) Throughput & Unit Economics (at high sustained QPS, self-hosting quantized models on rented H100/A100 clusters with vLLM is 3-5x cheaper than per-token APIs), 3) Domain Specialization (fine-tuned smaller 8B models beat generalized 400B models on specific tasks), 4) Engineering Maintenance overhead.',
      hint: 'Analyze sustained inference volume, token economics, latency SLA, and compliance requirements.',
      category: 'AI Engineering',
      role: 'ai_engineer',
      levelOrder: 5,
    },
  ];

  for (const q of interviewQuestionsData) {
    await prisma.interviewQuestion.create({
      data: q,
    });
  }
  console.log(
    `✅ Seeded ${interviewQuestionsData.length} role-calibrated interview questions with detailed solutions.`,
  );

  // 6. Seed Demo User & Sample Progress
  const demoUser = await prisma.user.create({
    data: {
      email: 'alex.chen@careerclarity.dev',
      passwordHash: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xgn50qGmx8wdc1ZWDm.', // demo12345
      name: 'Alex Chen',
      yearsExp: 4,
      primaryStack: 'TypeScript, React, Node.js, PostgreSQL',
    },
  });

  // Assign sample skill progress
  const distributedSkill = await prisma.skill.findUnique({
    where: { name: 'Distributed Systems & Consensus' },
  });
  const dbIndexSkill = await prisma.skill.findUnique({
    where: { name: 'Database Indexing & Query Execution Plans' },
  });
  const crudSkill = await prisma.skill.findUnique({
    where: { name: 'CRUD REST Endpoint Generation' },
  });

  if (distributedSkill) {
    await prisma.userSkillProgress.create({
      data: {
        userId: demoUser.id,
        skillId: distributedSkill.id,
        status: 'in_progress',
      },
    });
  }

  if (dbIndexSkill) {
    await prisma.userSkillProgress.create({
      data: {
        userId: demoUser.id,
        skillId: dbIndexSkill.id,
        status: 'mastered',
      },
    });
  }

  if (crudSkill) {
    await prisma.userSkillProgress.create({
      data: {
        userId: demoUser.id,
        skillId: crudSkill.id,
        status: 'mastered',
      },
    });
  }

  // Create sample assessment report
  await prisma.assessment.create({
    data: {
      userId: demoUser.id,
      resultLevelOrder: 3, // Senior Level 3
      reportJson: {
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
      },
    },
  });

  console.log(
    `✅ Seeded demo user (${demoUser.email}) with initial assessment report and skill progress.`,
  );
  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
