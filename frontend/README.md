# AptoSaver Frontend

The frontend application for AptoSaver - a DeFi platform built on Aptos blockchain enabling high-yield crypto savings with gamified rewards and seamless user experience.

This Next.js application provides a modern, responsive interface for users to interact with AptoSaver's smart contracts, manage their crypto savings, participate in lottery draws, and access fiat onramp services.

## 🚀 Features

- **Modern UI/UX**: Built with Next.js 14, TailwindCSS, and Framer Motion
- **Wallet Integration**: Multi-wallet support via Aptos Wallet Adapter
- **DeFi Operations**: Deposit, withdraw, and yield optimization
- **Gamification**: Lucky draw system with on-chain randomness
- **Fiat Onramp**: MoonPay integration for direct APT purchases
- **Real-time Updates**: Live APY tracking and portfolio management
- **Mobile Responsive**: Optimized for all device sizes

## 🛠 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS + Framer Motion
- **Blockchain**: Aptos SDK + Wallet Adapter
- **Database**: MongoDB with Mongoose
- **UI Components**: Radix UI + Custom components
- **Payments**: MoonPay React SDK
- **State Management**: React Context + TanStack Query

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── app/               # Main application page
│   ├── lucky-draw/        # Lottery/gamification
│   ├── profile/           # User profile
│   └── withdraw/          # Withdrawal interface
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── WalletConnector/  # Wallet integration
│   └── ...               # Feature components
├── constants/            # App constants
├── context/              # React contexts
└── lib/                  # Utilities and API calls
```

## 🔧 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MongoDB instance

### Environment Setup

Create a `.env` file in the frontend directory:

```bash
# MoonPay Configuration
NEXT_PUBLIC_MOONPAY_API_KEY=<your-moonpay-api-key>

# Database
MONGODB_URI=mongodb://localhost:27017/aptosaver
```

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🏗 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔗 Key Components

### Wallet Integration
- **WalletSelector**: Multi-wallet connection interface
- **WalletProvider**: Wallet state management
- Supports Petra, Martian, and other Aptos wallets

### DeFi Features
- **ClaimDeposit**: Deposit management interface
- **AuthForm**: User authentication and profile
- **Yield Optimization**: Automated staking strategies

### Gamification
- **Lucky Draw**: Lottery system with confetti effects
- **Reward Tracking**: APY and bonus calculations

### Fiat Integration
- **MoonPay Widget**: Direct fiat-to-APT purchases
- **Transaction Tracking**: Payment status monitoring

## 🎨 UI/UX Features

- **Dark Theme**: Modern dark mode interface
- **Animations**: Smooth Framer Motion transitions
- **Responsive Design**: Mobile-first approach
- **Loading States**: Skeleton loaders and spinners
- **Toast Notifications**: User feedback system

## 🔌 API Integration

The frontend communicates with:
- **Aptos Blockchain**: Via @aptos-labs/ts-sdk
- **Backend APIs**: MongoDB-based user data
- **MoonPay**: Fiat payment processing
- **PanoraSwap**: Token swapping
- **Cellana Finance**: Yield generation

For detailed contribution guidelines, see the main project README.
