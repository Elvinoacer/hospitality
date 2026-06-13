"use client";
// ─── BookingWidget ─────────────────────────────────────────────────────────────
// Place at: components/hotels/BookingWidget.tsx
//
// Stateful sidebar booking widget for the hotel detail page (FR-H-04).
// Replaces the inert PriceSummaryCard — dates are controlled, night count is
// computed live, and the CTA constructs a meaningful booking query string.
//
// Usage:
//   import BookingWidget from "@/components/hotels/BookingWidget";
//   <BookingWidget hotel={hotel} />

import { useState, useMemo } from "react";
import type { Hotel, RoomType } from "@/types/hotel";

interface BookingWidgetProps {
  hotel: Hotel;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function today(): string {
  return new Date().toISOString().split("T")[0];
}

function tomorrow(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

function nightsBetween(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  const ms = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.max(0, Math.round(ms / 86_400_000));
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function BookingWidget({ hotel }: BookingWidgetProps) {
  const [checkIn, setCheckIn] = useState(today());
  const [checkOut, setCheckOut] = useState(tomorrow());
  const [guests, setGuests] = useState(2);
  const [selectedRoomId, setSelectedRoomId] = useState<string>(
    hotel.roomTypes[0]?.id ?? "",
  );

  const selectedRoom: RoomType | undefined = hotel.roomTypes.find(
    (r) => r.id === selectedRoomId,
  );
  const nights = useMemo(
    () => nightsBetween(checkIn, checkOut),
    [checkIn, checkOut],
  );
  const totalPrice = selectedRoom
    ? selectedRoom.pricePerNight * Math.max(nights, 1)
    : 0;

  // Build booking URL (hotel slug + query params → handed off to booking flow)
  const bookingHref = useMemo(() => {
    const p = new URLSearchParams({
      room: selectedRoomId,
      checkIn,
      checkOut,
      guests: String(guests),
    });
    return `#book?${p.toString()}`;
  }, [selectedRoomId, checkIn, checkOut, guests]);

  const handleCheckIn = (v: string) => {
    setCheckIn(v);
    // Push checkout forward if it's now before check-in
    if (v >= checkOut) {
      const d = new Date(v);
      d.setDate(d.getDate() + 1);
      setCheckOut(d.toISOString().split("T")[0]);
    }
  };

  const isValid = nights > 0 && selectedRoom != null;

  const cancellationLabels = {
    free: { text: "Free cancellation", color: "text-emerald-600" },
    partial: { text: "Partial refund", color: "text-amber-600" },
    non_refundable: { text: "Non-refundable", color: "text-red-500" },
  };

  return (
    <div
      id="book"
      className="sticky top-24 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
    >
      {/* ── Price header ─────────────────────────────────────────────── */}
      <div className="px-5 py-4 border-b border-gray-100">
        <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">
          Starting from
        </p>
        <div className="flex items-baseline gap-1.5 mt-1">
          <p className="text-3xl font-bold text-gray-900">
            KES {hotel.priceFrom.toLocaleString("en-KE")}
          </p>
          <span className="text-sm text-gray-400">/ night</span>
        </div>
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* ── Room type selector ─────────────────────────────────────── */}
        {hotel.roomTypes.length > 1 && (
          <div>
            <label
              htmlFor="room-select"
              className="block text-xs font-medium text-gray-600 mb-1.5"
            >
              Room type
            </label>
            <select
              id="room-select"
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              {hotel.roomTypes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} — KES {r.pricePerNight.toLocaleString("en-KE")}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* ── Dates ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label
              htmlFor="widget-checkin"
              className="block text-xs font-medium text-gray-600 mb-1.5"
            >
              Check-in
            </label>
            <input
              id="widget-checkin"
              type="date"
              value={checkIn}
              min={today()}
              onChange={(e) => handleCheckIn(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label
              htmlFor="widget-checkout"
              className="block text-xs font-medium text-gray-600 mb-1.5"
            >
              Check-out
            </label>
            <input
              id="widget-checkout"
              type="date"
              value={checkOut}
              min={checkIn}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* ── Guests ────────────────────────────────────────────────── */}
        <div>
          <label
            htmlFor="widget-guests"
            className="block text-xs font-medium text-gray-600 mb-1.5"
          >
            Guests
          </label>
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button
              type="button"
              aria-label="Remove guest"
              onClick={() => setGuests((g) => Math.max(1, g - 1))}
              className="w-10 h-9 text-gray-500 hover:bg-gray-50 text-lg font-light transition-colors flex items-center justify-center"
            >
              −
            </button>
            <span
              id="widget-guests"
              className="flex-1 text-center text-sm font-medium text-gray-900"
              aria-live="polite"
            >
              {guests} {guests === 1 ? "guest" : "guests"}
            </span>
            <button
              type="button"
              aria-label="Add guest"
              onClick={() =>
                setGuests((g) =>
                  Math.min(
                    g + 1,
                    selectedRoom?.maxOccupancy ??
                      Math.max(...hotel.roomTypes.map((r) => r.maxOccupancy)),
                  ),
                )
              }
              className="w-10 h-9 text-gray-500 hover:bg-gray-50 text-lg font-light transition-colors flex items-center justify-center"
            >
              +
            </button>
          </div>
          {selectedRoom && guests > selectedRoom.maxOccupancy && (
            <p className="mt-1.5 text-xs text-amber-600">
              This room fits up to {selectedRoom.maxOccupancy} guests.
            </p>
          )}
        </div>

        {/* ── Price breakdown ───────────────────────────────────────── */}
        {isValid && nights > 1 && (
          <div className="bg-gray-50 rounded-xl p-3 space-y-1 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>
                KES {selectedRoom!.pricePerNight.toLocaleString("en-KE")} ×{" "}
                {nights} {nights === 1 ? "night" : "nights"}
              </span>
              <span>KES {totalPrice.toLocaleString("en-KE")}</span>
            </div>
            <div className="flex justify-between font-semibold text-gray-900 pt-1 border-t border-gray-200 mt-1">
              <span>Total</span>
              <span>KES {totalPrice.toLocaleString("en-KE")}</span>
            </div>
          </div>
        )}

        {/* ── Cancellation policy ───────────────────────────────────── */}
        {selectedRoom && (
          <p
            className={`text-xs font-medium ${
              cancellationLabels[selectedRoom.cancellationPolicy].color
            }`}
          >
            ✓ {cancellationLabels[selectedRoom.cancellationPolicy].text}
          </p>
        )}

        {/* ── CTA ───────────────────────────────────────────────────── */}
        <a
          href={bookingHref}
          className={`block w-full text-center font-semibold py-3 rounded-xl transition-colors ${
            isValid
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "bg-gray-200 text-gray-400 cursor-not-allowed pointer-events-none"
          }`}
          aria-disabled={!isValid}
        >
          {isValid ? "Book a Room" : "Select valid dates"}
        </a>

        <p className="text-xs text-center text-gray-400">
          No credit card required to enquire
        </p>
      </div>
    </div>
  );
}
