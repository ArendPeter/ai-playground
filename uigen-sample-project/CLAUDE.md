# UIGen Sample Project

AI-powered React component generator using Next.js 15, Claude AI, and a virtual file system.

## Tech Stack

- **Framework**: Next.js 15 (App Router, Turbopack)
- **Language**: TypeScript 5 (strict mode)
- **AI**: Vercel AI SDK + Anthropic Claude (`@ai-sdk/anthropic`)
- **Database**: SQLite via Prisma 6 (client generated to `src/generated/prisma`)
- **Styling**: Tailwind CSS v4 + shadcn/ui (New York theme)
- **Testing**: Vitest + React Testing Library + jsdom
- **Auth**: JWT via `jose`, passwords hashed with `bcrypt`

## Commands

```bash
npm run setup       # Install deps + generate Prisma client + run migrations
npm run dev         # Dev server at http://localhost:3000 (Turbopack)
npm run build       # Production build
npm run start       # Run production server
npm run test        # Run Vitest unit tests
npm run lint        # Run ESLint
npm run db:reset    # Reset database (destructive)
```

## Environment Variables

| Variable | Required | Notes |
|----------|----------|-------|
| `ANTHROPIC_API_KEY` | No | If absent, a mock provider generates static components |
| `JWT_SECRET` | No | Defaults to `"development-secret-key"` — set in production |

## Project Structure

```
src/
├── actions/          # Server actions (auth, project CRUD)
├── app/
│   ├── api/chat/     # Streaming AI chat endpoint
│   ├── [projectId]/  # Dynamic project page
│   └── ...           # Root layout, home page, main-content
├── components/
│   ├── auth/         # Login/signup dialogs
│   ├── chat/         # Chat interface (+ tests)
│   ├── editor/       # Monaco code editor + file tree (+ tests)
│   ├── preview/      # Live component preview (Babel in-browser)
│   └── ui/           # shadcn/ui primitives
├── lib/
│   ├── auth.ts       # JWT session management
│   ├── prisma.ts     # Prisma client singleton
│   ├── provider.ts   # LLM provider (Claude or mock)
│   ├── file-system.ts # Virtual (in-memory) file system
│   ├── tools/        # AI tools: str_replace_editor, file_manager
│   ├── prompts/      # System prompts
│   ├── transform/    # Code transformation utilities
│   └── contexts/     # React contexts for chat and file system
├── hooks/            # Custom React hooks
└── generated/prisma/ # Auto-generated Prisma client (gitignored)
prisma/
├── schema.prisma     # SQLite schema (User, Project)
├── migrations/       # Migration history
└── dev.db            # SQLite database file
```

## Architecture Notes

- **Virtual file system**: Components are never written to disk — the file system is in-memory and serialized into `Project.data` (JSON) in SQLite.
- **Streaming AI**: `/api/chat` streams Claude responses via Vercel AI SDK; tool calls (`str_replace_editor`, `file_manager`) mutate the virtual file system.
- **Mock provider**: When `ANTHROPIC_API_KEY` is unset, `MockLanguageModel` in `lib/provider.ts` returns static component code — useful for UI dev without an API key.
- **Live preview**: Components are compiled client-side using `@babel/standalone` and rendered in an iframe.
- **Anonymous projects**: `Project.userId` is optional — users can generate components without signing in.
- **Node.js compat**: `node-compat.cjs` is `--require`d at startup to fix Node 25+ Web Storage API conflicts with SSR.
- **Path alias**: `@/*` → `src/*` (configured in `tsconfig.json`).

## Database

- **Provider**: SQLite (`prisma/dev.db`)
- **Models**: `User` (id, email, password, timestamps) and `Project` (id, name, userId?, messages JSON, data JSON, timestamps)
- After adding migrations run: `npx prisma migrate dev`
- After schema changes regenerate client: `npx prisma generate`

## Testing

Tests live alongside source files (e.g., `src/components/chat/__tests__/`). Run with:

```bash
npm run test
```

Vitest is configured in `vitest.config.mts` with jsdom environment and tsconfig path resolution.
