// import { createClient } from 'redis';
// import dotenv from 'dotenv';

// dotenv.config();

// const client = createClient({
//     username: process.env.REDIS_USERNAME,
//     password: process.env.REDIS_PASSWORD,
//     socket: {
//         host : 'redis-14794.c301.ap-south-1-1.ec2.cloud.redislabs.com',
//         port: 14794
//     }
// });

// client.on('error', (err) => {
//   console.error('❌ Redis Client Error:', err);
// });

// client.on('connect', () => {
//   console.log('✅ Connected to Redis Cloud');
// });

// await client.connect();

// export default client;
