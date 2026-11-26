import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { buildUserMessage, SYSTEM_PROMPT } from "./prompt";
import { type Decode, type DecodeRequest, toolInputSchema } from "./schema";

const DEFAULT_MODEL = "claude-sonnet-5-5";

// The SDK helper rewrites the zod schema into the subset strict mode accepts.
// Limits it drops (such as "2-3 outfits") are still checked by zod below.
const respondTool: Anthropic.Beta.BetaTool = {
  name: "respond",
  description: "Return the decoded dress code to the app.",
  strict: true,
  input_schema: zodOutputFormat(toolInputSchema).schema as Anthropic.Beta.BetaTool.InputSchema,
};

export class DecodeError extends Error {}

type CreateMessage = (params: Anthropic.Beta.MessageCreateParamsNonStreaming) => Promise<Anthropic.Beta.BetaMessage>;

let client: Anthropic | undefined;
const callApi: CreateMessage = async (params) => {
  // One automatic retry on timeouts, rate limits and server errors.
  client ??= new Anthropic({ maxRetries: 1, timeout: 25_000 });
  const response = await client.beta.messages.create(params);
  const { input_tokens, cache_creation_input_tokens, cache_read_input_tokens, output_tokens } = response.usage;
  console.log(
    `[usage] input=${input_tokens} cache_write=${cache_creation_input_tokens} cache_read=${cache_read_input_tokens} output=${output_tokens}`,
  );
  return response;
};

export async function decode(request: DecodeRequest, create: CreateMessage = callApi): Promise<Decode> {
  const model = process.env.ANTHROPIC_MODEL || DEFAULT_MODEL;
  const messages: Anthropic.Beta.BetaMessageParam[] = [{ role: "user", content: buildUserMessage(request) }];

  // The first attempt, plus one repair attempt that tells the model what was wrong.
  for (let attempt = 0; attempt < 2; attempt++) {
    const response = await create({
      model,
      // Thinking counts toward max_tokens, so leave room beyond the reply itself.
      max_tokens: 4000,
      // The tool and system prompt never change, so cache them to cut the cost of repeat requests.
      system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
      messages,
      tools: [respondTool],
      // This model rejects forced tool choice and custom temperature.
      tool_choice: { type: "auto", disable_parallel_tool_use: true },
      // Settings that other models may reject, so an ANTHROPIC_MODEL override skips them.
      ...(model === DEFAULT_MODEL && {
        output_config: { effort: "low" as const },
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default" as const,
      }),
    });

    if (response.stop_reason === "refusal") throw new DecodeError("The model declined the request");

    const call = response.content.find((block) => block.type === "tool_use");
    const parsed = toolInputSchema.safeParse(call?.input);
    let problem: string;

    if (!call) problem = "You did not call the respond tool.";
    else if (!parsed.success) problem = `Invalid input:\n${parsed.error.message}`;
    else if (request.clarification && parsed.data.result.status === "ambiguous") {
      problem = "The person already answered a clarifying question. Return decoded.";
    } else return parsed.data.result;

    messages.push({ role: "assistant", content: response.content });
    messages.push({
      role: "user",
      content: call
        ? [{ type: "tool_result", tool_use_id: call.id, content: problem, is_error: true }]
        : `${problem} Call it now.`,
    });
  }

  throw new DecodeError("The model did not return a valid result");
}
