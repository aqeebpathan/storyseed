import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error(
    "⚠️ Please define the MONGODB_URI environment variable inside .env.local",
  )
}

// Define the cache structure
type MongooseCache = {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

// Extend the global object to include the mongoose cache
const globalWithMongoose = globalThis as typeof globalThis & {
  mongoose?: MongooseCache
}

// Use or create the cache
const cached: MongooseCache = (globalWithMongoose.mongoose ??= {
  conn: null,
  promise: null,
})

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      dbName: "storyseed",
    })
  }

  cached.conn = await cached.promise
  return cached.conn
}
