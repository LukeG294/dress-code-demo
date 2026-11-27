# Dress Code Decoder

Type a dress code like "smart casual recruiting mixer" and get clear guidance on what to wear. If the phrase could mean quite different outfits, the app says so instead of guessing.

**Live:** https://dress-code-decoder-one.vercel.app

![A result showing a formality meter, outfit tabs and an icon tile for each garment](docs/screenshot.jpg)

## How it works

```
form -> POST /api/decode -> validate + rate limit -> Claude -> check reply -> UI
```

The model is `claude-sonnet-5-5` via the Anthropic Messages API (TypeScript SDK), in a Next.js app. The key stays on the server.

Start with [`prompt.ts`](src/lib/prompt.ts), [`schema.ts`](src/lib/schema.ts) and [`anthropic.ts`](src/lib/anthropic.ts).

## Prompt and output format

- **Structured output.** Claude answers by calling one tool. The reply is `decoded`, `ambiguous` or `off_topic`, so the UI always knows what to draw.
- **Two checks.** Strict mode fixes the shape; zod checks the rules it can't express, such as "2-3 outfits". A bad reply gets one repair attempt. (`tool_choice` is `auto` because this model rejects forced tool use.)
- **Made to scan.** Word limits keep text short, and each garment comes from a fixed list that picks its icon.
- **The prompt** has a 1-5 formality scale, the ambiguity rule, style rules and four examples that are kept out of the test set.
- **No male default.** With "Either" selected, outfits cover a dress or skirt as well as trousers. People can also choose Women or Men.
- **Untrusted input** is wrapped in tags and treated as data, never as instructions.

## Vague or unclear input

A phrase is flagged only if its plausible readings would lead to **materially different outfits**. Otherwise it is decoded, with assumptions listed.

| Mode | When | Example |
|---|---|---|
| Ask | The person can likely answer | "nostalgic festival fits" → which era? |
| Options | They may not know | "themed party, host says go all out" → a few readings |

- Every ambiguous reply includes a **hedge** outfit that works either way.
- People can type their own answer, skip the question, or go back and try another.
- A question is never followed by another question.

## Evals

`npm run eval` sends 32 phrases to the real API and checks the status and formality level. They include typos, slang and emoji ("blk tie optnl", "no cap what do i even wear 😭"). The latest full run passed **32/32**.

What it caught:
- Four test phrases were also prompt examples, which inflated the first score. Removing them showed "nostalgic festival fits" being treated as clear. A rule about unnamed eras fixed it.
- Shortening the output broke "dress to impress" in the same way. A rule about effort-only phrases fixed it.

Read the score with care: two expected results were changed after seeing the output ("festive" and "come as you are but classy" now count as clear), some rules were written to fix test phrases, and replies vary between runs. It does not judge whether the outfit advice is good.

## What I'd build next

- **Bring in the group chat:** share the decoded dress code so friends can weigh in.
- **Judge the advice:** a quality rubric, more ambiguous phrases and repeated runs.
- **Learn real language:** see which questions people skip or answer in their own words, and use that to improve the decoding.

## Run locally

Needs Node 22+ and an Anthropic API key.

```bash
npm install
cp .env.example .env.local   # add your ANTHROPIC_API_KEY
npm run dev
```

`npm test` runs offline. `npm run eval` makes 32 billed API calls.

The rate limit (20 requests per 10 minutes) is held in memory per server instance, so an account spend limit is the real cap.
