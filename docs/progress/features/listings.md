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

## files to track:
