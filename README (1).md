# TravelMate

**Find your people. Plan together. Travel smarter.**

TravelMate is an AI-powered social travel platform that helps people discover trips, find compatible travelers, form groups, collaboratively plan trips, communicate in real time, manage expenses, prepare for trips, travel safely, and preserve memories after the trip.

🔗 **Live API:** https://travelmate-bfqv.onrender.com
📦 **Repository:** https://github.com/Vardhan-1806/TravelMate

> **Status:** Backend fully implemented, tested, and deployed. Frontend is a planned next phase.

---

## The Problem

Finding people to travel with, and coordinating a trip with them, is currently scattered across a search, a WhatsApp group, a spreadsheet, and a shared Google Doc. TravelMate brings compatibility-based traveler matching, group formation, and full trip collaboration into one platform.

## Core Features

- **Authentication & Profiles** — JWT-based auth, travel preference profiles
- **Trip Creation & Discovery** — Full-text search, filters, pagination
- **Compatibility Matching Engine** — Rule-based weighted scoring (HashSet-based overlap, Min-Heap Top-K)
- **Join Requests & Group Formation** — Atomic, race-condition-safe seat management
- **Trip Workspace** — Membership-gated private space per trip
- **Real-Time Chat** — Socket.IO, room-based security, membership verified server-side
- **Collaborative Itinerary & Polls**
- **Smart Budget Planner & Expense Engine** — Greedy settlement algorithm (provably minimal transactions)
- **Reviews & Reputation**
- **Notifications**
- **Safety** — Report/block system, trusted contacts, safety check-ins with consent-based sharing
- **Admin Dashboard**
- **AI Trip Planner & Travel Assistant** — Gemini-powered, with hallucination guardrails and RAG-lite grounding
- **Personalized Recommendations** — Behavior-based interest inference
- **Maps Integration** — Geocoding via Nominatim
- **Travel Memories** — Cloudinary photo uploads, composed trip recaps
- **Communities**

## Tech Stack

**Backend:** Node.js, Express, MongoDB (Mongoose), Socket.IO
**Auth:** JWT (access + refresh tokens), bcrypt
**AI:** Google Gemini API
**File Storage:** Cloudinary
**Testing:** Jest, Supertest, mongodb-memory-server
**Deployment:** Render (backend), MongoDB Atlas (database)

## Architecture

Modular monolith — organized into independent feature modules (auth, trips, matching, chat, expenses, etc.), each following a routes → controllers → services → models structure. See [ARCHITECTURE.md](./ARCHITECTURE.md) for full details.

## Getting Started Locally

```bash
# Clone the repo
git clone https://github.com/Vardhan-1806/TravelMate.git
cd TravelMate/server

# Install dependencies
npm install

# Set up environment variables (see .env.example)
cp .env.example .env

# Run the server
npm run dev

# Run tests
npm test
```

## API Overview

| Module | Base Route |
|---|---|
| Auth | `/api/auth` |
| Profile | `/api/profile` |
| Trips | `/api/trips` |
| Matching | `/api/matching` |
| Join Requests | `/api/join-requests` |
| Workspace | `/api/workspace` |
| Chat | `/api/messages` |
| Itinerary | `/api/itinerary` |
| Polls | `/api/polls` |
| Budget | `/api/budget` |
| Expenses | `/api/expenses` |
| Reviews | `/api/reviews` |
| Notifications | `/api/notifications` |
| Safety | `/api/safety`, `/api/safety-checkin` |
| Admin | `/api/admin` |
| Preparation | `/api/preparation` |
| Readiness | `/api/readiness` |
| AI | `/api/ai`, `/api/ai/assistant` |
| Recommendations | `/api/recommendations` |
| Maps | `/api/maps` |
| Memories | `/api/memories` |
| Communities | `/api/communities` |

## Testing

9 automated tests covering the greedy expense-settlement algorithm (boundary cases, transaction-count guarantees) and authentication security properties (including a programmatic check that login errors don't leak whether an email is registered).

```bash
cd server
npm test
```

## Author

Alisam Srivardhan (Vardhan) — 3rd-year CSE, BVRIT Narsapur
