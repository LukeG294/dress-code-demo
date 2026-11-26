"use client";

import { useState } from "react";
import type { Decode } from "@/lib/schema";
import { FormalityMeter } from "./FormalityMeter";
import { PieceTiles } from "./PieceTiles";

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
        <h2 className="text-3xl leading-none font-extrabold">Could go a few ways</h2>
        <p className="mt-2">{result.reason}</p>
      </div>

      {asking && (
        <section>
          <h3 className="sticker inline-block rounded-3xl rounded-bl-md bg-lilac px-4 py-2 text-xl font-extrabold">
            {question.text}
          </h3>
          <div className="mt-4 flex flex-wrap gap-3">
            {question.options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => onAnswer(question.text, option)}
                className="pressable rounded-full bg-butter px-4 py-2 text-sm font-bold"
              >
                {option}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => setSkipped(true)} className="mt-4 text-sm font-bold underline">
            Skip, just give me a safe outfit
          </button>
        </section>
      )}

      {result.mode === "options" && (
        <div className="space-y-5">
          {interpretations?.map((reading) => (
            <section key={reading.label} className="sticker space-y-3 rounded-3xl bg-white p-4">
              <div>
                <h3 className="text-xl font-extrabold">{reading.label}</h3>
                <p className="text-sm">{reading.chooseIf}</p>
              </div>
              <PieceTiles pieces={reading.pieces} />
            </section>
          ))}
        </div>
      )}

      {!asking && (
        <section className="sticker space-y-3 rounded-3xl bg-butter/40 p-4">
          <h3 className="text-xl font-extrabold">★ Works either way: {hedge.headline}</h3>
          <FormalityMeter {...hedge.formality} />
          <PieceTiles pieces={hedge.pieces} />
        </section>
      )}
    </article>
  );
}
