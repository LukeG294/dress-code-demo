import type Anthropic from "@anthropic-ai/sdk";
import { describe, expect, it, vi } from "vitest";
import { decode, DecodeError } from "../src/lib/anthropic";
import { EXAMPLES } from "../src/lib/prompt";

// A fake model reply, so these tests need no API key.
const reply = (input?: unknown) =>
  ({
    stop_reason: input === undefined ? "end_turn" : "tool_use",
    content:
      input === undefined
        ? [{ type: "text", text: "Sure!" }]
        : [{ type: "tool_use", id: "toolu_1", name: "respond", input }],
  }) as unknown as Anthropic.Beta.BetaMessage;

const good = { result: EXAMPLES[1].result };
const ambiguous = { result: EXAMPLES[2].result };
const request = { description: "smart casual recruiting mixer" };

describe("decode", () => {
  it("returns a valid result on the first try", async () => {
    const create = vi.fn().mockResolvedValue(reply(good));
    expect(await decode(request, create)).toEqual(good.result);
    expect(create).toHaveBeenCalledTimes(1);
  });

  it("repairs invalid tool input once", async () => {
    const create = vi.fn().mockResolvedValueOnce(reply({ result: { status: "decoded" } })).mockResolvedValue(reply(good));
    expect(await decode(request, create)).toEqual(good.result);
    expect(create).toHaveBeenCalledTimes(2);
  });

  it("retries when the model skips the tool", async () => {
    const create = vi.fn().mockResolvedValueOnce(reply()).mockResolvedValue(reply(good));
    expect(await decode(request, create)).toEqual(good.result);
  });

  it("gives up after two bad replies", async () => {
    const create = vi.fn().mockResolvedValue(reply({}));
    await expect(decode(request, create)).rejects.toThrow(DecodeError);
    expect(create).toHaveBeenCalledTimes(2);
  });

  it("does not allow a second clarification round", async () => {
    const create = vi.fn().mockResolvedValueOnce(reply(ambiguous)).mockResolvedValue(reply(good));
    const answered = { ...request, clarification: { question: "Which era?", answer: "Y2K" } };
    expect(await decode(answered, create)).toEqual(good.result);
    expect(create).toHaveBeenCalledTimes(2);
  });
});
