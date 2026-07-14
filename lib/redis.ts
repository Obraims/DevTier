import "server-only";
import IORedis from "ioredis";
import { Redis as UpstashRedis } from "@upstash/redis";

export interface RedisClient {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ...args: any[]): Promise<any>;
  sadd(key: string, ...members: string[]): Promise<number>;
  scard(key: string): Promise<number>;
  keys(pattern: string): Promise<string[]>;
  ping(): Promise<string>;
}

class IORedisAdapter implements RedisClient {
  constructor(private client: IORedis) {}

  async get(key: string) {
    return this.client.get(key);
  }

  async set(key: string, value: string, ...args: any[]) {
    return this.client.set(key, value, ...args);
  }

  async sadd(key: string, ...members: string[]) {
    return this.client.sadd(key, ...members);
  }

  async scard(key: string) {
    return this.client.scard(key);
  }

  async keys(pattern: string) {
    return this.client.keys(pattern);
  }

  async ping() {
    return this.client.ping();
  }
}

class UpstashRedisAdapter implements RedisClient {
  constructor(private client: UpstashRedis) {}

  async get(key: string) {
    return this.client.get<string>(key);
  }

  async set(key: string, value: string, ...args: any[]) {
    const options: any = {};
    if (args[0] === "EX" && typeof args[1] === "number") {
      options.ex = args[1];
    } else if (args[0] === "PX" && typeof args[1] === "number") {
      options.px = args[1];
    }
    return this.client.set(key, value, options);
  }

  async sadd(key: string, ...members: string[]) {
    if (members.length === 0) return 0;
    return this.client.sadd(key, members[0], ...members.slice(1));
  }

  async scard(key: string) {
    return this.client.scard(key);
  }

  async keys(pattern: string) {
    return this.client.keys(pattern);
  }

  async ping() {
    return this.client.ping();
  }
}

// One shared connection, stashed on globalThis so dev HMR doesn't leak sockets.
declare global {
  var __devtierRedis: RedisClient | null | undefined;
}

function create(): RedisClient | null {
  // 1. Check for standard REDIS_URL first (TCP)
  const url = process.env.REDIS_URL;
  if (url) {
    const client = new IORedis(url, {
      tls: url.startsWith("rediss://") ? { rejectUnauthorized: false } : undefined,
      maxRetriesPerRequest: 2,
      commandTimeout: 2000,
    });
    client.on("error", (e) => console.error("[redis]", e.message));
    return new IORedisAdapter(client);
  }

  // 2. Fall back to Upstash REST client if REST URL and Token are set
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (upstashUrl && upstashToken) {
    const client = new UpstashRedis({
      url: upstashUrl,
      token: upstashToken,
    });
    return new UpstashRedisAdapter(client);
  }

  return null;
}

export const redis: RedisClient | null =
  globalThis.__devtierRedis !== undefined ? globalThis.__devtierRedis : (globalThis.__devtierRedis = create());
