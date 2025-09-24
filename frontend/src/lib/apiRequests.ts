import {
    Aptos,
    Account,
    Ed25519PrivateKey,
    Serializer,
    MoveVector,
    U64,
    Network,
    AptosConfig,
    InputViewFunctionData,
} from "@aptos-labs/ts-sdk";
import Panora from "@panoraexchange/swap-sdk";

const APTOS_COIN = "0x1::aptos_coin::AptosCoin";
const wUSDC_TOKEN = "0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T";
const zUSDC_TOKEN = "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC";
const CELL_TOKEN = "0x2ebb2ccac5e027a87fa0e2e5f656a3a4238d6a48d93ec9b610d570fc0aa0df12";
const toWalletAddress = "0xfff0b85abd60c84d99ea725cede9d711276c09e2ec435a45777df0ca933b27cc";
const cellanaAddress = "0x4bf51972879e3b95c4781a5cdcb9e1ee24ef483e7d22f2d903626f126df62bd1";
const aptosaverAddress = "0xfff0b85abd60c84d99ea725cede9d711276c09e2ec435a45777df0ca933b27cc";

const privateKey = process.env.NEXT_PUBLIC_ADMIN_PK as string;

const aptos_mainnet = new Aptos(new AptosConfig({ network: Network.MAINNET }));
const aptos_devnet = new Aptos(new AptosConfig({ network: Network.TESTNET }));
const admin = Account.fromPrivateKey({
    privateKey: new Ed25519PrivateKey(privateKey),
});

// Initialize the Panora client
const client = new Panora({
    // apiKey: "oLujOsvnXgFY9TjN5VxS@u@kmq+wWjcyTEnVL4LEPf5pwNtYdR90EfeBDj33F^4E",
    apiKey: "a4^KV_EaTf4MW#ZdvgGKX#HUD^3IFEAOV_kzpIE^3BQGA8pDnrkT7JcIy#HNlLGi"
});

export async function swapAptToWUsdc(amount: string) {
    return await panoraSwap(APTOS_COIN, wUSDC_TOKEN, amount, toWalletAddress, privateKey);
}

export async function swapAptToZUsdc(amount: string) {
    return await panoraSwap(APTOS_COIN, zUSDC_TOKEN, amount, toWalletAddress, privateKey);
}

export async function swapWUsdcToApt(amount: string) {
    return await panoraSwap(wUSDC_TOKEN, APTOS_COIN, amount, toWalletAddress, privateKey);
}

export async function swapZUsdcToApt(amount: string) {
    return await panoraSwap(zUSDC_TOKEN, APTOS_COIN, amount, toWalletAddress, privateKey);
}

export async function swapCellToApt(amount: string) {
    return await panoraSwap(CELL_TOKEN, APTOS_COIN, amount, toWalletAddress, privateKey);
}

export async function swapCellToWusdc(amount: string) {
    return await panoraSwap(CELL_TOKEN, wUSDC_TOKEN, amount, toWalletAddress, privateKey);
}

//@ts-ignore
export async function panoraSwap(fromTokenAddress, toTokenAddress, fromTokenAmount, toWalletAddress, privateKey) {
    try {
        const response = await client.ExactInSwap(
            {
                chainId: "1",
                // "fromTokenAddress": "0x1::aptos_coin::AptosCoin",
                // "fromTokenAddress": "0x2ebb2ccac5e027a87fa0e2e5f656a3a4238d6a48d93ec9b610d570fc0aa0df12",
                // "toTokenAddress": "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC",
                // "toTokenAddress": "0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T",
                // "toTokenAddress": "0x1::aptos_coin::AptosCoin",
                fromTokenAddress: fromTokenAddress,
                toTokenAddress: toTokenAddress,

                fromTokenAmount: fromTokenAmount,
                toWalletAddress: toWalletAddress,
                slippagePercentage: String(5),
            },
            privateKey,
        );
        return response;
    } catch (error) {
        console.error("Error during swap:", error);
        throw error;
    }
}

export async function cellTokenPrice() {
    return await panoraTokenPrice(CELL_TOKEN);
}

//@ts-ignore
export async function wUsdcToAptAmount(amount) {
    return await panoraAptosAmount(wUSDC_TOKEN, amount);
}

//@ts-ignore
export async function zUsdcToAptAmount(amount) {
    return await panoraAptosAmount(zUSDC_TOKEN, amount);
}

//@ts-ignore
export async function cellToAptAmount(amount) {
    return await panoraAptosAmount(CELL_TOKEN, amount);
}

//@ts-ignore
export async function panoraTokenPrice(tokenAddress) {
    try {
        const response = await client.ExactInSwapQuote(
            {
                "chainId": "1",
                "fromTokenAddress": tokenAddress,
                "toTokenAddress": APTOS_COIN,
                "fromTokenAmount": "1",
            },
        );
        const tokenPriceInUsd = parseFloat(response.quotes[0].toTokenAmountUSD)
        return tokenPriceInUsd;
    } catch (error) {
        console.error("Error while checking quote:", error);
        throw error;
    }
}

export async function aptosPriceInUsd() {
    return await panoraTokenPriceInUsd(APTOS_COIN);
}

//@ts-ignore
export async function panoraTokenPriceInUsd(tokenAddress) {
    try {
        const response = await client.ExactInSwapQuote(
            {
                "chainId": "1",
                "fromTokenAddress": tokenAddress,
                "toTokenAddress": wUSDC_TOKEN,
                "fromTokenAmount": "1",
            },
        );
        const tokenPriceInUsd = parseFloat(response.quotes[0].toTokenAmountUSD)
        return tokenPriceInUsd;
    } catch (error) {
        console.error("Error while checking quote:", error);
        throw error;
    }
}

//@ts-ignore
export async function panoraAptosAmount(tokenAddress, amount) {
    try {
        const response = await client.ExactInSwapQuote(
            {
                "chainId": "1",
                "fromTokenAddress": tokenAddress,
                "toTokenAddress": APTOS_COIN,
                "fromTokenAmount": amount,
            },
        );
        // console.log("response", response)
        const tokenPriceInUsd = parseFloat(response.quotes[0].toTokenAmount)
        return tokenPriceInUsd;
    } catch (error) {
        console.error("Error while checking quote:", error);
        throw error;
    }
}

//@ts-ignore
export async function stakeWusdcZusdcPair(wUsdcAmount, zUsdcAmount) {
    const transaction = await aptos_mainnet.transaction.build.simple({
        sender: admin.accountAddress,
        data: {
            function: `${cellanaAddress}::router::add_liquidity_and_stake_both_coins_entry`,
            typeArguments: [wUSDC_TOKEN, zUSDC_TOKEN],
            functionArguments: [true, wUsdcAmount, zUsdcAmount],
        },
    });

    const committedTxn = await aptos_mainnet.signAndSubmitTransaction({
        signer: admin,
        transaction: transaction,
    });
    const response = await aptos_mainnet.waitForTransaction({ transactionHash: committedTxn.hash, options: { checkSuccess: true } });
    return response;
}

//@ts-ignore
export async function unstakeWusdcZusdcPair(lpToken) {
    const transaction = await aptos_mainnet.transaction.build.simple({
        sender: admin.accountAddress,
        data: {
            function: `${cellanaAddress}::router::unstake_and_remove_liquidity_both_coins_entry`,
            typeArguments: [wUSDC_TOKEN, zUSDC_TOKEN],
            functionArguments: [true, lpToken, 0, 0, admin.accountAddress],
        },
    });

    const committedTxn = await aptos_mainnet.signAndSubmitTransaction({
        signer: admin,
        transaction: transaction,
    });
    const response = await aptos_mainnet.waitForTransaction({ transactionHash: committedTxn.hash, options: { checkSuccess: true } });
    return response;
}

//@ts-ignore
export async function claimRewards() {
    const transaction = await aptos_mainnet.transaction.build.simple({
        sender: admin.accountAddress,
        data: {
            function: `${cellanaAddress}::vote_manager::claim_emissions_entry`,
            // typeArguments: [wUSDC_TOKEN, zUSDC_TOKEN],
            functionArguments: ["0xcfaadbe8c0cc5c7cdaa3aefd7c184830d12f2991d1ae70176337550b155a1780"],
        },
    });

    const committedTxn = await aptos_mainnet.signAndSubmitTransaction({
        signer: admin,
        transaction: transaction,
    });
    const response = await aptos_mainnet.waitForTransaction({ transactionHash: committedTxn.hash, options: { checkSuccess: true } });
    return response;
}

//@ts-ignore
export async function getRewardAmount() {
    const payload: InputViewFunctionData = {
        function: `${cellanaAddress}::vote_manager::claimable_emissions`,
        functionArguments: [admin.accountAddress, "0xcfaadbe8c0cc5c7cdaa3aefd7c184830d12f2991d1ae70176337550b155a1780"],
    };

    const amount = (await aptos_mainnet.view({ payload }))[0];

    return amount
}

//@ts-ignore
export async function getQuotePrice(amount) {
    const payload: InputViewFunctionData = {
        function: `${cellanaAddress}::router::quote_liquidity`,
        functionArguments: [
            "0x328bb941e08d742bb25f764acb088999698d28c777344568b526244524d9c2e7",
            "0x50fdfa97914bd00b656e3041e143f157c84931eb1ca7224b8a8570e7d5be70f2",
            true,
            amount],
    };

    const quoteAmount = (await aptos_mainnet.view({ payload }))[0];

    return quoteAmount
}

//@ts-ignore
export async function getLpTokenAmount() {
    const payload: InputViewFunctionData = {
        function: `${cellanaAddress}::liquidity_pool::liquidity_amounts`,
        functionArguments: [
            "0xcfaadbe8c0cc5c7cdaa3aefd7c184830d12f2991d1ae70176337550b155a1780"],
    };

    const quoteAmount = (await aptos_mainnet.view({ payload }))[0];

    return quoteAmount
}

//@ts-ignore
export async function deposit(user, amount, signTransaction) {
    const transaction = await aptos_devnet.transaction.build.multiAgent({
        sender: admin.accountAddress,
        secondarySignerAddresses: [user.address],
        data: {
            function: `${aptosaverAddress}::aptosaver::deposit`,
            functionArguments: [amount],
        },
    });

    const adminSenderAuthenticator = aptos_devnet.transaction.sign({
        signer: admin,
        transaction: transaction,
    });

    const userSenderAuthenticator = await signTransaction(transaction, false);

    const committedTxn = await aptos_devnet.transaction.submit.multiAgent({
        transaction,
        senderAuthenticator: adminSenderAuthenticator,
        additionalSignersAuthenticators: [userSenderAuthenticator],
    });

    const response = await aptos_devnet.waitForTransaction({ transactionHash: committedTxn.hash });
    return response;
}

//@ts-ignore
export async function withdraw(user, amount, signTransaction) {
    const transaction = await aptos_devnet.transaction.build.multiAgent({
        sender: admin.accountAddress,
        secondarySignerAddresses: [user.address],
        data: {
            function: `${aptosaverAddress}::aptosaver::withdraw`,
            functionArguments: [amount],
        },
    });

    const adminSenderAuthenticator = aptos_devnet.transaction.sign({
        signer: admin,
        transaction: transaction,
    });

    const userSenderAuthenticator = await signTransaction(transaction, false);

    const committedTxn = await aptos_devnet.transaction.submit.multiAgent({
        transaction,
        senderAuthenticator: adminSenderAuthenticator,
        additionalSignersAuthenticators: [userSenderAuthenticator],
    });

    const response = await aptos_devnet.waitForTransaction({ transactionHash: committedTxn.hash });
    return response;
}

//@ts-ignore
export async function pickWinner(users, amount) {
    const transaction = await aptos_devnet.transaction.build.simple({
        sender: admin.accountAddress,
        data: {
            function: `${aptosaverAddress}::aptosaver::pick_winner`,
            functionArguments: [users, amount],
        },
    });

    const committedTxn = await aptos_devnet.signAndSubmitTransaction(
        {
            signer: admin,
            transaction: transaction
        });
    const response = await aptos_devnet.waitForTransaction({ transactionHash: committedTxn.hash });
    return response
}

//@ts-ignore
export async function claimLottery(user, signTransaction) {
    const transaction = await aptos_devnet.transaction.build.multiAgent({
        sender: admin.accountAddress,
        secondarySignerAddresses: [user.address],
        data: {
            function: `${aptosaverAddress}::aptosaver::claim`,
            functionArguments: [],
        },
    });

    const adminSenderAuthenticator = aptos_devnet.transaction.sign({
        signer: admin,
        transaction: transaction,
    });

    const userSenderAuthenticator = await signTransaction(transaction, false);

    const committedTxn = await aptos_devnet.transaction.submit.multiAgent({
        transaction,
        senderAuthenticator: adminSenderAuthenticator,
        additionalSignersAuthenticators: [userSenderAuthenticator],
    });

    const response = await aptos_devnet.waitForTransaction({ transactionHash: committedTxn.hash });
    return response;
}

export async function getLotteryAmount() {
    const payload: InputViewFunctionData = {
        function: `${aptosaverAddress}::aptosaver::lottery`,
    };

    const amount = (await aptos_devnet.view({ payload }))[0];

    return amount?.toString()
}

export async function getLotteryWinner() {
    const payload: InputViewFunctionData = {
        function: `${aptosaverAddress}::aptosaver::lottery_winner`,
    };

    const address = (await aptos_devnet.view({ payload }))[0];

    return address?.toString()
}

