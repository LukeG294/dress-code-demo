"use client";

import { useState } from "react";
import type { Decode } from "@/lib/schema";
import { FormalityMeter } from "./FormalityMeter";

type Ambiguous = Extract<Decode, { status: "ambiguous" }>;

export function AmbiguousResult({
  result,
  onAnswer,
}: {
  result: Ambiguous;
  onAnswer: (question: string, answer: string) => void;
}) {
  const [skipped, setSkipped] = useState(false);
  const { question, interpretations, hedge } = result;
  // In "ask" mode the question comes first; the hedge waits until it is skipped.
  const asking = result.mode === "ask" && question && !skipped;

  return (
    <article className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">This one could go a few ways</h2>
        <p className="mt-1 text-stone-600">{result.reason}</p>
      </div>

      {asking && (
        <section>
          <h3 className="font-semibold">{question.text}</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {question.options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => onAnswer(question.text, option)}
                className="rounded-full bg-stone-900 px-4 py-2 text-sm text-white hover:bg-stone-700"
              >
                {option}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => setSkipped(true)} className="mt-3 text-sm underline">
            Skip, just give me a safe outfit
          </button>
        </section>
      )}

      {result.mode === "options" && (
        <div className="space-y-3">
          {interpretations?.map((reading) => (
            <section key={reading.label} className="rounded-xl border border-stone-200 bg-white p-4">
              <h3 className="font-semibold">{reading.label}</h3>
              <p className="mt-1">{reading.direction}</p>
              <p className="mt-1 text-sm text-stone-600">Choose this if {reading.chooseIf.replace(/^if /i, "")}</p>
            </section>
          ))}
        </div>
      )}

      {!asking && (
        <section className="space-y-3 rounded-xl bg-stone-200/60 p-4">
          <h3 className="font-semibold">Works either way: {hedge.headline}</h3>
          <p>{hedge.outfit}</p>
          <FormalityMeter {...hedge.formality} />
        </section>
      )}
    </article>
  );
}
