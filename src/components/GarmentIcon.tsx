import type { ReactNode } from "react";
import type { Garment } from "@/lib/schema";

// Simple line drawings on a 24x24 grid. The Record type fails the build if one is missing.
const PATHS: Record<Garment, ReactNode> = {
  shirt: <path d="M9 3 4 5 2 11l3 1 1-2v11h12V10l1 2 3-1-2-6-5-2-3 3-3-3Zm3 3v15" />,
  tee: <path d="M8 3 3 6l2 5 2-1v11h10V10l2 1 2-5-5-3c-1 3-7 3-8 0Z" />,
  knit: <path d="M9 3 5 5 2 18h3l2-8v11h10V10l2 8h3L19 5l-4-2c-1 2-5 2-6 0ZM7 18h10" />,
  jacket: <path d="M9 3 4 6 3 21h4V11m8-8 5 3 1 15h-4V11M7 21h10V10M7 21V10m2-7 3 10 3-10M12 13v8" />,
  trousers: <path d="M7 3h10l2 18h-5l-2-12-2 12H5L7 3Zm0 3h10" />,
  shorts: <path d="M6 5h12l2 12h-6l-2-6-2 6H4L6 5Zm0 3h12" />,
  skirt: <path d="M8 4h8l4 16H4L8 4Zm0 3h8" />,
  dress: <path d="M9 2v4l1 4-5 11h14l-5-11 1-4V2m-6 4c1 2 5 2 6 0m-5 4h4" />,
  shoes: <path d="M3 9h5c1 3 4 4 8 5s5 2 5 4H3V9Zm0 9v2h4v-2" />,
  sneakers: <path d="M3 8h5l2 3 7 3c3 1 4 2 4 5H3V8Zm0 8h18M10 11l-1 2m4 0-1 2" />,
  boots: <path d="M7 3h7v10l5 3c2 1 2 2 2 4H7V3Zm0 14h14M7 7h7" />,
  sandals: <path d="M3 18h18v2H3v-2Zm3 0c0-5 4-7 6-2m0 2c1-6 6-6 7 0M4 18v-6" />,
  tie: <path d="M9 3h6l-2 4 3 10-4 4-4-4 3-10-2-4Zm2 4h2" />,
  bag: <path d="M4 9h16l-1 12H5L4 9Zm4 0V7a4 4 0 0 1 8 0v2" />,
  jewelry: <path d="M6 3h12l3 6-9 12L3 9l3-6ZM3 9h18M9 3 8 9l4 12 4-12-1-6" />,
  glasses: <path d="M2 11h8v2a4 4 0 0 1-8 0v-2Zm12 0h8v2a4 4 0 0 1-8 0v-2Zm-4 1h4M2 11l2-5m18 5-2-5" />,
  hat: <path d="M2 17h20M6 17v-5a6 6 0 0 1 12 0v5M6 14h12" />,
  other: <path d="M12 9V8a2.5 2.5 0 1 0-2.500-2.500M12 9l9 7c1 1 0 2-1 2H4c-1 0-2-1-1-2l9-7Z" />,
};

export function GarmentIcon({ garment }: { garment: Garment }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-8 w-8"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {PATHS[garment]}
    </svg>
  );
}
