export const EXAMPLE_PHRASES = [
  "smart casual recruiting mixer",
  "nostalgic festival fits",
  "black tie optional, outdoor wedding",
  "dress to impress",
];

export function ExampleChips({ disabled, onPick }: { disabled: boolean; onPick: (phrase: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {EXAMPLE_PHRASES.map((phrase) => (
        <button
          key={phrase}
          type="button"
          disabled={disabled}
          onClick={() => onPick(phrase)}
          className="rounded-full border border-stone-300 bg-white px-3 py-1.5 text-sm hover:border-stone-500 disabled:opacity-50"
        >
          {phrase}
        </button>
      ))}
    </div>
  );
}
