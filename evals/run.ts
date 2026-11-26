// Runs every case against the real API. `decode` already validates each reply against the schema.
import { decode } from "../src/lib/anthropic";
import type { Decode } from "../src/lib/schema";
import cases from "./cases.json";

type Case = (typeof cases)[number];

async function run({ bucket, input, status, formality }: Case) {
  const started = Date.now();
  let result: Decode | undefined;
  let error = "";
  try {
    result = await decode({ description: input });
  } catch (cause) {
    error = cause instanceof Error ? cause.message : String(cause);
  }

  const level = result?.status === "decoded" ? result.formality.level : undefined;
  const inRange = !formality || (level !== undefined && level >= formality[0] && level <= formality[1]);
  return {
    pass: result?.status === status && inRange,
    bucket,
    input,
    expected: formality ? `${status} ${formality.join("-")}` : status,
    got: result
      ? [result.status, level, result.status === "ambiguous" ? result.mode : undefined].filter(Boolean).join(" ")
      : `error: ${error.slice(0, 80)}`,
    seconds: Number(((Date.now() - started) / 1000).toFixed(1)),
  };
}

async function main() {
  const rows: Awaited<ReturnType<typeof run>>[] = [];
  // Small batches keep the run quick without tripping rate limits.
  for (let i = 0; i < cases.length; i += 4) {
    rows.push(...(await Promise.all(cases.slice(i, i + 4).map(run))));
  }
  console.table(rows.map((row) => ({ ...row, pass: row.pass ? "PASS" : "FAIL" })));
  const passed = rows.filter((row) => row.pass).length;
  console.log(`${passed}/${rows.length} passed`);
  process.exitCode = passed === rows.length ? 0 : 1;
}

main();
