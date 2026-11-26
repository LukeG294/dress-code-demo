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
          <span
            key={step}
            className={`h-3 flex-1 rounded-full border-2 border-ink ${step <= level ? "bg-tomato" : "bg-white"}`}
          />
        ))}
      </div>
      <p className="mt-1.5 text-sm font-bold">
        Formality {level}/5: {label}
      </p>
    </div>
  );
}
