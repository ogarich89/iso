import redis from 'koa-redis';
import config from '../../config/config.cjs';
const { server: { sessionRedisDb } } = config;

const redisClient = redis({
  db: sessionRedisDb
});

export default redisClient;
