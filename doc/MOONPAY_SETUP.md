# MoonPay Integration Setup

## Overview
The MoonPay integration allows users to buy Aptos (APT) directly with fiat currency and have it deposited into their connected wallet.

## Setup Instructions

### 1. Environment Variables
Create a `.env.local` file in the frontend directory with the following content:

```bash
# MoonPay API Configuration
NEXT_PUBLIC_MOONPAY_API_KEY=pk_test_ipsatS3brsLguHTjxgIAa2Y6a6RBqSm

# For production, replace with your production MoonPay API key:
# NEXT_PUBLIC_MOONPAY_API_KEY=pk_live_your_production_key_here
```

### 2. MoonPay Configuration
The integration is configured to:
- Buy APT (Aptos) tokens instead of ETH
- Use the connected wallet address for direct deposits
- Handle transaction completion and widget closure
- Show appropriate states based on wallet connection

### 3. Features
- **Wallet Integration**: Automatically uses the connected Aptos wallet address
- **Currency Support**: Configured for USD to APT conversion
- **Direct Deposits**: Purchased APT is sent directly to the user's wallet
- **Error Handling**: Proper error states and user feedback
- **Responsive UI**: Button states change based on wallet connection

### 4. Usage
1. User connects their Aptos wallet
2. User clicks "Buy APT" button
3. MoonPay widget opens with pre-filled wallet address
4. User completes fiat purchase
5. APT tokens are deposited directly into their wallet

### 5. Testing
- Test with wallet connected and disconnected states
- Verify the widget opens with correct parameters
- Check that wallet address is properly passed to MoonPay
- Test transaction completion flow

### 6. Production Deployment
Before deploying to production:
1. Replace the test API key with your production MoonPay API key
2. Test thoroughly on testnet first
3. Ensure proper error handling and user feedback
4. Monitor transaction success rates

## Troubleshooting

### Widget Not Loading
- Check that the MoonPay API key is correctly set in environment variables
- Verify that the `@moonpay/moonpay-react` package is properly installed
- Check browser console for any JavaScript errors

### Wallet Address Not Passed
- Ensure the wallet is properly connected before opening the widget
- Check that `account?.address` is available in the component
- Verify the wallet address format is compatible with MoonPay

### Currency Issues
- Confirm that MoonPay supports APT purchases in your region
- Check that `defaultCurrencyCode="apt"` is correctly configured
- Verify base currency settings match your requirements
