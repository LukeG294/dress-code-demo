# Dress Code Decoder

Turns a dress code phrase into practical guidance on what to wear, and says so when the phrase doesn't give enough to go on.

## Evals

`npm run eval` sends the 20 phrases in `evals/cases.json` to the real API (it needs `ANTHROPIC_API_KEY`). Each reply is validated against the schema, then checked for the expected status and, where given, a formality range.

| Prompt version | Passed |
|---|---|
| First version, where 4 test phrases were also prompt examples | 19/20 |
| Examples replaced with unrelated phrases | 18/20 |
| Added a rule for unnamed eras and aesthetics (two runs) | 19/20, 18/20 |
| Same prompt, two expected results changed (three runs) | 20/20, 20/20, 19/20 |

**Failure found and fixed:** once its copied example was gone, "nostalgic festival fits" was decoded as if the era were known. A general rule in the ambiguity policy fixed it (6 of 6 repeat runs asked which era).

**Expectations changed after seeing results:** "festive" and "come as you are but classy" were first expected to be ambiguous. The model decodes them with stated assumptions, and since their likely readings lead to similar outfits, that now counts as correct. The last row's higher score comes from this change, not from a better prompt.

**Known variance:** "festive" occasionally comes back as a clarifying question, which accounts for the 19/20 run.

The formality scale in the prompt names several common dress codes that are also test phrases, so the clear formal and casual cases are the easiest ones.
