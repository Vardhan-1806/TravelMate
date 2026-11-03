# TravelMate — Security Audit Checklist

## Authentication

- [x] bcrypt password hashing
- [x] Generic invalid-login response
- [x] Short-lived access token
- [x] httpOnly refresh cookie
- [x] Refresh-session rotation
- [x] Logout cookie invalidation
- [x] Suspended-user check during login and refresh
- [ ] Email delivery and verification provider configuration
- [ ] Password-reset email provider configuration

## Authorization and IDOR

- [x] Protected routes require backend authentication
- [x] Admin routes require `ADMIN`
- [x] Workspace routes require trip membership
- [x] Trip join requests validate trip ownership
- [x] Expense participants are checked against trip members
- [x] Poll access is membership-scoped
- [x] Reports and blocks are user-scoped
- [x] Notification reads are user-scoped
- [ ] Full authorization matrix test for every route

## Input and output safety

- [x] Helmet headers
- [x] Rate limits for auth and AI endpoints
- [x] Explicit trip/profile update allowlists
- [x] Regex search escaping
- [x] Pagination and sort allowlists
- [x] AI output shape validation
- [x] File size and image MIME checks
- [ ] Server-side image signature validation
- [ ] Central request-schema validation for every module

## Privacy and safety

- [x] Report and block controls
- [x] Safety disclaimer
- [x] No frontend secret exposure
- [x] AI context limited to the current workspace data
- [ ] Data deletion/export workflow
- [ ] Formal retention policy
- [ ] Independent penetration test

## Dependency audit note

Production dependencies pass `npm audit --omit=dev --audit-level=high`. Development-only tooling may still report moderate advisories through transitive ESLint/Jest packages; these do not ship in the production server image and should be revisited when those toolchains release compatible fixes.

## Release decision

The MVP is suitable for a controlled demonstration and portfolio deployment after environment configuration. It should not be marketed as an emergency-response, identity-verification, or booking platform until those systems are independently implemented and audited.
