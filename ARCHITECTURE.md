# TravelMate — Architecture Overview

## System Architecture

```
┌─────────────────────────┐
│   React SPA (planned)    │
└───────────┬──────────────┘
            │ HTTPS (REST) + WSS (Socket.IO)
┌───────────▼──────────────┐
│  Express API (Render)    │
│  Modular Monolith         │
│  ┌─────────────────────┐ │
│  │ auth │ trips │ chat  │ │
│  │ matching │ expenses  │ │
│  │ polls │ reviews │... │ │
│  └─────────────────────┘ │
│  routes → controllers →  │
│  services → models       │
└───────────┬──────────────┘
            │
┌───────────▼──────────────┐
│  MongoDB Atlas             │
└─────────────────────────────┘
            │
    ┌───────┴────────┬──────────────┐
┌───▼────┐      ┌────▼─────┐   ┌────▼─────┐
│ Gemini  │      │Cloudinary │   │Nominatim │
│  (AI)   │      │ (photos)  │   │  (maps)  │
└─────────┘      └───────────┘   └──────────┘
```

## Why a Modular Monolith

One deployable application, internally organized into independent modules with clear boundaries — not microservices. At this project's scale, microservices would add network overhead, deployment complexity, and distributed-systems failure modes without solving a problem that actually exists (no independent team ownership, no module requiring independent scaling). The module boundaries are deliberately clean enough that any module (chat, matching) could be extracted into its own service later if a genuine scaling need arose.

## Backend Module Structure

Every feature module follows the same internal shape:
```
modules/<feature>/
  <feature>.model.js       # Mongoose schema
  <feature>.service.js       # Business logic (pure, testable)
  <feature>.controller.js    # HTTP request/response handling
  <feature>.routes.js         # Express route definitions
```

Business logic lives in services, never in route files — this keeps logic testable independent of HTTP and reusable across different entry points.

## Data Modeling Principle: Embed vs Reference

Applied consistently across every schema decision:
- **Embed** when data is small, bounded, and always accessed with its parent (e.g., User.profile, User.travelPreferences, Expense.splitBetween)
- **Reference** when data is unbounded, needs independent querying, or is shared across multiple parents (e.g., Message, ItineraryItem, CommunityPost, Trip.creator)

## Recurring Pattern: Compound Unique Indexes

Used across 8+ different features (JoinRequest, TripMember, PollVote, Review, Budget, Block, CommunityMember, TripShare) to guarantee "at most one of this relationship" at the database level — not via application-level pre-checks, which are vulnerable to race conditions under concurrent requests.

## Recurring Pattern: Atomic Operations for Concurrency-Sensitive Actions

Trip seat-counting uses `findOneAndUpdate` with the availability check built into the same query as the increment (`$expr: { $lt: [...] }`), guaranteeing no two concurrent requests can both succeed in claiming the last seat.

## Authentication & Authorization

- **JWT** — short-lived access tokens (15min) + httpOnly refresh tokens (7 days)
- **Global roles** — `USER` / `ADMIN` (platform-wide)
- **Per-trip roles** — `TRIP_ADMIN` / `MEMBER` (scoped to one trip, stored on TripMember)
- **Middleware chain** — `authenticate` → `authorize(role)` or `requireTripMembership` → `requireTripAdmin`

## Security Measures Implemented

- bcrypt password hashing, generic auth error messages (prevents user enumeration)
- IDOR prevention — owning user's ID baked into every single-resource mutation query
- NoSQL injection prevention — explicit type validation on auth inputs
- Rate limiting on auth routes (express-rate-limit)
- Mass-assignment prevention — explicit field whitelisting on all update endpoints
- Helmet security headers
- File upload validation — size limits, MIME type checks (documented limitation: MIME type is client-reported)

## Key Algorithms

- **Compatibility Matching** — weighted rule-based scoring; HashSet-based O(n+m) interest overlap; Min-Heap Top-K selection, O(n log k)
- **Expense Settlement** — greedy algorithm minimizing transactions to at most n-1; Max-Heap based (same MinHeap class, inverted comparator)
- **Trip Preparation Checklist** — pure rule-engine function, Set-based deduplication

## AI Integration

- **Trip Planner** — single-shot generation with prompt-level and code-level hallucination guardrails
- **Travel Assistant** — RAG-lite pattern: retrieves real trip data (itinerary, budget) and injects as context before generation, verified to honestly report missing data rather than fabricate

## Testing Strategy

Depth over breadth — automated tests concentrated on highest-risk logic (money math, auth security) using a real in-memory MongoDB instance (not mocked), including a test that programmatically verifies the user-enumeration protection.

## Deployment

- **Backend:** Render (free tier), environment-variable-driven configuration for CORS/cookie security across dev/production
- **Database:** MongoDB Atlas
- **File Storage:** Cloudinary
- **AI:** Google Gemini API
- **Maps:** OpenStreetMap (Nominatim/Overpass)
