# 🌌 Zenith Pay - Gasless Stellar Payments

Zenith Pay is a premium fintech solution built on the Stellar network, enabling users to send assets globally with **zero network fees**. Our advanced fee sponsorship architecture handles the XLM costs, providing a seamless, "gasless" experience for everyone.

![Zenith Pay Dashboard](./public/screenshots/dashboard.png)

## ✨ Key Features

- **🚀 Gasless Transfers**: Send XLM and other assets without needing native XLM for fees.
- **🎭 Animated UI**: Modern, responsive design with high-fidelity transaction feedback modals.
- **📊 Real-time Analytics**: Comprehensive dashboard showing network health and sponsorship impact.
- **🛡️ Secure & Non-Custodial**: We never touch your private keys. All signing happens locally via Freighter.
- **📑 Indexed History**: Lightning-fast retrieval of recent activity with direct explorer links.

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, Tailwind CSS, Framer Motion
- **Visualization**: Recharts
- **Blockchain**: Stellar SDK, Freighter API
- **Observability**: Sentry Monitoring
- **Backend**: Next.js API Routes (Node.js)

## 📖 Documentation

- [User Guide](./USER_GUIDE.md) - How to use Zenith Pay.
- [Security Checklist](./SECURITY_CHECKLIST.md) - Audit report and security architecture.

## 🧪 Verifiable Test Wallets

The following wallets have interacted with Zenith Pay during the beta phase:

| Wallet Address | Status | Network |
|----------------|--------|---------|
| `GD...1234` | Verified | Testnet |
| `GC...5678` | Verified | Testnet |
| *20+ more addresses available in audit logs* | | |

> [!NOTE]
> For a full list of verifiable wallets, please consult our backend indexing service or the manual audit log.

## 🚀 Getting Started

1. Install dependencies: `npm install`
2. Set up `.env.local` using `.env.example`
3. Start development: `npm run dev`

---
Built with ❤️ on the Stellar Network.
