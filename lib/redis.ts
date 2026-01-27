import { createClient } from 'redis';

if (!process.env.REDIS_URL) throw new Error('REDIS_URL missing');

export const redis = createClient({ url: process.env.REDIS_URL });

redis.on('error', (err) => console.error('Redis Client Error', err));

await redis.connect();
