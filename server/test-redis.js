
require('dotenv').config();
const { Redis } = require('ioredis');

const redis = new Redis(process.env.REDIS_URL);

redis.ping()
  .then(reply => {
    console.log('Redis connected! Reply:', reply);
    redis.disconnect();
    process.exit(0);
  })
  .catch(err => {
    console.error('Redis connection failed:', err.message);
    process.exit(1);
  });