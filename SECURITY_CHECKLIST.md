# Zenith Pay Security Checklist & Audit Report

This document outlines the security architecture, key management practices, and audit procedures for the Zenith Pay Stellar application.

## 🔐 1. Private Key Management

- **Client-Side (User Keys)**:
    - User private keys are NEVER handled by Zenith Pay.
    - We utilize [Freighter](https://www.stellar.org/freighter/) (or similar hardware/software wallets) for secure, non-custodial transaction signing.
    - Transactions are signed in the client's browser using the wallet extension.

- **Server-Side (Sponsor Keys)**:
    - The `SPONSOR_SECRET_KEY` is stored exclusively in environment variables (`.env`).
    - This key is only accessed within server-side API routes (`/api/sponsor`).
    - The sponsor account is restricted to fee sponsorship only to minimize risk in case of exposure.

## 🛡️ 2. Secure Transaction Signing Flows

- **Gasless Sponsorship Architecture**:
    - Users sign their own transactions locally using Freighter.
    - Signed transaction envelopes are sent to the `/api/sponsor` endpoint.
    - **Server-Side Validation**: Before sponsoring, the API validates the transaction:
        - Ensures it stays within reasonable operation counts (max 5).
        - Enforces maximum transaction amounts (e.g., 1000 units).
        - Restricts operations to safe types (`payment`, `pathPayment`).
    - The server then wraps the user's transaction with a Fee Bump transaction using the sponsor key.

## 🚀 3. Dependency Audits

- **Regular Audits**:
    - Automated `npm audit` is performed during CI/CD (Github Actions).
    - Dependencies are pinned to specific versions in `package-lock.json` to prevent supply-chain attacks.
- **Monitoring**:
    - Sentry integration provides real-time alerts for any runtime errors or unexpected library behavior.

## 📊 4. Current Audit Status

| Feature | Status | Implementation Detail |
|---------|--------|-----------------------|
| Rate Limiting | ✅ Active | IP-based limiting (5 req / 15 min) |
| Tx Validation | ✅ Active | Fee sponsorship limits & op type checks |
| Error Tracking | ✅ Active | Sentry Next.js SDK integration |
| Key Isolation | ✅ Active | Sponsor keys never leave the server |

## 📝 5. Operational Security (OpSec)

1.  **Environment Variables**: All sensitive keys are excluded from version control via `.gitignore`.
2.  **Input Sanitization**: All user-provided addresses and amounts are validated before processing.
3.  **Stellar Network Rules**: Adherence to Stellar network best practices (e.g., sequence number handling, timeouts).

---
*Last Security Audit: 2026-03-22*
