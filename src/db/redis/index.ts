import { getIoRedis } from 'alemonjs'
import { Redis as RedisClient } from 'ioredis'
export const Redis: RedisClient = getIoRedis()
