// ─── Hotel Domain Types ────────────────────────────────────────────────────────
// Place at: types/hotel.ts

export type PropertyType =
  | "hotel"
  | "lodge"
  | "camp"
  | "apartment"
  | "boutique";

export type BedType =
  | "king"
  | "queen"
  | "twin"
  | "double"
  | "single"
  | "bunk";

/** Amenity keys map 1-to-1 with the icon registry in lib/amenities.ts */
export type AmenityKey =
  | "wifi"
  | "pool"
  | "parking"
  | "gym"
  | "restaurant"
  | "conference_room"
  | "spa"
  | "airport_transfer"
  | "bar"
  | "laundry"
  | "room_service"
  | "ac"
  | "pet_friendly"
  | "ev_charging"
  | "rooftop"
  | "kids_club";

export interface GpsCoordinates {
  lat: number;
  lng: number;
}

export interface HotelImage {
  id: string;
  url: string;
  /** WebP-optimised URL (served by Cloudinary or S3 transform) */
  webpUrl: string;
  alt: string;
  /** 0 = cover image */
  order: number;
}

export interface RoomType {
  id: string;
  name: string;
  description: string;
  maxOccupancy: number;
  bedType: BedType;
  pricePerNight: number; // KES
  /** Total quantity of this room type available at the property */
  quantity: number;
  amenities: AmenityKey[];
  images: HotelImage[];
  cancellationPolicy: "free" | "non_refundable" | "partial";
}

export interface Review {
  id: string;
  guestName: string;
  rating: number; // 1–5
  comment: string;
  createdAt: string; // ISO-8601
  /** Verified stay = booking confirmed on platform */
  verified: boolean;
}

export interface Hotel {
  id: string;
  slug: string;
  name: string;
  /** Max 1,000 characters */
  description: string;
  starRating: 1 | 2 | 3 | 4 | 5;
  propertyType: PropertyType;

  // Location
  address: string;
  neighborhood: string;
  county: string;
  coordinates: GpsCoordinates;

  // Media
  images: HotelImage[];

  // Rooms & pricing
  roomTypes: RoomType[];
  /** Computed from cheapest available room type */
  priceFrom: number; // KES

  // Features
  amenities: AmenityKey[];

  // Trust signals
  isVerified: boolean;

  // Reviews
  reviews: Review[];
  /** Weighted average of all reviews */
  avgRating: number;
  reviewCount: number;

  createdAt: string;
  updatedAt: string;
}

// ─── Filter / Search Types ─────────────────────────────────────────────────────

export type SortOption = "price_asc" | "price_desc" | "rating_desc" | "newest";

export interface HotelFilters {
  neighborhood?: string;
  starRating?: number[];
  priceMin?: number;
  priceMax?: number;
  amenities?: AmenityKey[];
  checkIn?: string; // ISO date string YYYY-MM-DD
  checkOut?: string;
  propertyType?: PropertyType[];
}

export interface HotelSearchParams extends HotelFilters {
  page?: number;
  limit?: number;
  sort?: SortOption;
  q?: string; // free-text search
}

export interface PaginatedHotels {
  hotels: Hotel[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
