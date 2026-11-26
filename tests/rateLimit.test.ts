import { describe, expect, it } from "vitest";
import { rateLimit } from "../src/lib/rateLimit";

describe("rateLimit", () => {
  it("blocks after 20 requests, then recovers when the window passes", () => {
    for (let i = 0; i < 20; i++) expect(rateLimit("a", 0)).toBe(0);
    expect(rateLimit("a", 60_000)).toBe(540);
    expect(rateLimit("a", 600_000)).toBe(0);
  });

  it("counts each visitor separately", () => {
    for (let i = 0; i < 20; i++) rateLimit("b", 0);
    expect(rateLimit("c", 0)).toBe(0);
  });
});
