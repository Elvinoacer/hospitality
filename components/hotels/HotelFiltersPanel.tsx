"use client";
// ─── HotelFiltersPanel Component ─────────────────────────────────────────────
// Place at: components/hotels/HotelFiltersPanel.tsx
//
// Client component: manages local filter state and syncs to the URL
// via router.push so the Server Component re-fetches with new params.

import { useRouter, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import type { AmenityKey, PropertyType } from "@/types/hotel";
import { AMENITIES } from "@/lib/amenities";

const NEIGHBORHOODS = [
  "Nairobi CBD",
  "Westlands",
  "Karen",
  "Kilimani",
  "South Nairobi",
  "Mombasa Island",
  "Diani Beach",
  "Nyali",
  "Nakuru",
  "Kisumu",
  "Malindi",
  "Nanyuki",
  "Amboseli",
  "Maasai Mara",
];

const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: "hotel", label: "Hotel" },
  { value: "lodge", label: "Lodge" },
  { value: "camp", label: "Safari Camp" },
  { value: "apartment", label: "Serviced Apartment" },
  { value: "boutique", label: "Boutique" },
];

const FEATURED_AMENITIES: AmenityKey[] = [
  "wifi",
  "pool",
  "parking",
  "gym",
  "restaurant",
  "spa",
  "conference_room",
  "pet_friendly",
];

interface FiltersState {
  neighborhood?: string;
  starRating?: string;
  priceMin?: string;
  priceMax?: string;
  amenities?: string;
  propertyType?: string;
  checkIn?: string;
  checkOut?: string;
}

interface HotelFiltersPanelProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentParams: Record<string, any>;
}

export default function HotelFiltersPanel({ currentParams }: HotelFiltersPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const updateFilters = useCallback(
    (updates: Partial<FiltersState>) => {
      const next = { ...currentParams, ...updates };
      // Reset to page 1 on filter change
      delete next.page;
      // Remove empty strings
      Object.keys(next).forEach((k) => {
        if (next[k] === "" || next[k] === undefined) delete next[k];
      });
      const qs = new URLSearchParams(next).toString();
      startTransition(() => {
        router.push(`${pathname}?${qs}`);
      });
    },
    [currentParams, pathname, router]
  );

  const toggleMulti = (
    field: "starRating" | "amenities" | "propertyType",
    value: string
  ) => {
    const current = currentParams[field]?.split(",").filter(Boolean) ?? [];
    const updated = current.includes(value)
      ? current.filter((v: string) => v !== value)
      : [...current, value];
    updateFilters({ [field]: updated.join(",") || undefined });
  };

  const starRatings = currentParams.starRating?.split(",").filter(Boolean) ?? [];
  const selectedAmenities = currentParams.amenities?.split(",").filter(Boolean) ?? [];
  const selectedTypes = currentParams.propertyType?.split(",").filter(Boolean) ?? [];

  return (
    <div className={`bg-white rounded-2xl border border-gray-200 p-5 space-y-6 ${isPending ? "opacity-60 pointer-events-none" : ""}`}>
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">Filters</h2>
        <button
          onClick={() => router.push(pathname)}
          className="text-xs text-emerald-600 hover:underline"
        >
          Clear all
        </button>
      </div>

      {/* ── Location ──────────────────────────────────────────── */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Location
        </label>
        <select
          value={currentParams.neighborhood ?? ""}
          onChange={(e) => updateFilters({ neighborhood: e.target.value || undefined })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">All locations</option>
          {NEIGHBORHOODS.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      {/* ── Availability dates ─────────────────────────────────── */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Availability
        </label>
        <div className="space-y-2">
          <input
            type="date"
            placeholder="Check-in"
            value={currentParams.checkIn ?? ""}
            onChange={(e) => updateFilters({ checkIn: e.target.value || undefined })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <input
            type="date"
            placeholder="Check-out"
            value={currentParams.checkOut ?? ""}
            onChange={(e) => updateFilters({ checkOut: e.target.value || undefined })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* ── Star rating ───────────────────────────────────────── */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Star Rating
        </label>
        <div className="flex flex-wrap gap-2">
          {[5, 4, 3, 2, 1].map((star) => (
            <button
              key={star}
              onClick={() => toggleMulti("starRating", String(star))}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-sm transition-colors ${
                starRatings.includes(String(star))
                  ? "bg-amber-400 border-amber-400 text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:border-amber-300"
              }`}
            >
              {"★".repeat(star)}
            </button>
          ))}
        </div>
      </div>

      {/* ── Price range ───────────────────────────────────────── */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price per Night (KES)
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={currentParams.priceMin ?? ""}
            onChange={(e) => updateFilters({ priceMin: e.target.value || undefined })}
            className="w-1/2 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <input
            type="number"
            placeholder="Max"
            value={currentParams.priceMax ?? ""}
            onChange={(e) => updateFilters({ priceMax: e.target.value || undefined })}
            className="w-1/2 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* ── Property type ─────────────────────────────────────── */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property Type
        </label>
        <div className="space-y-2">
          {PROPERTY_TYPES.map(({ value, label }) => (
            <label key={value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedTypes.includes(value)}
                onChange={() => toggleMulti("propertyType", value)}
                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* ── Amenities ─────────────────────────────────────────── */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Amenities
        </label>
        <div className="space-y-2">
          {FEATURED_AMENITIES.map((key) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedAmenities.includes(key)}
                onChange={() => toggleMulti("amenities", key)}
                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm text-gray-700">
                {AMENITIES[key].label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
