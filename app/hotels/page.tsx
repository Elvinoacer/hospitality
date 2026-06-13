// ─── Hotels Directory Page ─────────────────────────────────────────────────────
// Place at: app/hotels/page.tsx
//
// This is a React Server Component. All data is fetched server-side, making it
// fully SEO-indexable with no client JS needed for the initial render.
//
// URL pattern:  /hotels?neighborhood=Nairobi&starRating=4,5&priceMin=5000&page=2

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { searchHotels } from "@/lib/hotels";
import type {
  HotelSearchParams,
  AmenityKey,
  PropertyType,
  SortOption,
} from "@/types/hotel";
import HotelFiltersPanel from "@/components/hotels/HotelFiltersPanel";
import StarRating from "@/components/hotels/StarRating";
import AmenityBadge from "@/components/hotels/AmenityBadge";

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Hotels in Kenya — HamuKenya",
  description:
    "Browse and book hotels, lodges, safari camps, and serviced apartments across Kenya. Filter by location, price, star rating, and amenities.",
  openGraph: {
    title: "Hotels in Kenya — HamuKenya",
    description:
      "Discover the best hotels across Nairobi, Mombasa, Nakuru, Kisumu, and beyond.",
    type: "website",
  },
};

// ─── Page props ───────────────────────────────────────────────────────────────

interface PageProps {
  searchParams: Promise<{
    neighborhood?: string;
    starRating?: string;       // comma-separated: "4,5"
    priceMin?: string;
    priceMax?: string;
    amenities?: string;        // comma-separated amenity keys
    propertyType?: string;     // comma-separated types
    checkIn?: string;
    checkOut?: string;
    sort?: string;
    page?: string;
    view?: "grid" | "list";
    q?: string;
  }>;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function HotelsPage({ searchParams }: PageProps) {
  const sp = await searchParams;

  const params: HotelSearchParams = {
    neighborhood: sp.neighborhood,
    starRating: sp.starRating?.split(",").map(Number),
    priceMin: sp.priceMin ? Number(sp.priceMin) : undefined,
    priceMax: sp.priceMax ? Number(sp.priceMax) : undefined,
    amenities: sp.amenities?.split(",") as AmenityKey[] | undefined,
    propertyType: sp.propertyType?.split(",") as PropertyType[] | undefined,
    checkIn: sp.checkIn,
    checkOut: sp.checkOut,
    sort: (sp.sort as SortOption) ?? "rating_desc",
    page: sp.page ? Number(sp.page) : 1,
    limit: 20,
    q: sp.q,
  };

  const { hotels, total, totalPages, page } = await searchHotels(params);
  const view = sp.view ?? "grid";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Page header ───────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Hotels in Kenya
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {total.toLocaleString()} {total === 1 ? "property" : "properties"}{" "}
            found
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* ── Filters sidebar ───────────────────────────── */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <HotelFiltersPanel currentParams={sp} />
          </aside>

          {/* ── Results area ──────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {/* Grid / list toggle */}
                <ViewToggle current={view} />
              </div>

              {/* Sort */}
              <SortSelect current={(sp.sort as SortOption) ?? "rating_desc"} />
            </div>

            {/* Hotel cards */}
            {hotels.length === 0 ? (
              <EmptyState />
            ) : (
              <div
                className={
                  view === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "flex flex-col gap-4"
                }
              >
                {hotels.map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} view={view} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                searchParams={sp}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ViewToggle({ current }: { current: string }) {
  return (
    <div className="flex rounded-lg border border-gray-200 overflow-hidden">
      <Link
        href={{ query: { view: "grid" } }}
        className={`p-2 ${
          current === "grid"
            ? "bg-emerald-600 text-white"
            : "bg-white text-gray-500 hover:bg-gray-50"
        }`}
        aria-label="Grid view"
      >
        <GridIcon />
      </Link>
      <Link
        href={{ query: { view: "list" } }}
        className={`p-2 ${
          current === "list"
            ? "bg-emerald-600 text-white"
            : "bg-white text-gray-500 hover:bg-gray-50"
        }`}
        aria-label="List view"
      >
        <ListIcon />
      </Link>
    </div>
  );
}

function SortSelect({ current }: { current: string }) {
  const options: { value: SortOption; label: string }[] = [
    { value: "rating_desc", label: "Top Rated" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "newest", label: "Newest First" },
  ];

  return (
    <form method="GET">
      <select
        name="sort"
        defaultValue={current}
        onChange={(e) => {
          (e.target.closest("form") as HTMLFormElement).submit();
        }}
        className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </form>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function HotelCard({ hotel, view }: { hotel: any; view: string }) {
  const cover = hotel.images[0];
  const isGrid = view === "grid";

  return (
    <Link
      href={`/hotels/${hotel.slug}`}
      className={`group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex ${
        isGrid ? "flex-col" : "flex-row"
      }`}
    >
      {/* Image */}
      <div
        className={`relative flex-shrink-0 overflow-hidden ${
          isGrid ? "w-full h-48" : "w-48 h-36"
        }`}
      >
        {cover ? (
          <Image
            src={cover.webpUrl || cover.url}
            alt={cover.alt}
            fill
            sizes={isGrid ? "(max-width: 768px) 100vw, 33vw" : "192px"}
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-xs">No image</span>
          </div>
        )}
        {hotel.isVerified && (
          <span className="absolute top-2 left-2 bg-emerald-600 text-white text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
            <VerifiedIcon />
            Verified
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs text-emerald-600 font-medium uppercase tracking-wide truncate">
              {hotel.neighborhood}
            </p>
            <h2 className="mt-0.5 text-base font-semibold text-gray-900 truncate group-hover:text-emerald-700 transition-colors">
              {hotel.name}
            </h2>
          </div>
          <StarRating rating={hotel.starRating} size="sm" />
        </div>

        {/* Amenity badges (first 4) */}
        <div className="mt-2 flex flex-wrap gap-1">
          {hotel.amenities.slice(0, 4).map((key: AmenityKey) => (
            <AmenityBadge key={key} amenityKey={key} />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-3 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400">From</span>
            <p className="text-lg font-bold text-gray-900">
              KES {hotel.priceFrom.toLocaleString()}
            </p>
            <span className="text-xs text-gray-400">per night</span>
          </div>
          <span className="text-sm font-medium text-emerald-600 border border-emerald-200 rounded-lg px-3 py-1.5 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}

function Pagination({
  currentPage,
  totalPages,
  searchParams,
}: {
  currentPage: number;
  totalPages: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchParams: Record<string, any>;
}) {
  const makeHref = (p: number) => {
    const qs = new URLSearchParams({ ...searchParams, page: String(p) });
    return `/hotels?${qs.toString()}`;
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      className="mt-10 flex items-center justify-center gap-1"
      aria-label="Pagination"
    >
      {currentPage > 1 && (
        <Link
          href={makeHref(currentPage - 1)}
          className="px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white hover:bg-gray-50"
        >
          ← Prev
        </Link>
      )}
      {pages.map((p) => (
        <Link
          key={p}
          href={makeHref(p)}
          className={`w-9 h-9 flex items-center justify-center text-sm rounded-lg border ${
            p === currentPage
              ? "bg-emerald-600 text-white border-emerald-600"
              : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
          }`}
          aria-current={p === currentPage ? "page" : undefined}
        >
          {p}
        </Link>
      ))}
      {currentPage < totalPages && (
        <Link
          href={makeHref(currentPage + 1)}
          className="px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white hover:bg-gray-50"
        >
          Next →
        </Link>
      )}
    </nav>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-4xl mb-4">🏨</p>
      <h3 className="text-lg font-semibold text-gray-800">No hotels found</h3>
      <p className="mt-2 text-sm text-gray-500">
        Try adjusting your filters or search terms.
      </p>
      <Link
        href="/hotels"
        className="mt-6 text-sm font-medium text-emerald-600 hover:underline"
      >
        Clear all filters
      </Link>
    </div>
  );
}

// ─── Inline SVG icons (avoid external deps) ───────────────────────────────────

function GridIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}

function VerifiedIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
