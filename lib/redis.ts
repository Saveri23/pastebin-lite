// lib/redis.ts
import { createClient, RedisClientType } from "redis";

let redisClient: RedisClientType | null = null;

export async function getRedis() {
  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS_URL,
    });

    redisClient.on("error", (err) => {
      console.error("Redis error:", err);
    });

    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  }
  return redisClient;
}
