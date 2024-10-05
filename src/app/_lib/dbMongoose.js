// this is the main connection to the DB for most functions, with the exception of user authentication
// AuthJS has no mongoose adapter, so it uses a different connection (dbMongoDb.ts file)
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI in your environment variables inside .env.local'
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const dbConnect = async () => {
  if (cached.conn) {
    console.log('Using existing connection');
    return cached.conn;
  }
  if (!cached.promise) {
    console.log('Creating new connection');
    const opts = {
      bufferCommands: false,
    };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
  console.log('DB connected successfully');
  return cached.conn;
}
