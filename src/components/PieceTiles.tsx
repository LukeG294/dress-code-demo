import type { Piece } from "@/lib/schema";
import { GarmentIcon } from "./GarmentIcon";

// Colors and tilts repeat by position, so every outfit gets the same playful rhythm.
const TILE_STYLES = ["bg-mint -rotate-1", "bg-lilac rotate-1", "bg-sky rotate-1", "bg-butter -rotate-1", "bg-mint"];

export function PieceTiles({ pieces }: { pieces: Piece[] }) {
  // Two or four pieces sit in two columns, so no tile is left stretched on its own.
  const columns = pieces.length === 2 || pieces.length === 4 ? "grid-cols-2" : "grid-cols-3";

  return (
    <ul className={`grid gap-2 ${columns}`}>
      {pieces.map((piece, index) => (
        <li
          key={`${piece.garment}-${piece.item}`}
          className={`flex flex-col items-center gap-2 rounded-2xl border-2 border-ink px-2 py-3 text-center text-sm leading-tight font-bold ${TILE_STYLES[index % TILE_STYLES.length]}`}
        >
          <GarmentIcon garment={piece.garment} />
          {piece.item}
        </li>
      ))}
    </ul>
  );
}
