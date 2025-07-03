# Supabase RAG Project Starter

This is a monorepo for a Retrieval-Augmented Generation (RAG) project using Supabase and Next.js.

## Case study

### Business Challenge
How do you build real-time AI applications that can handle millions of users while maintaining low latency and high availability?

### Technical Approach

-Challenge: Traditional databases can't handle real-time AI workloads at scale
-Solution: Supabase + TypeScript architecture for real-time AI backends
-Implementation: Edge functions, real-time subscriptions, and type-safe APIs
-Business Impact: Sub-100ms response times for AI-powered features

### Technical Insights

#### Real-Time Architecture: WebSocket-based real-time data synchronization
Edge Computing: Distributed AI inference at the network edge
Type Safety: End-to-end TypeScript for reliable AI service integration
Scalable Infrastructure: Auto-scaling backend services for variable AI workloads

#### Lessons for Enterprise AI
Modern AI applications require real-time infrastructure. Supabase's architecture patterns show how to build AI systems that feel instant to users while handling enterprise-scale data loads.

## Structure
```
your-project/
├── apps/
│   └── web/                    # Next.js frontend
│       ├── src/
│       │   ├── app/            # App Router (Next.js 13+)
│       │   ├── components/
│       │   ├── lib/
│       │   │   └── supabase.ts # Supabase client config
│       │   └── types/
│       ├── package.json
│       └── next.config.js
├── supabase/                   # Supabase project files
│   ├── functions/              # Edge Functions
│   │   ├── scrape-urls/
│   │   ├── embed-content/
│   │   └── search-rag/
│   ├── migrations/             # Database migrations
│   ├── seed.sql                # Initial data
│   └── config.toml             # Supabase config
├── packages/                   # Shared packages (optional)
│   └── types/                  # Shared TypeScript types
├── scripts/                    # Utility scripts
│   ├── scrape-urls.ts
│   └── setup-db.ts
├── docs/                       # Documentation
├── package.json                # Root package.json (if using workspaces)
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (18+ recommended)
- Supabase CLI (`npm install -g supabase`)
- pnpm, yarn, or npm (for workspaces)

### Setup
1. Clone the repo
2. Install dependencies: `pnpm install` (or `yarn install`)
3. Start Supabase locally: `supabase start`
4. Start the Next.js app: `pnpm --filter web dev` (or `cd apps/web && pnpm dev`)

### Folder Details
- `apps/web`: Next.js frontend
- `supabase/functions`: Edge functions (serverless)
- `supabase/migrations`: DB migrations
- `packages/types`: Shared TypeScript types
- `scripts/`: Utility scripts
- `docs/`: Documentation

---

## License
MIT 