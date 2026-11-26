export const EXAMPLE_PHRASES = [
  "smart casual recruiting mixer",
  "nostalgic festival fits",
  "black tie optional, outdoor wedding",
  "dress to impress",
];

const CHIP_COLORS = ["bg-mint", "bg-lilac", "bg-sky", "bg-butter"];

export function ExampleChips({ disabled, onPick }: { disabled: boolean; onPick: (phrase: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {EXAMPLE_PHRASES.map((phrase, index) => (
        <button
          key={phrase}
          type="button"
          disabled={disabled}
          onClick={() => onPick(phrase)}
          className={`pressable rounded-full px-3 py-1.5 text-sm font-medium disabled:opacity-50 ${CHIP_COLORS[index % CHIP_COLORS.length]}`}
        >
          {phrase}
        </button>
      ))}
    </div>
  );
}
