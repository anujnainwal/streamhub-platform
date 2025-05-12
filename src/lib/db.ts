/*
 * lib/dbConnect.ts
 * A robust, TypeScript-ready MongoDB connection handler for Next.js 15.3 (App Router)
 */
import mongoose from "mongoose";

// Add global type declaration for _mongooseCache
declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable in .env.local"
  );
}

/**
 * A global variable to cache the connection across module reloads
 * to prevent creating multiple connections in development.
 */
let cached: {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
} = globalThis._mongooseCache || { conn: null, promise: null };
if (!globalThis._mongooseCache) {
  globalThis._mongooseCache = cached;
}

/**
 * Connects to MongoDB using mongoose, with caching and error handling.
 * @returns A promise resolving to the mongoose connection instance.
 */
export async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    mongoose.set("strictQuery", false); // Opt-out of strictQuery deprecation warning
    cached.promise = mongoose
      .connect(MONGODB_URI as any, {
        autoIndex: process.env.NODE_ENV !== "production", // Disable autoIndex in prod for performance
        maxPoolSize: 10, // Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      })
      .then((mongooseInstance) => {
        console.log("[dbConnect] MongoDB connected");
        return mongooseInstance;
      })
      .catch((error) => {
        console.error("[dbConnect] MongoDB connection error:", error);
        throw new Error("MongoDB connection failed");
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;

/*
 * Usage in Route Handler (e.g., app/api/users/route.ts):
 *
 * import { NextResponse } from 'next/server';
 * import { dbConnect } from '@/lib/dbConnect';
 * import User from '@/models/User';
 *
 * export async function GET() {
 *   await dbConnect();
 *   const users = await User.find();
 *   return NextResponse.json(users);
 * }
 */
