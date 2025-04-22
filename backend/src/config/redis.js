// import Redis from "ioredis";

// const redis = new Redis({
//     host: process.env.REDIS_HOST || "127.0.0.1",
//     port: process.env.REDIS_PORT || 6379,
// });

// redis.on("connect", () => console.log("Connected to Redis"));
// redis.on("error", (err) => console.error("Redis Error:", err));

// export default redis;

import { createClient } from 'redis';

const client = createClient({
    username: 'default',
    password: 'nV3dm7wTzwjFno50SjdfF43NaeVU9Cqq',
    socket: {
        host: 'redis-12891.c212.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 12891
    }
});

client.on('error', err => console.log('Redis Client Error', err));

await client.connect();

await client.set('foo', 'bar');
const result = await client.get('foo');
console.log(result)  // >>> bar

