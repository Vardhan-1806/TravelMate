# TravelMate

> Find your people. Plan together. Travel smarter.

TravelMate is a compatibility-based social travel platform. It helps travelers discover people with similar budgets, interests, dates, transport preferences, and travel styles, then plan together inside a private trip workspace.

## Live frontend

Production frontend: https://client-lyart-six-40.vercel.app
Production API: https://travelmate-bfqv.onrender.com

The frontend and API are deployed. Authenticated flows require the Render `CLIENT_URL` value to exactly match the frontend origin.

## Current product loop

```text
Create profile → discover or host a trip → compare compatibility
→ send or accept a join request → plan together → track budget and readiness
```

## Implemented capabilities

- Responsive cinematic landing page with a lazy-loaded interactive route globe, transport motion, and accessible SVG fallback
- Editorial destination artwork, animated train/bus/flight cues, and live trip-card previews
- Registration, login, refresh sessions, logout, password recovery, and protected routes
- Traveler profiles and matching preferences
- Trip creation, discovery, filtering, sorting, and pagination
- Explainable compatibility matching with Top-K heap ranking
- Join requests, group membership, and seat protection
- Private workspace with realtime Socket.IO chat
- Collaborative itinerary and polls
- Budget planning, expense splitting, and settlement suggestions
- Activity-based preparation checklists and readiness scoring
- Notifications, traveler reviews, reputation, reports, blocks, and moderation
- Grounded AI trip planner and trip workspace assistant
- Personalized recommendations
- OpenStreetMap geocoding and nearby-place discovery

## Technology

- React, Vite, Tailwind CSS, Framer Motion, Three.js, React Three Fiber, Drei
- React Router, TanStack Query, Axios, Socket.IO Client
- Node.js, Express, MongoDB, Mongoose, Socket.IO
- JWT access tokens with httpOnly refresh cookies
- Gemini, Cloudinary, OpenStreetMap/Nominatim, Overpass

## Local development

### Server

```bash
cd server
npm install
copy .env.example .env
npm run dev
```

### Client

```bash
cd client
npm install
npm run dev
```

Set `VITE_API_URL=http://localhost:5000/api` in `client/.env` when needed. Never commit real credentials.

## Verification

```bash
cd client && npm run lint && npm run build
cd ../server && npm test -- --runInBand
```

## Documentation

- [Architecture](ARCHITECTURE.md)
- [Deployment](docs/DEPLOYMENT.md)
- [Security audit](docs/SECURITY-AUDIT.md)
- [Testing strategy](docs/TESTING.md)
- [Interview guide](docs/INTERVIEW-GUIDE.md)
- [Project status](docs/PROJECT-STATUS.md)

## Scope note

TravelMate is a production-oriented MVP. Live emergency response, identity verification, live location, booking integrations, and commercial partnerships are intentionally not represented as complete features.
