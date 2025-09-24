import { NextResponse, NextRequest } from "next/server";
import mongoose from "mongoose";
import { client, Document } from "@/lib/connectDB";

const mongoURI = process.env.NEXT_PUBLIC_MONGODB_URI;

if (!mongoURI) {
  throw new Error("MONGODB_URI is not defined in the environment variables.");
}
mongoose.connect(mongoURI).then(() => console.log("Connected! to db"));

export const GET = async (request: NextRequest) => {
  try {
    const url = new URL(request.url);
    const address = url.searchParams.get("address");

    if (!address) {
      return NextResponse.json({ error: "Address parameter is required" }, { status: 400 });
    }

    const user = await Document.findOne({ address });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        address: user.address,
        totalDeposits: user.totalDeposits,
        depositTimestamp: user.depositTimestamp,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in GET:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { address, totalDeposits, depositTimestamp } = body;

    if (!address) {
      return NextResponse.json({ error: "Address is required" }, { status: 400 });
    }

    if (!totalDeposits && !depositTimestamp) {
      return NextResponse.json(
        { error: "At least one of totalDeposits or depositTimestamp must be provided" },
        { status: 400 },
      );
    }

    // Find the user by address and update, or create if doesn't exist
    const updateData: { totalDeposits?: string; depositTimestamp?: string } = {};
    if (totalDeposits !== undefined) updateData.totalDeposits = totalDeposits;
    if (depositTimestamp !== undefined) updateData.depositTimestamp = depositTimestamp;

    const user = await Document.findOneAndUpdate({ address }, { $set: updateData }, { new: true, upsert: true });

    return NextResponse.json(
      {
        message: "User deposit information updated successfully",
        user: {
          address: user.address,
          totalDeposits: user.totalDeposits,
          depositTimestamp: user.depositTimestamp,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in POST:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
