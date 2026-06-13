// ─── Hotel Data Access Layer ───────────────────────────────────────────────────
// Place at: lib/hotels.ts
//
// All functions are async server-side helpers used in Server Components and
// Route Handlers. They abstract the data source (currently a mock; swap in
// Prisma calls when the DB schema is ready).
//
// When migrating to Prisma replace the body of each function — the call-site
// API stays identical.

import type {
  Hotel,
  HotelSearchParams,
  PaginatedHotels,
} from "@/types/hotel";

// ─── Mock data (replace with Prisma queries) ──────────────────────────────────
// Import from a seed file or your Prisma client:
//   import { prisma } from "@/lib/prisma";

const MOCK_HOTELS: Hotel[] = [
  {
    id: "h1",
    slug: "sarova-stanley-nairobi",
    name: "Sarova Stanley",
    description:
      "Nairobi's most iconic landmark hotel, opened in 1902. Centrally located on the corner of Kenyatta Avenue and Kimathi Street, just a short distance from key business and shopping districts.",
    starRating: 5,
    propertyType: "hotel",
    address: "Corner of Kenyatta Avenue & Kimathi Street, Nairobi CBD",
    neighborhood: "Nairobi CBD",
    county: "Nairobi",
    coordinates: { lat: -1.2841, lng: 36.8215 },
    images: [
      {
        id: "img1",
        url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
        webpUrl:
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&fm=webp",
        alt: "Sarova Stanley exterior",
        order: 0,
      },
    ],
    roomTypes: [
      {
        id: "rt1",
        name: "Classic Double",
        description: "Comfortable room with city views and classic decor.",
        maxOccupancy: 2,
        bedType: "double",
        pricePerNight: 18000,
        quantity: 20,
        amenities: ["wifi", "ac", "room_service"],
        images: [],
        cancellationPolicy: "free",
      },
      {
        id: "rt2",
        name: "Executive Suite",
        description: "Spacious suite with a lounge area and premium amenities.",
        maxOccupancy: 3,
        bedType: "king",
        pricePerNight: 45000,
        quantity: 5,
        amenities: ["wifi", "ac", "room_service", "spa"],
        images: [],
        cancellationPolicy: "partial",
      },
    ],
    priceFrom: 18000,
    amenities: ["wifi", "pool", "parking", "gym", "restaurant", "conference_room", "spa", "bar"],
    isVerified: true,
    reviews: [
      {
        id: "r1",
        guestName: "Amina W.",
        rating: 5,
        comment: "Exceptional service and a stunning property. Highly recommend!",
        createdAt: "2026-05-10T08:00:00Z",
        verified: true,
      },
    ],
    avgRating: 4.8,
    reviewCount: 142,
    createdAt: "2025-01-15T10:00:00Z",
    updatedAt: "2026-06-01T12:00:00Z",
  },
  {
    id: "h2",
    slug: "diani-reef-beach-resort",
    name: "Diani Reef Beach Resort & Spa",
    description:
      "A luxury beach resort nestled along the pristine white sands of Diani Beach, offering a perfect blend of comfort, relaxation, and the natural beauty of Kenya's coast.",
    starRating: 5,
    propertyType: "hotel",
    address: "Diani Beach Road, Ukunda",
    neighborhood: "Diani Beach",
    county: "Kwale",
    coordinates: { lat: -4.3167, lng: 39.5667 },
    images: [
      {
        id: "img2",
        url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
        webpUrl:
          "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&fm=webp",
        alt: "Diani Reef beach view",
        order: 0,
      },
    ],
    roomTypes: [
      {
        id: "rt3",
        name: "Ocean View Room",
        description: "Wake up to breathtaking ocean vistas every morning.",
        maxOccupancy: 2,
        bedType: "king",
        pricePerNight: 22000,
        quantity: 15,
        amenities: ["wifi", "ac"],
        images: [],
        cancellationPolicy: "free",
      },
    ],
    priceFrom: 22000,
    amenities: ["wifi", "pool", "parking", "restaurant", "spa", "bar", "laundry"],
    isVerified: true,
    reviews: [],
    avgRating: 4.6,
    reviewCount: 89,
    createdAt: "2025-02-20T10:00:00Z",
    updatedAt: "2026-05-28T10:00:00Z",
  },
  {
    id: "h3",
    slug: "ole-sereni-nairobi",
    name: "Ole-Sereni Hotel",
    description:
      "The only hotel in Nairobi situated on the edge of Nairobi National Park. Guests can enjoy game viewing from the comfort of their rooms and the rooftop terrace.",
    starRating: 4,
    propertyType: "hotel",
    address: "Mombasa Road, Nairobi",
    neighborhood: "South Nairobi",
    county: "Nairobi",
    coordinates: { lat: -1.3285, lng: 36.8219 },
    images: [
      {
        id: "img3",
        url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
        webpUrl:
          "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&fm=webp",
        alt: "Ole-Sereni exterior view",
        order: 0,
      },
    ],
    roomTypes: [
      {
        id: "rt4",
        name: "Park View Standard",
        description: "Room with direct views over Nairobi National Park.",
        maxOccupancy: 2,
        bedType: "queen",
        pricePerNight: 12500,
        quantity: 30,
        amenities: ["wifi", "ac", "room_service"],
        images: [],
        cancellationPolicy: "free",
      },
    ],
    priceFrom: 12500,
    amenities: ["wifi", "pool", "parking", "gym", "restaurant", "rooftop"],
    isVerified: true,
    reviews: [
      {
        id: "r2",
        guestName: "James K.",
        rating: 4,
        comment: "Great views of the national park. Unique experience!",
        createdAt: "2026-04-22T08:00:00Z",
        verified: true,
      },
    ],
    avgRating: 4.4,
    reviewCount: 67,
    createdAt: "2025-03-10T10:00:00Z",
    updatedAt: "2026-06-05T10:00:00Z",
  },
];

// ─── Query helpers ─────────────────────────────────────────────────────────────

/**
 * Returns a paginated, filtered, sorted list of hotels.
 * Replace internals with a Prisma `findMany` + `count` when ready.
 */
export async function searchHotels(
  params: HotelSearchParams = {}
): Promise<PaginatedHotels> {
  const {
    neighborhood,
    starRating,
    priceMin,
    priceMax,
    amenities,
    propertyType,
    q,
    page = 1,
    limit = 20,
    sort = "rating_desc",
  } = params;

  let results = [...MOCK_HOTELS];

  // Free-text
  if (q) {
    const lower = q.toLowerCase();
    results = results.filter(
      (h) =>
        h.name.toLowerCase().includes(lower) ||
        h.description.toLowerCase().includes(lower) ||
        h.neighborhood.toLowerCase().includes(lower)
    );
  }

  // Filters
  if (neighborhood) {
    results = results.filter((h) =>
      h.neighborhood.toLowerCase().includes(neighborhood.toLowerCase())
    );
  }
  if (starRating?.length) {
    results = results.filter((h) => starRating.includes(h.starRating));
  }
  if (priceMin !== undefined) {
    results = results.filter((h) => h.priceFrom >= priceMin);
  }
  if (priceMax !== undefined) {
    results = results.filter((h) => h.priceFrom <= priceMax);
  }
  if (amenities?.length) {
    results = results.filter((h) =>
      amenities.every((a) => h.amenities.includes(a))
    );
  }
  if (propertyType?.length) {
    results = results.filter((h) => propertyType.includes(h.propertyType));
  }

  // Sorting
  results.sort((a, b) => {
    switch (sort) {
      case "price_asc":
        return a.priceFrom - b.priceFrom;
      case "price_desc":
        return b.priceFrom - a.priceFrom;
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "rating_desc":
      default:
        return b.avgRating - a.avgRating;
    }
  });

  const total = results.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const hotels = results.slice(start, start + limit);

  return { hotels, total, page, limit, totalPages };
}

/**
 * Fetches a single hotel by slug. Returns null if not found.
 * Replace with: prisma.hotel.findUnique({ where: { slug } })
 */
export async function getHotelBySlug(slug: string): Promise<Hotel | null> {
  return MOCK_HOTELS.find((h) => h.slug === slug) ?? null;
}

/**
 * Returns hotels in the same neighborhood (excluding the current hotel).
 * Used for the "Related hotels" section on the listing page.
 */
export async function getRelatedHotels(
  neighborhood: string,
  excludeId: string,
  limit = 3
): Promise<Hotel[]> {
  return MOCK_HOTELS.filter(
    (h) =>
      h.neighborhood === neighborhood && h.id !== excludeId
  ).slice(0, limit);
}

/**
 * Returns all hotel slugs — used for Next.js `generateStaticParams`.
 */
export async function getAllHotelSlugs(): Promise<string[]> {
  return MOCK_HOTELS.map((h) => h.slug);
}
