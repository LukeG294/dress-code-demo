"use client";

import { useEffect, useState } from "react";
import type { DecodeRequest } from "@/lib/schema";
import { EXAMPLE_PHRASES, ExampleChips } from "./ExampleChips";
import { StyleChoice } from "./StyleChoice";

export function DecoderForm({ loading, onSubmit }: { loading: boolean; onSubmit: (request: DecodeRequest) => void }) {
  const [description, setDescription] = useState("");
  const [style, setStyle] = useState<DecodeRequest["style"]>();
  const [hint, setHint] = useState("");
  const [example, setExample] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setExample((i) => (i + 1) % EXAMPLE_PHRASES.length), 3000);
    return () => clearInterval(timer);
  }, []);

  function submit(value: string) {
    if (value.trim().length < 3) return setHint("Type at least 3 characters, like \"beach wedding\".");
    setHint("");
    onSubmit({ description: value.trim(), style });
  }

  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        submit(description);
      }}
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          aria-label="Dress code"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder={EXAMPLE_PHRASES[example]}
          maxLength={300}
          className="sticker min-w-0 flex-1 rounded-full bg-white px-5 py-3 placeholder:text-ink/40"
        />
        <button
          type="submit"
          disabled={loading}
          className="pressable rounded-full bg-tomato px-6 py-3 font-display text-lg font-extrabold lowercase disabled:opacity-60"
        >
          {loading ? "Decoding…" : "Decode"}
        </button>
      </div>
      {hint && (
        <p role="alert" className="text-sm font-bold text-cobalt">
          {hint}
        </p>
      )}

      <StyleChoice value={style} onChange={setStyle} />

      <ExampleChips
        disabled={loading}
        onPick={(phrase) => {
          setDescription(phrase);
          submit(phrase);
        }}
      />
    </form>
  );
}
