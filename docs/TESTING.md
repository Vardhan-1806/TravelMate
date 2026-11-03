# TravelMate — Testing Strategy

## Commands

```bash
cd client
npm run lint
npm run build

cd ../server
npm test -- --runInBand
```

## Current automated coverage

- Authentication registration and password hashing
- Duplicate registration
- Generic login errors and user-enumeration protection
- Protected-route rejection
- Trip creation field allowlisting
- Public trip discovery and date overlap
- Invalid trip identifier handling
- Expense settlement algorithm

## High-risk cases to keep testing

1. Two users accepting the last seat concurrently
2. A non-member requesting workspace data
3. A user reading another user's notification
4. A user modifying another user's itinerary item
5. Duplicate poll votes
6. Invalid custom expense splits
7. Invalid report targets
8. Refresh-cookie rotation and logout
9. Socket messages from non-members
10. AI provider timeout and malformed output

## Manual smoke test

```text
Register → login → complete profile → host trip
→ open discovery as another user → inspect match
→ request to join → accept request → open workspace
→ send chat → add itinerary → create poll → record expense
→ generate checklist → ask grounded assistant → submit review
```

## Performance checks

- Lighthouse mobile/desktop review
- Discovery query with pagination and indexes
- Socket.IO message burst test
- AI rate-limit test
- Image upload size and format test
