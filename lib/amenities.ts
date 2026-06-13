// ─── Amenity Registry ─────────────────────────────────────────────────────────
// Place at: lib/amenities.ts
//
// Each entry provides:
//  • label   — human-readable string shown in the UI
//  • icon    — inline SVG path data (24×24 viewBox, stroke-based, Lucide style)
//
// Usage:
//   import { AMENITIES } from "@/lib/amenities";
//   const { label, icon } = AMENITIES["wifi"];

import type { AmenityKey } from "@/types/hotel";

interface AmenityMeta {
  label: string;
  /** SVG <path> d="" attribute for a 24×24 stroke icon */
  iconPath: string;
}

export const AMENITIES: Record<AmenityKey, AmenityMeta> = {
  wifi: {
    label: "Free Wi-Fi",
    iconPath:
      "M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01",
  },
  pool: {
    label: "Swimming Pool",
    iconPath:
      "M2 12h20M2 8c2-2 4-2 6 0s4 2 6 0 4-2 6 0M2 16c2 2 4 2 6 0s4-2 6 0 4 2 6 0",
  },
  parking: {
    label: "Parking",
    iconPath:
      "M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3M13 21v-6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2zm4-3h2",
  },
  gym: {
    label: "Gym / Fitness",
    iconPath:
      "M6.5 6.5h11M17.5 17.5h-11M3 10a2 2 0 0 1 2-2h1m12 0h1a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-1M5 14H4a2 2 0 0 1-2-2v-4M8 6V4m8 2V4",
  },
  restaurant: {
    label: "Restaurant On-site",
    iconPath:
      "M3 11l19-9-9 19-2-8-8-2zM11 3v2M3 11h2",
  },
  conference_room: {
    label: "Conference Room",
    iconPath:
      "M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0z",
  },
  spa: {
    label: "Spa",
    iconPath:
      "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  },
  airport_transfer: {
    label: "Airport Transfer",
    iconPath:
      "M17.8 19.2L16 11l3.5-3.5C21 6 21 4 19 4s-2 2-3.5 3.5L9 6 4 11l3.5 3.5 3.5-3.5 1.5 5.5 2.5 2.5L17.8 19.2zM5 3l.09.07",
  },
  bar: {
    label: "Bar / Lounge",
    iconPath:
      "M8 22h8M7 10h10M12 15V22M17 5l1-3H6l1 3",
  },
  laundry: {
    label: "Laundry Service",
    iconPath:
      "M3 6a6 6 0 0 1 6-6h6a6 6 0 0 1 6 6v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6zm9 4a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  },
  room_service: {
    label: "Room Service",
    iconPath:
      "M3 17h18M12 3v4m-7 4a7 7 0 0 1 14 0",
  },
  ac: {
    label: "Air Conditioning",
    iconPath:
      "M8 16l-1.5 1.5M8 8L6.5 6.5M16 16l1.5 1.5M16 8l1.5-1.5M3 12h18M12 3v18",
  },
  pet_friendly: {
    label: "Pet Friendly",
    iconPath:
      "M10 5.172C10 3.443 8.799 2 7.5 2S5 3.443 5 5.172V7h5V5.172zm9 0C19 3.443 17.799 2 16.5 2S14 3.443 14 5.172V7h4V5.172zM7 7v3a5 5 0 0 0 10 0V7H7zm5 13v-3m-4 3h8",
  },
  ev_charging: {
    label: "EV Charging",
    iconPath:
      "M5 18H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.19M15 6h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3.19M23 13v-2M11 6l-4 6h6l-4 6",
  },
  rooftop: {
    label: "Rooftop Access",
    iconPath:
      "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10",
  },
  kids_club: {
    label: "Kids Club",
    iconPath:
      "M12 2a5 5 0 1 0 0 10A5 5 0 0 0 12 2zm0 12c-5.33 0-8 2.67-8 4v2h16v-2c0-1.33-2.67-4-8-4z",
  },
};

/** Helper: get only the keys present in a hotel's amenity list */
export function getAmenityMeta(keys: AmenityKey[]): Array<AmenityMeta & { key: AmenityKey }> {
  return keys.map((key) => ({ key, ...AMENITIES[key] }));
}
