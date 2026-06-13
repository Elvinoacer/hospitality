"use client";
// ─── PriceRangeSlider ──────────────────────────────────────────────────────────
// Place at: components/hotels/PriceRangeSlider.tsx
//
// Accessible dual-thumb slider for the KES price-per-night filter (FR-H-02).
// Built with two overlapping <input type="range"> elements (the CSS-trick
// approach that avoids any JS drag logic and works with keyboard + screen readers).
//
// Drop-in replacement for the bare <input type="number"> pair in HotelFiltersPanel:
//
//   <PriceRangeSlider
//     min={1000}
//     max={100000}
//     step={500}
//     currentMin={Number(currentParams.priceMin) || 1000}
//     currentMax={Number(currentParams.priceMax) || 100000}
//     onChangeMin={(v) => updateFilters({ priceMin: String(v) })}
//     onChangeMax={(v) => updateFilters({ priceMax: String(v) })}
//   />

import { useCallback, useId } from "react";

interface PriceRangeSliderProps {
  min?: number;
  max?: number;
  step?: number;
  currentMin: number;
  currentMax: number;
  onChangeMin: (value: number) => void;
  onChangeMax: (value: number) => void;
}

/** Format a KES amount compactly: 1 500 → "1.5K", 25 000 → "25K" */
function fmtKES(n: number): string {
  if (n >= 1_000_000)
    return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toLocaleString("en-KE");
}

export default function PriceRangeSlider({
  min = 1_000,
  max = 100_000,
  step = 500,
  currentMin,
  currentMax,
  onChangeMin,
  onChangeMax,
}: PriceRangeSliderProps) {
  const id = useId();
  const minId = `${id}-min`;
  const maxId = `${id}-max`;

  // Thumb fill percentages for the track highlight
  const pct = useCallback(
    (v: number) => ((v - min) / (max - min)) * 100,
    [min, max],
  );

  const leftPct = pct(currentMin);
  const rightPct = pct(currentMax);

  const handleMin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = Math.min(Number(e.target.value), currentMax - step);
    onChangeMin(next);
  };

  const handleMax = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = Math.max(Number(e.target.value), currentMin + step);
    onChangeMax(next);
  };

  return (
    <div className="space-y-3">
      {/* ── Price labels ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-800">
          KES {currentMin.toLocaleString("en-KE")}
        </span>
        <span className="text-xs text-gray-400">to</span>
        <span className="text-sm font-semibold text-gray-800">
          KES {currentMax.toLocaleString("en-KE")}
        </span>
      </div>

      {/* ── Dual-thumb track ─────────────────────────────────────────── */}
      <div className="relative h-5 flex items-center">
        {/* Track background */}
        <div className="absolute left-0 right-0 h-1.5 rounded-full bg-gray-200" />

        {/* Active range highlight */}
        <div
          className="absolute h-1.5 rounded-full bg-emerald-500"
          style={{ left: `${leftPct}%`, right: `${100 - rightPct}%` }}
          aria-hidden="true"
        />

        {/* Min thumb */}
        <input
          id={minId}
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentMin}
          onChange={handleMin}
          aria-label={`Minimum price: KES ${currentMin.toLocaleString("en-KE")}`}
          className="
            absolute w-full h-1.5 appearance-none bg-transparent cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-emerald-500
            [&::-webkit-slider-thumb]:shadow-sm
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:hover:scale-110
            [&::-moz-range-thumb]:w-4
            [&::-moz-range-thumb]:h-4
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-white
            [&::-moz-range-thumb]:border-2
            [&::-moz-range-thumb]:border-emerald-500
            [&::-moz-range-thumb]:shadow-sm
            focus:outline-none
            focus-visible:[&::-webkit-slider-thumb]:ring-2
            focus-visible:[&::-webkit-slider-thumb]:ring-emerald-400
            focus-visible:[&::-webkit-slider-thumb]:ring-offset-2
          "
          // Keep min thumb below max thumb in z-order when they overlap
          style={{ zIndex: currentMin > max - step ? 5 : 3 }}
        />

        {/* Max thumb */}
        <input
          id={maxId}
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentMax}
          onChange={handleMax}
          aria-label={`Maximum price: KES ${currentMax.toLocaleString("en-KE")}`}
          className="
            absolute w-full h-1.5 appearance-none bg-transparent cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-emerald-500
            [&::-webkit-slider-thumb]:shadow-sm
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:hover:scale-110
            [&::-moz-range-thumb]:w-4
            [&::-moz-range-thumb]:h-4
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-white
            [&::-moz-range-thumb]:border-2
            [&::-moz-range-thumb]:border-emerald-500
            [&::-moz-range-thumb]:shadow-sm
            focus:outline-none
            focus-visible:[&::-webkit-slider-thumb]:ring-2
            focus-visible:[&::-webkit-slider-thumb]:ring-emerald-400
            focus-visible:[&::-webkit-slider-thumb]:ring-offset-2
          "
          style={{ zIndex: 4 }}
        />
      </div>

      {/* ── Tick labels (min / mid / max) ─────────────────────────────── */}
      <div className="flex justify-between text-xs text-gray-400">
        <span>{fmtKES(min)}</span>
        <span>{fmtKES(Math.round((min + max) / 2))}</span>
        <span>{fmtKES(max)}</span>
      </div>
    </div>
  );
}
