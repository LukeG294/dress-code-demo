"use client";

import { useEffect, useRef, useState } from "react";
import { AmbiguousResult } from "@/components/AmbiguousResult";
import { DecodedResult } from "@/components/DecodedResult";
import { DecoderForm } from "@/components/DecoderForm";
import type { Decode, DecodeRequest } from "@/lib/schema";

type State =
  | { view: "idle" }
  | { view: "loading" }
  | { view: "error"; message: string; request: DecodeRequest }
  | { view: "result"; result: Decode; request: DecodeRequest };

export default function Home() {
  const [state, setState] = useState<State>({ view: "idle" });
  const results = useRef<HTMLDivElement>(null);

  // On small screens results start below the fold, so bring them into view.
  // Left alone when they're already near the top, to avoid needless jumps.
  useEffect(() => {
    if (state.view === "idle" || !results.current) return;
    const { top } = results.current.getBoundingClientRect();
    if (top >= 0 && top < window.innerHeight * 0.4) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    results.current.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }, [state.view]);

  async function run(request: DecodeRequest) {
    setState({ view: "loading" });
    try {
      const response = await fetch("/api/decode", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(request),
        signal: AbortSignal.timeout(65_000),
      });
      const body = await response.json();
      if (!response.ok) return setState({ view: "error", message: body.error, request });
      setState({ view: "result", result: body, request });
    } catch {
      setState({ view: "error", message: "Couldn't reach the server. Check your connection and retry.", request });
    }
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-10 sm:py-16">
      <p className="sticker mb-5 inline-block -rotate-3 rounded-full bg-lilac px-4 py-1 text-sm font-bold">
        ✦ no more guessing
      </p>
      <h1 className="text-5xl leading-[0.95] font-extrabold sm:text-6xl">
        Dress code <span className="inline-block -rotate-2 rounded-lg bg-butter px-2">decoder</span>
      </h1>
      <p className="mt-4 mb-7 text-lg">Paste the invite wording. Get the fit.</p>

      <DecoderForm loading={state.view === "loading"} onSubmit={run} />

      {/* The minimum height leaves room to scroll a short result to the top. */}
      <div
        ref={results}
        className={`mt-10 scroll-mt-4 ${state.view === "idle" ? "" : "min-h-svh"}`}
        aria-live="polite"
      >
        {state.view === "loading" && (
          <div className="animate-pulse space-y-3">
            <p className="sr-only">Decoding your dress code</p>
            <div className="h-8 w-3/4 rounded-full bg-lilac" />
            <div className="h-3 rounded-full bg-butter" />
            <div className="h-28 rounded-2xl bg-mint" />
            <div className="h-28 rounded-2xl bg-sky" />
          </div>
        )}

        {state.view === "error" && (
          <div role="alert" className="sticker rounded-2xl bg-tomato p-4 font-medium">
            <p>{state.message}</p>
            <button type="button" onClick={() => run(state.request)} className="mt-2 font-bold underline">
              Retry
            </button>
          </div>
        )}

        {state.view === "result" && (
          <>
            <p className="mb-3 text-sm font-medium text-ink/60">
              For “{state.request.description}”
              {state.request.clarification && `, ${state.request.clarification.answer}`}
              {state.request.style && ` · ${state.request.style}`}
            </p>
            {state.result.status === "decoded" && <DecodedResult result={state.result} />}
            {state.result.status === "ambiguous" && (
              <AmbiguousResult
                result={state.result}
                onAnswer={(question, answer) => run({ ...state.request, clarification: { question, answer } })}
              />
            )}
            {state.result.status === "off_topic" && (
              <p className="sticker rounded-2xl bg-sky p-4 font-medium">{state.result.message}</p>
            )}
          </>
        )}
      </div>
    </main>
  );
}
