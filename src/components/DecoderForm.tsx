"use client";

import { useEffect, useState } from "react";
import type { DecodeRequest } from "@/lib/schema";
import { EXAMPLE_PHRASES, ExampleChips } from "./ExampleChips";

type Context = NonNullable<DecodeRequest["context"]>;

const field = "mt-1 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2";

export function DecoderForm({ loading, onSubmit }: { loading: boolean; onSubmit: (request: DecodeRequest) => void }) {
  const [description, setDescription] = useState("");
  const [context, setContext] = useState<Context>({});
  const [hint, setHint] = useState("");
  const [example, setExample] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setExample((i) => (i + 1) % EXAMPLE_PHRASES.length), 3000);
    return () => clearInterval(timer);
  }, []);

  function submit(value: string) {
    if (value.trim().length < 3) return setHint("Type at least 3 characters, like \"beach wedding\".");
    setHint("");
    onSubmit({ description: value.trim(), context });
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        submit(description);
      }}
    >
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          aria-label="Dress code"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder={EXAMPLE_PHRASES[example]}
          maxLength={300}
          className="min-w-0 flex-1 rounded-lg border border-stone-300 bg-white px-4 py-3"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-stone-900 px-5 py-3 font-medium text-white disabled:opacity-50"
        >
          {loading ? "Decoding…" : "Decode"}
        </button>
      </div>
      {hint && (
        <p role="alert" className="text-sm text-red-700">
          {hint}
        </p>
      )}

      <ExampleChips
        disabled={loading}
        onPick={(phrase) => {
          setDescription(phrase);
          submit(phrase);
        }}
      />

      <details className="text-sm">
        <summary className="cursor-pointer text-stone-600">Add context (optional)</summary>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label>
            Style lean
            <select
              className={field}
              value={context.styleLean ?? "none"}
              onChange={(event) => setContext({ ...context, styleLean: event.target.value as Context["styleLean"] })}
            >
              <option value="none">No preference</option>
              <option value="menswear">Menswear</option>
              <option value="womenswear">Womenswear</option>
              <option value="mix">Mix</option>
            </select>
          </label>
          <label>
            Weather or setting
            <select
              className={field}
              value={context.setting ?? ""}
              onChange={(event) =>
                setContext({ ...context, setting: (event.target.value || undefined) as Context["setting"] })
              }
            >
              <option value="">Not specified</option>
              <option value="indoor">Indoor</option>
              <option value="outdoor">Outdoor</option>
              <option value="hot">Hot</option>
              <option value="cold">Cold</option>
              <option value="rainy">Rainy</option>
            </select>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={context.comfortFirst ?? false}
              onChange={(event) => setContext({ ...context, comfortFirst: event.target.checked })}
            />
            Comfort is a priority
          </label>
        </div>
      </details>
    </form>
  );
}
