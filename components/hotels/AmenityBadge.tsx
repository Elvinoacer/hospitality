// ─── AmenityBadge Component ───────────────────────────────────────────────────
// Place at: components/hotels/AmenityBadge.tsx

import type { AmenityKey } from "@/types/hotel";
import { AMENITIES } from "@/lib/amenities";

interface AmenityBadgeProps {
  amenityKey: AmenityKey;
}

export default function AmenityBadge({ amenityKey }: AmenityBadgeProps) {
  const meta = AMENITIES[amenityKey];
  if (!meta) return null;

  return (
    <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
      <svg
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-emerald-600"
      >
        <path d={meta.iconPath} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {meta.label}
    </span>
  );
}
