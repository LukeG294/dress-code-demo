import type { Decode } from "@/lib/schema";
import { FormalityMeter } from "./FormalityMeter";

type Decoded = Extract<Decode, { status: "decoded" }>;

const SLOT_LABELS: Record<Decoded["outfits"][number]["pieces"][number]["slot"], string> = {
  top: "Top",
  bottom: "Bottom",
  onepiece: "One-piece",
  layer: "Layer",
  shoes: "Shoes",
  accessory: "Accessory",
};

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="font-semibold">{title}</h3>
      <ul className="mt-1 list-disc space-y-1 pl-5">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export function DecodedResult({ result }: { result: Decoded }) {
  return (
    <article className="space-y-6">
      <h2 className="text-xl font-semibold">{result.headline}</h2>
      <FormalityMeter {...result.formality} />

      <div className="space-y-3">
        {result.outfits.map((outfit) => (
          <section key={outfit.name} className="rounded-xl border border-stone-200 bg-white p-4">
            <h3 className="font-semibold">{outfit.name}</h3>
            <dl className="mt-2 space-y-1 text-sm">
              {outfit.pieces.map((piece) => (
                <div key={`${piece.slot}-${piece.item}`} className="flex gap-3">
                  <dt className="w-20 shrink-0 text-stone-500">{SLOT_LABELS[piece.slot]}</dt>
                  <dd>{piece.item}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-2 text-sm text-stone-600">{outfit.why}</p>
          </section>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <List title="Do" items={result.do} />
        <List title="Don't" items={result.dont} />
      </div>

      <section className="rounded-xl bg-stone-200/60 p-4">
        <h3 className="font-semibold">Safe bet</h3>
        <p className="mt-1">{result.safeBet}</p>
      </section>

      {result.assumptions.length > 0 && (
        <p className="text-sm text-stone-500">Assumed: {result.assumptions.join(" · ")}</p>
      )}
    </article>
  );
}
