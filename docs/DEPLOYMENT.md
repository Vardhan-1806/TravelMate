# TravelMate — Deployment Runbook

## Production topology

```text
Vercel/Netlify frontend
        ↓ HTTPS
Render Express + Socket.IO API
        ↓
MongoDB Atlas
        ├── Cloudinary image storage
        ├── Gemini AI
        └── OpenStreetMap services
```

## Current deployment

- Frontend: https://client-lyart-six-40.vercel.app
- Backend: not deployed yet

The frontend currently needs a production `VITE_API_URL` pointing to the Render API before login, trips, chat, AI, maps, and other authenticated features work on the public URL.

## Required server variables

```text
NODE_ENV=production
PORT=10000
MONGO_URI=...
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
CLIENT_URL=https://app.example.com
GEMINI_API_KEY=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

Use unique secrets for production. Store them only in the hosting provider's secret manager.

## Release checklist

1. Create a separate MongoDB Atlas production database.
2. Restrict Atlas network access to the backend deployment where practical.
3. Configure frontend and API under the same parent domain to keep secure cookies same-site.
4. Set the exact frontend origin in `CLIENT_URL`. The production refresh cookie uses `SameSite=None; Secure` because the current Vercel and Render hosts are different sites.
5. Configure Cloudinary upload limits and allowed formats.
6. Set Gemini quotas and monitor AI request costs.
7. Run client lint/build and server tests in CI.
8. Verify `/api/health` after deployment.
9. Test login, refresh, Socket.IO connection, trip creation, and a protected workspace.
10. Confirm logs do not contain tokens, passwords, or full request bodies.

## CI recommendation

The pipeline should run:

```text
npm ci → lint → build → server tests → dependency audit
```

Deployment should only proceed from the protected main branch after checks pass.

## Operational limitations

Free-tier services may sleep, throttle requests, or limit WebSocket reliability. Treat the free tier as a demonstration environment, not a guaranteed production SLA.
