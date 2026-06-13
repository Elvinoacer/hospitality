### Feature 1 — Hotel Listings

#### 4.1.1 Description

A publicly searchable directory of hotels, lodges, safari camps, and serviced apartments across Kenya.

#### 4.1.2 Functional Requirements

**FR-H-01** — Each hotel listing must display:

- Name, description (up to 1,000 characters), star rating
- Address, neighborhood/county, GPS coordinates
- Cover image + gallery (up to 20 images)
- Available room types with names, descriptions, capacity, bed type, and price per night
- Amenities (Wi-Fi, pool, parking, gym, restaurant on-site, conference room, etc.) rendered as icon tags
- Verified badge if vendor has completed KYC

**FR-H-02** — Listings must be filterable by:

- Location / neighborhood (Nairobi, Mombasa, Nakuru, Kisumu, Malindi, etc.)
- Star rating (1–5 stars)
- Price range per night (KES min–max slider)
- Amenities (multi-select checkboxes)
- Availability date range (check-in / check-out picker)
- Property type (hotel, lodge, camp, apartment, boutique)

**FR-H-03** — Each listing must have a canonical public URL: `/hotels/[slug]`

**FR-H-04** — A hotel listing page must include:

- Sticky "Book a Room" CTA bar that persists during scroll
- Embedded Google Maps showing the exact property pin
- Reviews section (aggregated rating + individual reviews)
- Related hotels in the same neighborhood

**FR-H-05** — Search results must display a grid/list toggle, with each card showing:

- Thumbnail, name, neighborhood, star rating, price from (per night), and a "View" CTA

**FR-H-06** — The system must support pagination (20 results per page) or infinite scroll on listing pages.

#### 4.1.3 Non-Functional Requirements

- Hotel listing page must achieve a Lighthouse mobile performance score ≥ 85
- Images must be served in WebP format with lazy loading
- Listings must be indexed by search engines (SSR or SSG via Next.js)

---

## Tracked files

### ✅ Completed

| File                                      | Requirement(s)                     | Notes                                                                                                                                  |
| ----------------------------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `types/hotel.ts`                          | FR-H-01, FR-H-02                   | Full domain model: Hotel, RoomType, Review, HotelFilters, PaginatedHotels                                                              |
| `lib/amenities.ts`                        | FR-H-01                            | Icon registry (16 amenity keys → label + SVG path)                                                                                     |
| `lib/hotels.ts`                           | FR-H-02, FR-H-06                   | searchHotels (filter + sort + paginate), getHotelBySlug, getRelatedHotels, getAllHotelSlugs — mock data, Prisma-ready                  |
| `components/hotels/AmenityBadge.tsx`      | FR-H-01                            | Icon-tag badge; reads from AMENITIES registry                                                                                          |
| `components/hotels/StarRating.tsx`        | FR-H-01, FR-H-05                   | 1–5 star display; sm/md/lg sizes; aria-label                                                                                           |
| `components/hotels/BookingBar.tsx`        | FR-H-04                            | Sticky bottom bar; scroll-aware visibility; compact date pickers                                                                       |
| `components/hotels/HotelFiltersPanel.tsx` | FR-H-02                            | All filters: location, dates, stars, price, property type, amenities; URL-synced via router.push                                       |
| `app/hotels/page.tsx`                     | FR-H-02, FR-H-03, FR-H-05, FR-H-06 | SSR directory page; grid/list toggle; pagination; OG metadata; filters sidebar (desktop only)                                          |
| `app/hotels/[slug]/page.tsx`              | FR-H-01, FR-H-03, FR-H-04          | SSG detail page; image gallery; amenities grid; room cards; Google Maps embed; reviews; related hotels; Schema.org JSON-LD; BookingBar |

### ✅ Completed (this batch)

| File                                        | Requirement(s)   | What it fixes                                                                                                                                                                |
| ------------------------------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `components/hotels/MobileFiltersDrawer.tsx` | FR-H-02          | Filters were `hidden lg:block` — mobile users had no way to filter. Adds a slide-up bottom drawer with active-filter badge count and focus trap.                             |
| `components/hotels/PriceRangeSlider.tsx`    | FR-H-02          | Spec requires a KES min–max slider; implementation had bare `<input type="number">` fields. Dual-thumb accessible range slider with live price display.                      |
| `components/hotels/BookingWidget.tsx`       | FR-H-04          | `PriceSummaryCard` had uncontrolled date inputs with no state. Stateful client component: room selector, date validation, guest counter, live price breakdown, booking href. |
| `components/hotels/SortSelect.tsx`          | FR-H-02, FR-H-05 | `SortSelect` used `<form method="GET">` which submitted only `sort`, stripping all filter params. Now merges new sort into existing params via router.push.                  |
| `docs/progress/features/listings.md`        | —                | This file — tracks all implemented files and remaining gaps.                                                                                                                 |

---

## Remaining gaps

### Must-do before FR sign-off

| Gap                                                           | Requirement | File(s) to create                                                                                                                                                                        |
| ------------------------------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Wire `MobileFiltersDrawer` into `app/hotels/page.tsx`         | FR-H-02     | Edit `app/hotels/page.tsx`: import + render `<MobileFiltersDrawer>`, swap `SortSelect` inline fn for the new component                                                                   |
| Wire `BookingWidget` into `app/hotels/[slug]/page.tsx`        | FR-H-04     | Replace `<PriceSummaryCard>` with `<BookingWidget hotel={hotel} />` in the aside                                                                                                         |
| Wire `PriceRangeSlider` into `HotelFiltersPanel`              | FR-H-02     | Replace the two `<input type="number">` price fields with `<PriceRangeSlider>`                                                                                                           |
| Schema.org `<script type="application/ld+json">` not rendered | NFR (SEO)   | Next.js `metadata.other["script:ld+json"]` does **not** inject a `<script>` tag. Move JSON-LD into a `<script dangerouslySetInnerHTML>` inside the page JSX, or use a `JsonLd` component |
| Google Maps API key is hardcoded fallback                     | FR-H-04     | `NEXT_PUBLIC_GOOGLE_MAPS_KEY` must be set in `.env.local`; map shows error without it                                                                                                    |
| `app/hotels/page.tsx` `ViewToggle` drops filter params        | FR-H-05     | `<Link href={{ query: { view: "grid" } }}>` clobbers all other params — same bug as SortSelect. Merge `view` into `currentParams` like SortSelect does                                   |
| No `<HotelSearchBar>` (free-text `q` param)                   | FR-H-02     | A search input component that writes `?q=` to the URL alongside other filters                                                                                                            |
| Image gallery is static (no lightbox / "show all")            | FR-H-01     | The "+N more" overlay on the gallery is non-interactive — tapping it does nothing                                                                                                        |
| No `next.config.ts` image domains allowlist                   | NFR         | `remotePatterns` must include `images.unsplash.com` (and eventually Cloudinary/S3) or Next.js `<Image>` throws at runtime                                                                |
