// The contract shared by the API route, the model's tool and the UI.
import { z } from "zod";

export const requestSchema = z.object({
  description: z.string().trim().min(3).max(300),
  context: z
    .object({
      styleLean: z.enum(["menswear", "womenswear", "mix", "none"]).optional(),
      setting: z.enum(["indoor", "outdoor", "hot", "cold", "rainy"]).optional(),
      comfortFirst: z.boolean().optional(),
    })
    .optional(),
  clarification: z
    .object({
      question: z.string().trim().min(1).max(300),
      answer: z.string().trim().min(1).max(100),
    })
    .optional(),
});

// Length caps keep results scannable. The prompt asks for much shorter text than these,
// so they only catch a reply that has turned into prose.
const text = (max: number) => z.string().min(1).max(max);

// A fixed list, so every garment type always shows the same icon.
export const GARMENTS = [
  "shirt", "tee", "knit", "jacket", "trousers", "shorts", "skirt", "dress", "shoes",
  "sneakers", "boots", "sandals", "tie", "bag", "jewelry", "glasses", "hat", "other",
] as const;

const pieces = z
  .array(z.object({ garment: z.enum(GARMENTS), item: text(40) }))
  .min(2)
  .max(5);

const formality = z.object({
  level: z.literal([1, 2, 3, 4, 5]),
  label: text(30),
});

const outfit = z.object({
  name: text(30),
  pieces,
  why: text(100),
});

const decoded = z.object({
  status: z.literal("decoded"),
  headline: text(60),
  formality,
  outfits: z.array(outfit).min(2).max(3),
  do: z.array(text(32)).max(3),
  dont: z.array(text(32)).max(3),
  safeBet: text(100),
  assumptions: z.array(text(60)).max(3),
});

const ambiguous = z
  .object({
    status: z.literal("ambiguous"),
    mode: z.enum(["ask", "options"]),
    reason: text(100),
    question: z.object({ text: text(60), options: z.array(text(30)).min(2).max(4) }).optional(),
    interpretations: z
      .array(z.object({ label: text(30), chooseIf: text(60), pieces }))
      .min(2)
      .max(3)
      .optional(),
    hedge: z.object({ headline: text(60), formality, pieces }),
  })
  // JSON Schema can't tie these fields to `mode`, so zod enforces it.
  .superRefine((value, ctx) => {
    const needed = value.mode === "ask" ? "question" : "interpretations";
    if (!value[needed]) {
      ctx.addIssue({ code: "custom", path: [needed], message: `Required when mode is "${value.mode}"` });
    }
  });

const offTopic = z.object({
  status: z.literal("off_topic"),
  message: text(160),
});

export const decodeSchema = z.discriminatedUnion("status", [decoded, ambiguous, offTopic]);

// A tool's input must be a plain object at the top level, so the union sits under `result`.
export const toolInputSchema = z.object({ result: decodeSchema });

export type DecodeRequest = z.infer<typeof requestSchema>;
export type Decode = z.infer<typeof decodeSchema>;
export type Garment = (typeof GARMENTS)[number];
export type Piece = z.infer<typeof pieces>[number];
