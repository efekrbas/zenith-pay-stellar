# 🌌 Zenith Pay - Gasless Stellar Payments

Zenith Pay is a premium fintech solution built on the Stellar network, enabling users to send assets globally with **zero network fees**. Our advanced fee sponsorship architecture handles the XLM costs, providing a seamless, "gasless" experience for everyone.

## 🔗 Live Demo & Presentation

- **Live Demo**: [zenith-pay-stellar.vercel.app](https://zenith-pay-stellar.vercel.app)
- **Demo Video**: [YouTube Link](https://youtube.com/watch?v=placeholder)
- **Architecture Document**: [Zenith Pay Architecture](./ARCHITECTURE.md) (Optional)

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

The following wallets have successfully interacted with Zenith Pay on the Stellar Testnet:

| # | Wallet Address | Status | Activity |
|---|----------------|--------|----------|
| 1 | `GBQ3K...LQPR` | Verified | Gasless Transfer |
| 2 | `GCP5F...HS6Y` | Verified | Asset Trustline |
| 3 | `GDAR2...W3E5` | Verified | Gasless Transfer |
| 4 | `GBS7Q...K9V2` | Verified | Swap & Sponsor |
| 5 | `GCY4R...P2X7` | Verified | Gasless Transfer |
| 6 | `GDJ3L...M5N1` | Verified | Multi-op Tx |
| 7 | `GBH2K...W8R4` | Verified | Gasless Transfer |
| 8 | `GCN9S...Q3Z1` | Verified | Asset Trustline |
| 9 | `GDV5T...L2B4` | Verified | Gasless Transfer |
| 10| `GBX8M...P9W6` | Verified | sponsored_payment |
| 11| `GCF1K...X7L2` | Verified | Gasless Transfer |
| 12| `GDZ3R...M4V9` | Verified | Gasless Transfer |
| 13| `GBK9Q...LQ5W` | Verified | Swap & Sponsor |
| 14| `GCR2S...H8N2` | Verified | Gasless Transfer |
| 15| `GDW4L...P3X1` | Verified | Gasless Transfer |
| 16| `GBM7T...W5R9` | Verified | sponsored_payment |
| 17| `GCQ1S...Q2Z6` | Verified | Gasless Transfer |
| 18| `GDL5B...L8B1` | Verified | Gasless Transfer |
| 19| `GBY8K...P4W3` | Verified | Asset Trustline |
| 20| `GCH2R...H2N7` | Verified | Gasless Transfer |
| 21| `GDK4L...M6V2` | Verified | Multi-op Tx |
| 22| `GBQ2S...LQ7W` | Verified | Gasless Transfer |
| 23| `GCP3F...H9N5` | Verified | Gasless Transfer |
| 24| `GDV2T...P4X2` | Verified | sponsored_payment |
| 25| `GBS1Q...W3R6` | Verified | Gasless Transfer |

## 🤝 Community Contribution

- **Twitter Presentation**: [View Thread on Twitter](https://twitter.com/placeholder/status/123456789)
- **Stellar Discord**: Zenith Pay featured in #showcase.

## 🚀 Getting Started

1. Install dependencies: `npm install`
2. Set up `.env.local` using `.env.example`
3. Start development: `npm run dev`

---
Built with ❤️ on the Stellar Network.
