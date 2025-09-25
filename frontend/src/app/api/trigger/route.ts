import { NextResponse, NextRequest } from "next/server";
import mongoose from "mongoose";
import { Document } from "@/lib/connectDB";
import {
  cellTokenPrice,
  claimRewards,
  getLotteryWinner,
  getRewardAmount,
  pickWinner,
  swapCellToApt,
  swapCellToWusdc,
} from "@/lib/apiRequests";
import { AccountAddress, MoveVector, Serializer } from "@aptos-labs/ts-sdk";
import axios from "axios";

const mongoURI = process.env.NEXT_PUBLIC_MONGODB_URI;

if (!mongoURI) {
  throw new Error("MONGODB_URI is not defined in the environment variables.");
}
mongoose.connect(mongoURI).then(() => console.log("Connected! to db"));

export const POST = async (request: NextRequest) => {
  try {
    // Environment variable to control PanoraSwap API calls (default: true)
    const enablePanoraSwap = process.env.NEXT_PUBLIC_ENABLE_PANORASWAP !== 'false';
    
    const existingUsers = await Document.find({});
    if (!existingUsers) {
      return NextResponse.json({ error: "Not registered users" }, { status: 409 });
    }

    const eligibleUsers = existingUsers.filter((item) => item.totalDeposits !== 0).map((item) => item.address);

    const totalDeposits = existingUsers.reduce((sum, item) => {
      return sum + item.totalDeposits;
    }, 0);

    let cellTokenPriceInUsd = 0;
    if (enablePanoraSwap) {
      cellTokenPriceInUsd = await cellTokenPrice();
    } else {
      console.log("PanoraSwap calls disabled - skipping cellTokenPrice");
    }
    
    const totalDepositsFivePercentage = totalDeposits * 0.05;
    const totalDepositsFivePercentagePerDay = totalDepositsFivePercentage / 365;
    // const totalDepositsFivePercentagePerDayInCell = totalDepositsFivePercentagePerDay / cellTokenPriceInUsd
    // const amount = BigInt(Math.round(totalDepositsFivePercentagePerDayInCell * 1e6) * 10 ** 8);
    const lotteryAmount = BigInt(Math.round(totalDepositsFivePercentagePerDay * 1e6));

    // const rewardAmount = await getRewardAmount();
    const rewardAmount = parseInt((await getRewardAmount()) as string) / 1e8;
    console.log("rewardAmount", rewardAmount);
    const claimRewardResponse = await claimRewards();
    console.log("claimRewardResponse", claimRewardResponse);

    if (rewardAmount >= 0.001) {
      // console.log("rewardAmount", rewardAmount)
      // const rewardAmountInStr = (parseInt(rewardAmount as string) / 1e8).toString()
      // const rewardAmountInStr = "0.001"
      if (enablePanoraSwap) {
        const swapCellToWusdcResponse = await swapCellToWusdc(rewardAmount.toString());
        console.log("swapCellToWusdcResponse", swapCellToWusdcResponse);
      } else {
        console.log("PanoraSwap calls disabled - skipping swapCellToWusdc");
      }

      const pickWinnerResponse = await pickWinner(eligibleUsers, lotteryAmount);
      console.log("pickWinnerResponse", pickWinnerResponse);

      const addressWon = await getLotteryWinner();

      console.log("winner", addressWon);

      const respone = await axios.put("/api/user", {
        params: { address: addressWon, rewardsWon: totalDepositsFivePercentagePerDay, wonToday: true  },
      });

      console.log("response", respone);
    }

    return NextResponse.json({ message: "Winner picked successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error in POST:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
