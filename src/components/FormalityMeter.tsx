import type { Decode } from "@/lib/schema";

type Formality = Extract<Decode, { status: "decoded" }>["formality"];

export function FormalityMeter({ level, label }: Formality) {
  return (
    <div>
      <div
        role="meter"
        aria-label="Formality"
        aria-valuemin={1}
        aria-valuemax={5}
        aria-valuenow={level}
        aria-valuetext={`${level} of 5, ${label}`}
        className="flex gap-1"
      >
        {[1, 2, 3, 4, 5].map((step) => (
          <span key={step} className={`h-2 flex-1 rounded-full ${step <= level ? "bg-stone-900" : "bg-stone-200"}`} />
        ))}
      </div>
      <p className="mt-1 text-sm text-stone-600">
        Formality {level}/5: {label}
      </p>
    </div>
  );
}
