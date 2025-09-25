# <img src="frontend/src/assets/images/logo.png" style="height:64px;margin-right:32px"/> aptosaver

AptoSaver is a DeFi platform built on the Aptos blockchain, enabling fixed-deposit–style crypto savings with high yield and seamless user experience. Users earn 10%+ APY, withdraw anytime with no lock-in, and gain gamified lottery rewards. The protocol auto-optimizes staking for yield and supports fiat onboarding for emerging markets.

***

## Tech Stack

- **Frontend:** Next.js 14
- **Backend Database:** MongoDB
- **Smart Contracts:** Aptos Move language
- **DeFi Protocols:** PanoraSwap (swap aggregator), Cellana Finance (stablecoin staking)
- **Wallet Integration:** Aptos Wallet Adapter
- **Fiat Integration:** MoonPay for direct APT purchases

***

## Features

- High-yield savings on Aptos, auto-swapping with PanoraSwap for optimal stablecoin conversion
- Staking via Cellana Finance pools, targeting ~13% APR, supporting the platform's guaranteed 10%+ APY
- Withdraw funds at any time—no lock-in periods, no penalties
- Gamified lottery rewards drawn from yield above base APY
- Automated yield optimization and restaking for maximal returns
- Periodic reward token claiming and stablecoin compounding
- On-chain randomness via Aptos for unbiased lottery winner selection
- **MoonPay Integration:** Direct fiat-to-APT purchases with automatic wallet deposits
- **Multi-wallet Support:** Compatible with Petra, Martian, and other Aptos wallets

***

## Project Structure

- `/frontend` — Next.js UI frontend with API routes
- `/move` — Aptos Move smart contracts

***

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Aptos CLI** (latest version)
- **MongoDB** (local or cloud instance)
- **Git**

***

## Environment Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/aptosaver.git
cd aptosaver
```

### 2. Environment Variables

Create the following environment files:

**Root `.env` file:**
```bash
# Project Configuration
NEXT_PUBLIC_MOONPAY_API_KEY=<moonpay-api-key>

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/aptosaver
```

**Frontend `.env` file:**
```bash
# Project Configuration
NEXT_PUBLIC_MOONPAY_API_KEY=<moonpay-api-key>

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/aptosaver
```

***

## Installation & Setup

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 2. Initialize Aptos Project

```bash
npm run move:init
```

### 3. Compile Smart Contracts

```bash
npm run move:compile
```

### 4. Run Tests

```bash
npm run move:test
```

### 5. Deploy Smart Contracts

**For Testnet:**
```bash
npm run move:publish
```

### 6. Start Development Server

```bash
# Start frontend development server
cd frontend
npm run dev
```

The application will be available at `http://localhost:3000`

***

## API Endpoints

The application includes the following API routes:

- `POST /api/deposit` - Handle user deposits
- `POST /api/trigger` - Trigger automated processes
- `GET /api/user` - Fetch user data
- Additional endpoints for lottery, withdrawals, and yield optimization

***

## MoonPay Integration

AptoSaver includes MoonPay integration for direct fiat-to-APT purchases:

### Setup
1. Sign up for MoonPay account
2. Get your API keys (test/production)
3. Configure in `.env`
4. Test integration with connected wallet

### Features
- Direct APT purchases with credit/debit cards
- Automatic deposits to connected wallet
- Support for multiple fiat currencies
- Integrated transaction status tracking


***

## Future Scope

- Fixed APY via yield aggregator switching between protocols
- Expanding gamification/incentives
- Multi-chain support beyond Aptos

***