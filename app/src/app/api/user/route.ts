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
    const getAllAddresses = url.searchParams.get("getAllAddresses");
    const getAllData = url.searchParams.get("getAllData");

    if (getAllData === "true") {
      // Fetch all data from Document
      const data = await Document.find({}).lean();

      return NextResponse.json(data, { status: 200 });
    } else if (getAllAddresses === "true") {
      // Fetch all addresses
      const addresses = await Document.find({}, "address").lean();

      return NextResponse.json(
        {
          addresses: addresses.map((user) => user.address),
        },
        { status: 200 },
      );
    } else {
      // Existing logic for fetching a single user's details
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
          rewardsWon: user.rewardsWon,
          rewardsClaimable: user.rewardsClaimable,
          wonToday: user.wonToday,
          cardScratched: user.cardScratched
        },
        { status: 200 },
      );
    }
  } catch (error) {
    console.error("Error in GET:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

export const POST = async (request: NextRequest) => {
  console.log("POST request received");
  try {
    console.log("POST request received", request);
    const body = await request.json();
    const { name, email, address } = body;

    if (!address) {
      return NextResponse.json({ error: "Address is required" }, { status: 400 });
    }

    // Check if user with this address already exists
    const existingUser = await Document.findOne({ address });
    if (existingUser) {
      return NextResponse.json({ error: "User with this address already exists" }, { status: 409 });
    }

    // Create new user
    const newUser = new Document({
      name,
      email,
      address,
    });

    // Save the user to the database
    await newUser.save();

    return NextResponse.json({ message: "User created successfully", user: newUser }, { status: 201 });
  } catch (error) {
    console.error("Error in POST:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

export const PUT = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { address, rewardsWon, rewardsClaimable, wonToday, cardScratched } = body.params;
    if (!address) {
      return NextResponse.json({ error: "Address is required" }, { status: 400 });
    }

    // Find the user by address
    const user = await Document.findOne({ address });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update the fields if they are provided
    if (rewardsWon !== undefined) {
      user.rewardsWon = rewardsWon;
    }
    if (rewardsClaimable !== undefined) {
      user.rewardsClaimable = rewardsClaimable;
    }
    if (wonToday !== undefined) {
      user.wonToday = wonToday;
    }

    if(cardScratched !== undefined){
      user.cardScratched = cardScratched;
    }

    // Save the updated user
    console.log("saving")
    await user.save();
    console.log("user",user);
    return NextResponse.json(
      {
        message: "User rewards information updated successfully",
        user: {
          address: user.address,
          rewardsWon: user.rewardsWon,
          rewardsClaimable: user.rewardsClaimable,
          wonToday: user.wonToday,
          cardScratched: user.cardScratched
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in PUT:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
