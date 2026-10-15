# Security Specification for VaultLedger AI

## 1. Data Invariants
1. User profile document at `/users/{userId}` can only be read and written by the authenticated owner (`request.auth.uid == userId`).
2. Receipts at `/users/{userId}/receipts/{receiptId}` strictly belong to `userId`.
3. An unauthenticated user cannot read, write, or list any receipts.
4. An authenticated user cannot access or query another user's receipts.
5. All receipt writes must include valid vendor, amount, category, date, and valid ID fields without oversized strings.
6. System-wide default deny rule protects any unmapped collection.

## 2. Dirty Dozen Payloads (Expected to be REJECTED with PERMISSION_DENIED)
1. Unauthenticated read of `/users/{userId}/receipts/{receiptId}` -> REJECTED
2. Unauthenticated create of a receipt -> REJECTED
3. User A attempting to read `/users/{userB}/receipts/{receiptId}` -> REJECTED
4. User A attempting to write `/users/{userB}/receipts/{receiptId}` -> REJECTED
5. Document ID poisoning with string > 128 chars -> REJECTED
6. Missing required `vendor` or `amount` -> REJECTED
7. Negative amount or non-numeric amount -> REJECTED
8. Blanket list query across all users' collections -> REJECTED
9. Setting `userId` in body to another user's UID -> REJECTED
10. Injecting arbitrary unexpected root collections (e.g. `/system_configs`) -> REJECTED
11. Updating immutable fields (`createdAt` / `userId`) -> REJECTED
12. Overflow payload with oversized notes > 2000 chars -> REJECTED
