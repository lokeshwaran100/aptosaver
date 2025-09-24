import { MongoClient } from "mongodb";
import { Schema, models, model } from "mongoose";

if (!process.env.NEXT_PUBLIC_MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "NEXT_PUBLIC_MONGODB_URI"');
}

const uri = process.env.NEXT_PUBLIC_MONGODB_URI;
const options = {};

let client: MongoClient;

// if (process.env.NODE_ENV === "development") {
//   // In development mode, use a global variable so that the value
//   // is preserved across module reloads caused by HMR (Hot Module Replacement).
//   let globalWithMongo = global as typeof globalThis & {
//     _mongoClient?: MongoClient;
//   };

//   if (!globalWithMongo._mongoClient) {
//     globalWithMongo._mongoClient = new MongoClient(uri, options);
//   }
//   client = globalWithMongo._mongoClient;
// } else {
// In production mode, it's best to not use a global variable.
client = new MongoClient(uri, options);
// }zzzz

const documentSchema = new Schema({
  id: { type: String, default: "1" },
  name: { type: String },
  email: { type: String },
  address: { type: String },
  totalDeposits: { type: Number, default: 0 },
  depositTimestamp: { type: String, default: "0" },
  rewardsWon: { type: Number, default: 0 },
  rewardsClaimable: { type: Number, default: 0 },
  wonToday: { type: Boolean, default: false },
  cardScratched: {type: Boolean, default: false},
  lastResetDate: { type: Date, default: Date.now }
});

documentSchema.index({ lastResetDate: 1 }, { expireAfterSeconds: 86400 });

documentSchema.pre('save', function(next) {
  const now = new Date();
  if (this.lastResetDate && now.getDate() !== this.lastResetDate.getDate()) {
    this.cardScratched = false;
    this.lastResetDate = now;
  }
  next();
});

const Document = models.User ?? model("User", documentSchema);

export { client, Document };

// getAllADd
// getDepositFromAddress
// getTimestampFromAddress
// getDepositTismesatmpFromADd
// setDepositAndTimsetampFromAddress
// setAddres

// import mongoose from 'mongoose';

// const MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URI as string;

// if (!MONGODB_URI) {
//     throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
// }

// let cached = global.mongoose;

// if (!cached) {
//     cached = global.mongoose = { conn: null, promise: null };
// }

// async function connectDB() {
//     if (cached.conn) {
//         return cached.conn;
//     }

//     if (!cached.promise) {
//         const opts = {
//             bufferCommands: false,
//         };

//         console.log(MONGODB_URI)
//         cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
//             return mongoose;
//         });
//     }
//     cached.conn = await cached.promise;
//     return cached.conn;
// }

// export default connectDB;
