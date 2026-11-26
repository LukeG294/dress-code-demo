"use client";

import { useState } from "react";
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
      <h1 className="text-3xl font-semibold">Dress Code Decoder</h1>
      <p className="mt-2 mb-6 text-stone-600">Describe an event dress code and find out what to wear.</p>

      <DecoderForm loading={state.view === "loading"} onSubmit={run} />

      <div className="mt-8" aria-live="polite">
        {state.view === "loading" && (
          <div className="animate-pulse space-y-3">
            <p className="sr-only">Decoding your dress code</p>
            <div className="h-6 w-3/4 rounded bg-stone-200" />
            <div className="h-2 rounded bg-stone-200" />
            <div className="h-28 rounded-xl bg-stone-200" />
            <div className="h-28 rounded-xl bg-stone-200" />
          </div>
        )}

        {state.view === "error" && (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4">
            <p>{state.message}</p>
            <button type="button" onClick={() => run(state.request)} className="mt-2 font-medium underline">
              Retry
            </button>
          </div>
        )}

        {state.view === "result" && (
          <>
            <p className="mb-4 text-sm text-stone-500">
              For “{state.request.description}”
              {state.request.clarification && `, ${state.request.clarification.answer}`}
            </p>
            {state.result.status === "decoded" && <DecodedResult result={state.result} />}
            {state.result.status === "ambiguous" && (
              <AmbiguousResult
                result={state.result}
                onAnswer={(question, answer) => run({ ...state.request, clarification: { question, answer } })}
              />
            )}
            {state.result.status === "off_topic" && (
              <p className="rounded-xl border border-stone-200 bg-white p-4">{state.result.message}</p>
            )}
          </>
        )}
      </div>
    </main>
  );
}
