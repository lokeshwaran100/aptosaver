# <img src="app/src/assets/images/logo.png" style="height:64px;margin-right:32px"/> aptosaver
AptoSaver is a DeFi platform built on the Aptos blockchain, combining fixed-deposit–style familiarity with a high-yield crypto savings product. It offers 10%+ APY, no lock-in withdrawals, gamified lottery rewards, and automated yield optimization with seamless fiat onramps targeted at emerging markets.

## Tech Stack

- **Frontend:** Next.js
- **Backend Database:** MongoDB
- **Smart Contracts:** Aptos Move language

## Features

- High-yield savings with stablecoins via Panora Swap and Cellana Finance
- Withdraw anytime, no lock-in period or penalties
- Lottery rewards on yield above guaranteed 10% APY
- Automated staking optimization for best yield protocols
- Periodic reward token claiming, swapping to stablecoins, and restaking
- Fiat onramp support for easy onboarding, especially in India and Africa (Future Scope)

## Project Structure

- `/app` — Next.js application for user interface
- `/move` — Aptos Move smart contract modules for on-chain logic and fund management

## Getting Started

1. Clone the repository
2. Setup MongoDB and configure connection string
3. Deploy Move smart contracts to Aptos testnet/mainnet
4. Run Next.js frontend and backend API server
5. Start interacting with AptoSaver for optimized DeFi savings

## Future Scope

- Enhanced yield aggregator with dynamic protocol switching
- More gamified incentives and user engagement features
- Multi-chain support beyond Aptos
- Advanced fiat payment integrations