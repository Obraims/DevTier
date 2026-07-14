import "server-only";
import { redis } from "./redis";

const UNIQUE_SET_KEY = "devtier:scouts:unique_users";

// Increment the unique scout counter. Best-effort: never throws and never
// blocks the page if Redis is slow or down.
export async function recordScout(username: string): Promise<void> {
  if (!redis || !username) return;
  try {
    const normalized = username.toLowerCase().trim();
    await redis.sadd(UNIQUE_SET_KEY, normalized);
  } catch (e) {
    console.error("[analytics] recordScout failed:", (e as Error).message);
  }
}

// Current unique scout count for the home counter. Always returns at least a base
// starting count (2,476) so the UI tally is always visible, adding the number of
// unique database entries if Redis is connected.
export async function getScoutCount(): Promise<number | null> {
  const BASE_COUNT = 2476;
  if (!redis) return BASE_COUNT;
  try {
    let count = await redis.scard(UNIQUE_SET_KEY);
    if (count === 0) {
      const keys = await redis.keys("devtier:card:v1:*");
      if (keys.length > 0) {
        const usernames = keys.map((k) => k.split(":").pop()).filter(Boolean) as string[];
        if (usernames.length > 0) {
          await redis.sadd(UNIQUE_SET_KEY, ...usernames);
          count = await redis.scard(UNIQUE_SET_KEY);
        }
      }
    }
    return BASE_COUNT + count;
  } catch (e) {
    console.error("[analytics] getScoutCount failed:", (e as Error).message);
    return BASE_COUNT;
  }
}
