import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

export const client = process.env.REDIS_URL
  ? new Redis(process.env.REDIS_URL)
  : null;

// Helper to safely call Redis operations
export const redisOp = async (operation) => {
  if (!client) return null;
  try {
    return await operation(client);
  } catch (error) {
    console.warn("Redis operation failed:", error.message);
    return null;
  }
};
