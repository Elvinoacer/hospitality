"use client";
// ─── BookingBar Component ─────────────────────────────────────────────────────
// Place at: components/hotels/BookingBar.tsx
//
// Sticky "Book a Room" bar that persists during scroll.
// Becomes visible after the user scrolls past the hero section.

import { useEffect, useState } from "react";
import type { Hotel } from "@/types/hotel";

interface BookingBarProps {
  hotel: Hotel;
}

export default function BookingBar({ hotel }: BookingBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 380);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!visible}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Hotel summary */}
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 truncate text-sm sm:text-base">
            {hotel.name}
          </p>
          <p className="text-xs sm:text-sm text-gray-500">
            From{" "}
            <span className="font-bold text-gray-900">
              KES {hotel.priceFrom.toLocaleString()}
            </span>{" "}
            / night
          </p>
        </div>

        {/* Date pickers (compact) */}
        <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
          <input
            type="date"
            aria-label="Check-in date"
            className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <span className="text-gray-400 text-xs">→</span>
          <input
            type="date"
            aria-label="Check-out date"
            className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* CTA */}
        <a
          href="#book"
          className="flex-shrink-0 bg-emerald-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-emerald-700 active:scale-95 transition-all"
        >
          Book a Room
        </a>
      </div>
    </div>
  );
}
