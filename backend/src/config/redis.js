import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const client = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: 'redis-15559.crce179.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 15559
    }
});

client.on('error', (err) => {
  console.error('❌ Redis Client Error:', err);
});

client.on('connect', () => {
  console.log('✅ Connected to Redis Cloud');
});

await client.connect();

export default client;
