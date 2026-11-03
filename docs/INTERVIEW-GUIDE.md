# TravelMate — Interview Guide

## One-minute explanation

TravelMate is a modular-monolith social travel platform. Its core differentiator is explainable compatibility matching: users are ranked against open trips using weighted budget, interests, travel style, transport, and date signals. Accepted groups receive a private workspace with realtime chat, collaborative itinerary planning, polls, budget tracking, expense settlement, preparation checklists, safety tools, and grounded AI assistance.

## DSA stories

- HashSet intersection: calculate interest overlap in `O(n + m)`.
- Min-Heap Top-K: keep only the best `k` matches in `O(c log k)`.
- Greedy settlement: repeatedly settle the largest debtor and creditor.
- Intervals: detect overlapping travel windows.
- MongoDB `$expr`: atomically protect the last available trip seat.

## Backend stories

- Why a modular monolith instead of microservices?
- How do refresh cookies reduce token exposure?
- How is IDOR prevented?
- Why are database uniqueness constraints necessary?
- How are Socket.IO rooms authorized?
- How does AI avoid claiming unverified live information?

## Frontend stories

- TanStack Query owns server state.
- Auth context owns session state.
- Motion is progressive and respects reduced motion.
- Expensive visual features are isolated and can be lazy-loaded.
- Forms use semantic labels, validation, and visible focus states.

## System-design extensions

If usage grows:

1. Add Redis for Socket.IO adapter and rate-limit coordination.
2. Move email, image processing, and AI tasks to a queue.
3. Add read models for recommendation feeds.
4. Add observability and distributed tracing.
5. Split chat or recommendation workloads only after measured bottlenecks.

## Honest limitations to mention

The current recommendation engine is rule-based, AI output is advisory, external map services can fail, and safety tools do not guarantee safety. These limitations are part of the engineering explanation, not weaknesses to hide.
