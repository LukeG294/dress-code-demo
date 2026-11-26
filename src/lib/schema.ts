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

const text = z.string().min(1);

const formality = z.object({
  level: z.literal([1, 2, 3, 4, 5]),
  label: text,
});

const outfit = z.object({
  name: text,
  pieces: z
    .array(
      z.object({
        slot: z.enum(["top", "bottom", "onepiece", "layer", "shoes", "accessory"]),
        item: text,
      }),
    )
    .min(1),
  why: text,
});

const decoded = z.object({
  status: z.literal("decoded"),
  headline: text,
  formality,
  outfits: z.array(outfit).min(2).max(3),
  do: z.array(text).max(4),
  dont: z.array(text).max(4),
  safeBet: text,
  assumptions: z.array(text),
});

const ambiguous = z
  .object({
    status: z.literal("ambiguous"),
    mode: z.enum(["ask", "options"]),
    reason: text,
    question: z.object({ text, options: z.array(text).min(2).max(4) }).optional(),
    interpretations: z
      .array(z.object({ label: text, chooseIf: text, direction: text }))
      .min(2)
      .max(3)
      .optional(),
    hedge: z.object({ headline: text, formality, outfit: text }),
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
  message: text,
});

export const decodeSchema = z.discriminatedUnion("status", [decoded, ambiguous, offTopic]);

// A tool's input must be a plain object at the top level, so the union sits under `result`.
export const toolInputSchema = z.object({ result: decodeSchema });

export type DecodeRequest = z.infer<typeof requestSchema>;
export type Decode = z.infer<typeof decodeSchema>;
