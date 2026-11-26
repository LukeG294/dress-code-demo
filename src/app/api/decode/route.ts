import { decode } from "@/lib/anthropic";
import { requestSchema } from "@/lib/schema";

export const maxDuration = 60;

const fail = (status: number, error: string) => Response.json({ error }, { status });

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const input = requestSchema.safeParse(body);
  if (!input.success) return fail(400, "Describe the dress code in 3 to 300 characters.");

  const started = Date.now();
  try {
    const result = await decode(input.data);
    console.log(`[decode] status=${result.status} ms=${Date.now() - started}`);
    return Response.json(result);
  } catch (error) {
    // Details stay in the server log; the user's text is not logged.
    console.error(`[decode] failed ms=${Date.now() - started}`, error instanceof Error ? error.message : error);
    return fail(502, "Couldn't decode that right now. Please try again.");
  }
}
