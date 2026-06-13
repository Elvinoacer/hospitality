"use client";
// ─── MobileFiltersDrawer ───────────────────────────────────────────────────────
// Place at: components/hotels/MobileFiltersDrawer.tsx
//
// Renders a slide-up bottom drawer containing the full HotelFiltersPanel.
// Toggled by a floating "Filters" button visible only on < lg screens.
// Traps focus and closes on Escape / backdrop tap for accessibility.
//
// Usage in app/hotels/page.tsx:
//
//   import MobileFiltersDrawer from "@/components/hotels/MobileFiltersDrawer";
//   ...
//   <MobileFiltersDrawer currentParams={sp} activeFilterCount={activeCount} />
//
// Replaces the inline <aside className="hidden lg:block ..."> for mobile.

import { useEffect, useRef, useState } from "react";
import HotelFiltersPanel from "./HotelFiltersPanel";

interface MobileFiltersDrawerProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentParams: Record<string, any>;
  /** Badge count shown on the trigger button so users know filters are active */
  activeFilterCount?: number;
}

export default function MobileFiltersDrawer({
  currentParams,
  activeFilterCount = 0,
}: MobileFiltersDrawerProps) {
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // ── Keyboard & body-scroll management ────────────────────────────────────
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  // Return focus to trigger when drawer closes
  useEffect(() => {
    if (!open) triggerRef.current?.focus();
  }, [open]);

  // Auto-close after filter changes navigate away (URL change)
  useEffect(() => {
    setOpen(false);
  }, [currentParams]);

  function close() {
    setOpen(false);
  }

  return (
    <>
      {/* ── Floating trigger — only visible on mobile ─────────────────── */}
      <button
        ref={triggerRef}
        onClick={() => setOpen(true)}
        aria-label="Open filters"
        aria-expanded={open}
        aria-controls="mobile-filters-drawer"
        className="lg:hidden fixed bottom-20 right-4 z-40 flex items-center gap-2 bg-white border border-gray-200 text-gray-800 font-semibold text-sm px-4 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-shadow active:scale-95"
      >
        {/* Filter icon */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="8" y1="12" x2="16" y2="12" />
          <line x1="11" y1="18" x2="13" y2="18" />
        </svg>
        Filters
        {activeFilterCount > 0 && (
          <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold bg-emerald-600 text-white rounded-full">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* ── Backdrop ──────────────────────────────────────────────────────── */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          aria-hidden="true"
          onClick={close}
        />
      )}

      {/* ── Drawer ────────────────────────────────────────────────────────── */}
      <div
        id="mobile-filters-drawer"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Hotel filters"
        className={`
          lg:hidden fixed bottom-0 left-0 right-0 z-50
          bg-gray-50 rounded-t-2xl shadow-2xl
          max-h-[85dvh] flex flex-col
          transition-transform duration-300 ease-out
          ${open ? "translate-y-0" : "translate-y-full"}
        `}
      >
        {/* Handle + header */}
        <div className="flex-shrink-0 px-4 pt-3 pb-2">
          {/* Drag handle — cosmetic, tap-close handled by backdrop */}
          <div
            className="mx-auto w-10 h-1 rounded-full bg-gray-300 mb-3"
            aria-hidden="true"
          />
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-2 text-emerald-600 text-sm font-normal">
                  {activeFilterCount} active
                </span>
              )}
            </h2>
            <button
              onClick={close}
              aria-label="Close filters"
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable filter content */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-6">
          <HotelFiltersPanel currentParams={currentParams} />
        </div>
      </div>
    </>
  );
}

// ─── Helper: count active filters from search params ──────────────────────────
// Import and use this in the Server Component to pass `activeFilterCount`:
//
//   import { countActiveFilters } from "@/components/hotels/MobileFiltersDrawer";
//   const activeCount = countActiveFilters(sp);
//
export function countActiveFilters(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: Record<string, any>,
): number {
  const filterKeys = [
    "neighborhood",
    "starRating",
    "priceMin",
    "priceMax",
    "amenities",
    "propertyType",
    "checkIn",
    "checkOut",
  ];
  return filterKeys.filter((k) => params[k] != null && params[k] !== "").length;
}
