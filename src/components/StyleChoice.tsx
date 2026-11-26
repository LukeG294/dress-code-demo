import type { DecodeRequest } from "@/lib/schema";

type Style = DecodeRequest["style"];

const CHOICES: { value: Style; label: string }[] = [
  { value: undefined, label: "Either" },
  { value: "women", label: "Women" },
  { value: "men", label: "Men" },
];

// Real radio buttons underneath, so keyboard and screen readers work.
export function StyleChoice({ value, onChange }: { value: Style; onChange: (value: Style) => void }) {
  return (
    <fieldset className="flex flex-wrap items-center gap-2">
      <legend className="sr-only">Style</legend>
      {CHOICES.map((choice) => (
        <label key={choice.label} className="cursor-pointer">
          <input
            type="radio"
            name="style"
            checked={value === choice.value}
            onChange={() => onChange(choice.value)}
            className="peer sr-only"
          />
          <span className="block rounded-full border-2 border-ink bg-white px-4 py-1 text-sm font-bold peer-checked:bg-cobalt peer-checked:text-white peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-cobalt">
            {choice.label}
          </span>
        </label>
      ))}
    </fieldset>
  );
}
