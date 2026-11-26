// A public link spends real money, so each visitor gets a small allowance.
// Counts live in memory: they reset on restart and aren't shared between server instances,
// so an account spend limit is still the real backstop.
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 20;

const hits = new Map<string, number[]>();

/** Returns 0 if the request may proceed, otherwise the seconds to wait. */
export function rateLimit(key: string, now = Date.now()): number {
  // Forget idle visitors so the map can't grow without bound.
  if (hits.size > 1000) {
    for (const [other, times] of hits) {
      if (now - times[times.length - 1] >= WINDOW_MS) hits.delete(other);
    }
  }

  const recent = (hits.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= LIMIT) return Math.ceil((recent[0] + WINDOW_MS - now) / 1000);

  hits.set(key, [...recent, now]);
  return 0;
}
