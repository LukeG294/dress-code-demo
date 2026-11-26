"use client";

import { useState } from "react";
import type { Decode } from "@/lib/schema";
import { FormalityMeter } from "./FormalityMeter";
import { PieceTiles } from "./PieceTiles";

type Decoded = Extract<Decode, { status: "decoded" }>;

function Tags({ kind, items }: { kind: "do" | "dont"; items: string[] }) {
  const style = kind === "do" ? "bg-mint" : "bg-tomato";
  return items.map((item) => (
    <li key={`${kind}-${item}`} className={`rounded-full border-2 border-ink px-3 py-1 font-medium ${style}`}>
      <span aria-hidden="true">{kind === "do" ? "✓ " : "✕ "}</span>
      <span className="sr-only">{kind === "do" ? "Do: " : "Don't: "}</span>
      {item}
    </li>
  ));
}

export function DecodedResult({ result }: { result: Decoded }) {
  const [selected, setSelected] = useState(0);
  const outfit = result.outfits[selected];

  return (
    <article className="sticker space-y-5 rounded-3xl bg-white p-5">
      <h2 className="text-3xl leading-none font-extrabold">{result.headline}</h2>
      <FormalityMeter {...result.formality} />

      <div className="flex flex-wrap gap-2">
        {result.outfits.map((option, index) => (
          <button
            key={option.name}
            type="button"
            aria-pressed={index === selected}
            onClick={() => setSelected(index)}
            className="pressable rounded-full bg-white px-3 py-1.5 text-sm font-bold aria-pressed:bg-cobalt aria-pressed:text-white"
          >
            {option.name}
          </button>
        ))}
      </div>
      <PieceTiles pieces={outfit.pieces} />

      <ul className="flex flex-wrap gap-2 text-sm">
        <Tags kind="do" items={result.do} />
        <Tags kind="dont" items={result.dont} />
      </ul>

      <p className="rounded-2xl border-2 border-dashed border-ink bg-paper p-3 text-sm">
        <strong className="font-display lowercase">★ Safe bet:</strong> {result.safeBet}
      </p>

      <details className="text-sm">
        <summary className="cursor-pointer font-bold">Why and assumptions</summary>
        <p className="mt-2">{outfit.why}</p>
        {result.assumptions.length > 0 && <p className="mt-1">Assumed: {result.assumptions.join(" · ")}</p>}
      </details>
    </article>
  );
}
