"use client";
// ─── SortSelect ────────────────────────────────────────────────────────────────
// Place at: components/hotels/SortSelect.tsx
//
// Replaces the inline SortSelect in app/hotels/page.tsx.
//
// Problem with the original:
//   <form method="GET">
//     <select onChange="form.submit()">
// This submits ONLY the `sort` value — it discards every other filter param
// (neighborhood, starRating, priceMin, etc.) that the user already set.
//
// This version reads the full current URL search params and merges the new
// sort value in before navigating, preserving all active filters.
//
// Usage in app/hotels/page.tsx:
//   import SortSelect from "@/components/hotels/SortSelect";
//   ...
//   <SortSelect current={sp.sort ?? "rating_desc"} currentParams={sp} />
//
//   Remove the old inline SortSelect function.

import { useRouter, usePathname } from "next/navigation";
import { useTransition } from "react";
import type { SortOption } from "@/types/hotel";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "rating_desc", label: "Top Rated" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
];

interface SortSelectProps {
  current: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentParams: Record<string, any>;
}

export default function SortSelect({
  current,
  currentParams,
}: SortSelectProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Merge new sort value into all existing params, reset to page 1
    const next: Record<string, string> = {};
    for (const [k, v] of Object.entries(currentParams)) {
      if (v != null && v !== "") next[k] = String(v);
    }
    next.sort = e.target.value;
    delete next.page; // reset pagination on sort change

    const qs = new URLSearchParams(next).toString();
    startTransition(() => {
      router.push(`${pathname}?${qs}`);
    });
  };

  return (
    <div className="relative">
      <select
        value={current}
        onChange={handleChange}
        aria-label="Sort hotels by"
        disabled={isPending}
        className={`
          text-sm border border-gray-200 rounded-lg pl-3 pr-8 py-2
          bg-white text-gray-700
          focus:outline-none focus:ring-2 focus:ring-emerald-500
          appearance-none cursor-pointer
          transition-opacity
          ${isPending ? "opacity-50 cursor-wait" : ""}
        `}
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {/* Custom chevron */}
      <svg
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
}
