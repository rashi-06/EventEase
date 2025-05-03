import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redis = createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: false, // use SSL for Redis Cloud
    rejectUnauthorized: false, // useful for self-signed certs in cloud
  },
});

redis.on('error', (err) => {
  console.error('❌ Redis Client Error:', err);
});

redis.on('connect', () => {
  console.log('✅ Connected to Redis Cloud');
});

await redis.connect();

export default redis;
