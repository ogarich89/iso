import redis from 'redis';
import { promisify } from 'util';
import config from '../../../config/config';
const { server: { dictionaryRedisDb, sessionRedisDb = 9 } } = config;

const client = redis.createClient({
  db: dictionaryRedisDb || sessionRedisDb
});
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

const redisClient = {
  get: async (key) => await getAsync(key),
  set: async (key, data, expires=1000) => await setAsync(key, data, 'EX', expires)
};

export default redisClient;
