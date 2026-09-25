# Security Specification - FloodGuard AI

## 1. Data Invariants
1. A citizen (public user) can never elevate their own role to 'authority'.
2. Public users and unauthenticated visitors may read active broadcast alerts (`/alerts/{alertId}`).
3. Only authenticated users with an authorized role of `authority` can create or modify flood alerts in `/alerts/{alertId}`.
4. Alerts cannot have unbounded strings (message size <= 1000 characters).
5. Document IDs must conform to `isValidId` (`^[a-zA-Z0-9_\-]+$`, length <= 128).
6. Response actions (`/emergency_actions/{actionId}`) may only be modified by authorized emergency management personnel.
7. User profiles (`/users/{userId}`) can only be read by the owner or an authority officer; users cannot alter their own `role` field.

## 2. The "Dirty Dozen" Threat Payloads
1. **Public User Alert Creation**: Public user with role='public' sends POST payload to `/alerts/alert-fake` trying to create a fake panic alert -> Expected: PERMISSION_DENIED.
2. **Anonymous Alert Insertion**: Unauthenticated client attempts to create an alert -> Expected: PERMISSION_DENIED.
3. **Role Escalation Attack**: Public user updates `/users/{uid}` with `{ "role": "authority" }` -> Expected: PERMISSION_DENIED.
4. **Huge String DOS Payload**: Malicious user attempts to create an alert with a 500KB message string -> Expected: PERMISSION_DENIED.
5. **Ghost Field Injection**: User attempts to inject `{ "superAdminOverride": true }` into an alert -> Expected: PERMISSION_DENIED.
6. **Path Traversal / Malicious ID**: Client writes to `/alerts/../../../system` -> Expected: PERMISSION_DENIED.
7. **Cross-User Profile Hijack**: User A attempts to write to `/users/{userB_uid}` -> Expected: PERMISSION_DENIED.
8. **Invalid Severity Injection**: User sends an alert with severity='nuclear_catastrophe' outside enum -> Expected: PERMISSION_DENIED.
9. **Status Shortcutting**: Unauthorized user attempts to mark active alerts as resolved -> Expected: PERMISSION_DENIED.
10. **Blanket Query Scraping**: Malicious client attempts unauthenticated collection wipe or bulk dump on `/users` -> Expected: PERMISSION_DENIED.
11. **Non-boolean Completion Field**: Update to `/emergency_actions` where `completed: "true_string"` instead of boolean -> Expected: PERMISSION_DENIED.
12. **Malformed User Profile Creation**: Client registers with missing required fields in `/users/{uid}` -> Expected: PERMISSION_DENIED.
