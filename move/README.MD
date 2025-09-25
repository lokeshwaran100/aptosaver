# AptoSaver Smart Contracts

AptoSaver's Move smart contracts implement a high-yield crypto savings platform on Aptos blockchain with automated yield optimization, gamified rewards, and seamless user experience.

## 🏗 Architecture Overview

The AptoSaver protocol consists of several interconnected smart contracts that manage:

- **User Deposits**: Secure deposit and withdrawal mechanisms
- **Lottery System**: Gamified rewards with on-chain randomness
- **Asset Management**: Integration with PanoraSwap and Cellana Finance
- **Fee Management**: Protocol fee collection and distribution

## 🔧 Core Features

### High-Yield Savings
- **Guaranteed 10%+ APY**: Fixed minimum returns for users
- **Auto-Optimization**: Automated yield farming across protocols
- **No Lock-in**: Withdraw funds anytime without penalties
- **Compound Interest**: Automatic reinvestment of earned yields

### Gamification Layer
- **Lucky Draw System**: Lottery rewards from excess yield
- **On-chain Randomness**: Fair and transparent winner selection
- **Bonus Rewards**: Additional incentives for long-term savers

## 📋 Smart Contract Functions

### User Operations

```move
// Deposit assets into the savings pool
public entry fun deposit(account: &signer, amount: u64)

// Withdraw assets from the savings pool
public entry fun withdraw(account: &signer, amount: u64)

// Claim accumulated rewards
public entry fun claim_rewards(account: &signer)

// Check user balance and earned rewards
public fun get_user_info(user_addr: address): (u64, u64)
```

## 🚀 Deployment

### Prerequisites
- Aptos CLI installed
- Funded Aptos account
- Move compiler setup

### Compilation
```bash
# Compile the Move contracts
npm run move:compile
```

### Testing
```bash
# Run comprehensive tests
npm run move:test
```

### Deployment
```bash
# Deploy to testnet
npm run move:publish

# Verify deployment
aptos account list --query modules --account <deployed_address>
```

For detailed contribution guidelines, see the main project README.
