// ─── Hotel Detail Page ─────────────────────────────────────────────────────────
// Place at: app/hotels/[slug]/page.tsx
//
// Canonical URL: /hotels/[slug]
// Fully server-rendered for SEO. Generates static pages at build time for all
// known slugs. Falls back to SSR for dynamically-created listings.

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  getHotelBySlug,
  getRelatedHotels,
  getAllHotelSlugs,
} from "@/lib/hotels";
import { getAmenityMeta } from "@/lib/amenities";
import type { Hotel, RoomType, Review } from "@/types/hotel";
import StarRating from "@/components/hotels/StarRating";
import BookingBar from "@/components/hotels/BookingBar";

// ─── Static params (SSG) ──────────────────────────────────────────────────────

export async function generateStaticParams() {
  const slugs = await getAllHotelSlugs();
  return slugs.map((slug) => ({ slug }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const hotel = await getHotelBySlug(slug);
  if (!hotel) return {};

  const cover = hotel.images[0];

  return {
    title: `${hotel.name} — HamuKenya`,
    description: hotel.description.slice(0, 160),
    openGraph: {
      title: hotel.name,
      description: hotel.description.slice(0, 160),
      images: cover ? [{ url: cover.webpUrl || cover.url }] : [],
      type: "website",
    },
    // Structured data for Google Rich Results
    other: {
      "script:ld+json": JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Hotel",
        name: hotel.name,
        description: hotel.description,
        address: {
          "@type": "PostalAddress",
          streetAddress: hotel.address,
          addressLocality: hotel.neighborhood,
          addressRegion: hotel.county,
          addressCountry: "KE",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: hotel.coordinates.lat,
          longitude: hotel.coordinates.lng,
        },
        starRating: {
          "@type": "Rating",
          ratingValue: hotel.starRating,
        },
        aggregateRating: hotel.reviewCount > 0
          ? {
              "@type": "AggregateRating",
              ratingValue: hotel.avgRating,
              reviewCount: hotel.reviewCount,
            }
          : undefined,
        priceRange: `KES ${hotel.priceFrom.toLocaleString()}`,
      }),
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function HotelDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [hotel, related] = await Promise.all([
    getHotelBySlug(slug),
    getHotelBySlug(slug).then((h) =>
      h ? getRelatedHotels(h.neighborhood, h.id) : []
    ),
  ]);

  if (!hotel) notFound();

  return (
    <>
      {/* Sticky booking bar — fixed to bottom on mobile, top on desktop */}
      <BookingBar hotel={hotel} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-6">
        {/* ── Breadcrumb ──────────────────────────────────────────────── */}
        <nav className="text-sm text-gray-500 mb-4 flex items-center gap-2">
          <Link href="/hotels" className="hover:text-emerald-600">
            Hotels
          </Link>
          <span>/</span>
          <span>{hotel.neighborhood}</span>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate">{hotel.name}</span>
        </nav>

        {/* ── Header ──────────────────────────────────────────────────── */}
        <HotelHeader hotel={hotel} />

        {/* ── Image gallery ───────────────────────────────────────────── */}
        <ImageGallery images={hotel.images} name={hotel.name} />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Main column ─────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-10">
            {/* Description */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                About this property
              </h2>
              <p className="text-gray-600 leading-relaxed">{hotel.description}</p>
            </section>

            {/* Amenities */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Amenities
              </h2>
              <AmenitiesGrid amenities={hotel.amenities} />
            </section>

            {/* Room types */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Room Types
              </h2>
              <div className="space-y-4">
                {hotel.roomTypes.map((room) => (
                  <RoomCard key={room.id} room={room} />
                ))}
              </div>
            </section>

            {/* Map */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Location
              </h2>
              <p className="text-sm text-gray-500 mb-3">{hotel.address}</p>
              <GoogleMapEmbed coordinates={hotel.coordinates} name={hotel.name} />
            </section>

            {/* Reviews */}
            <section>
              <ReviewsSection reviews={hotel.reviews} avgRating={hotel.avgRating} count={hotel.reviewCount} />
            </section>
          </div>

          {/* ── Sidebar ─────────────────────────────────────────────── */}
          <aside className="space-y-6">
            <PriceSummaryCard hotel={hotel} />
          </aside>
        </div>

        {/* ── Related hotels ──────────────────────────────────────────── */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              More hotels in {hotel.neighborhood}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/hotels/${r.slug}`}
                  className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="relative h-36">
                    {r.images[0] && (
                      <Image
                        src={r.images[0].webpUrl || r.images[0].url}
                        alt={r.images[0].alt}
                        fill
                        sizes="300px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-emerald-600 font-medium">{r.neighborhood}</p>
                    <p className="font-semibold text-sm text-gray-900 group-hover:text-emerald-700">{r.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      From KES {r.priceFrom.toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}

// ─── Section components ───────────────────────────────────────────────────────

function HotelHeader({ hotel }: { hotel: Hotel }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full capitalize">
            {hotel.propertyType}
          </span>
          {hotel.isVerified && (
            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Verified
            </span>
          )}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{hotel.name}</h1>
        <p className="mt-1 text-sm text-gray-500">
          {hotel.address} · {hotel.county}
        </p>
        <div className="mt-2 flex items-center gap-3">
          <StarRating rating={hotel.starRating} />
          {hotel.reviewCount > 0 && (
            <span className="text-sm text-gray-500">
              {hotel.avgRating.toFixed(1)} ({hotel.reviewCount} reviews)
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function ImageGallery({ images, name }: { images: Hotel["images"]; name: string }) {
  if (!images.length) return null;

  const [cover, ...rest] = images;

  return (
    <div className="grid grid-cols-4 grid-rows-2 gap-2 h-72 sm:h-96 rounded-2xl overflow-hidden">
      {/* Cover — spans 2 cols, 2 rows */}
      <div className="col-span-2 row-span-2 relative">
        <Image
          src={cover.webpUrl || cover.url}
          alt={cover.alt || name}
          fill
          sizes="50vw"
          className="object-cover"
          priority
        />
      </div>
      {/* Thumbnails */}
      {rest.slice(0, 4).map((img, i) => (
        <div key={img.id} className="relative overflow-hidden">
          <Image
            src={img.webpUrl || img.url}
            alt={img.alt || `${name} photo ${i + 2}`}
            fill
            sizes="25vw"
            className="object-cover"
            loading="lazy"
          />
          {/* "Show all photos" overlay on last thumbnail */}
          {i === 3 && rest.length > 4 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                +{rest.length - 4} more
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function AmenitiesGrid({ amenities }: { amenities: Hotel["amenities"] }) {
  const items = getAmenityMeta(amenities);
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {items.map(({ key, label, iconPath }) => (
        <div key={key} className="flex items-center gap-2 text-sm text-gray-700">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            className="text-emerald-600 flex-shrink-0"
          >
            <path d={iconPath} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

function RoomCard({ room }: { room: RoomType }) {
  const cancellationLabels = {
    free: { text: "Free cancellation", color: "text-emerald-600" },
    partial: { text: "Partial refund", color: "text-amber-600" },
    non_refundable: { text: "Non-refundable", color: "text-red-500" },
  };
  const cancellation = cancellationLabels[room.cancellationPolicy];

  return (
    <div className="border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <p className="font-semibold text-gray-900">{room.name}</p>
        <p className="text-sm text-gray-500 mt-0.5">{room.description}</p>
        <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
          <span>👤 Max {room.maxOccupancy} guests</span>
          <span>🛏 {room.bedType.charAt(0).toUpperCase() + room.bedType.slice(1)} bed</span>
          <span className={`font-medium ${cancellation.color}`}>
            {cancellation.text}
          </span>
        </div>
      </div>
      <div className="flex-shrink-0 text-right">
        <p className="text-xl font-bold text-gray-900">
          KES {room.pricePerNight.toLocaleString()}
        </p>
        <p className="text-xs text-gray-400">per night</p>
        <Link
          href={`?room=${room.id}#book`}
          className="mt-2 inline-block text-sm font-medium bg-emerald-600 text-white rounded-lg px-4 py-2 hover:bg-emerald-700 transition-colors"
        >
          Select
        </Link>
      </div>
    </div>
  );
}

function GoogleMapEmbed({
  coordinates,
  name,
}: {
  coordinates: { lat: number; lng: number };
  name: string;
}) {
  // Uses the embed API (no JS SDK needed, works in SSR)
  const src = `https://www.google.com/maps/embed/v1/place?key=${
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? "YOUR_MAPS_KEY"
  }&q=${encodeURIComponent(name)}&center=${coordinates.lat},${coordinates.lng}&zoom=15`;

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 aspect-video">
      <iframe
        src={src}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`Map showing location of ${name}`}
        allowFullScreen
      />
    </div>
  );
}

function ReviewsSection({
  reviews,
  avgRating,
  count,
}: {
  reviews: Review[];
  avgRating: number;
  count: number;
}) {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Reviews{" "}
          <span className="text-gray-400 font-normal text-base">({count})</span>
        </h2>
        {count > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900">
              {avgRating.toFixed(1)}
            </span>
            <StarRating rating={Math.round(avgRating)} />
          </div>
        )}
      </div>

      {reviews.length === 0 ? (
        <p className="text-sm text-gray-400">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-gray-900">
                    {review.guestName}
                  </span>
                  {review.verified && (
                    <span className="text-xs text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                      Verified stay
                    </span>
                  )}
                </div>
                <StarRating rating={review.rating} size="sm" />
              </div>
              <p className="text-sm text-gray-600">{review.comment}</p>
              <p className="mt-1 text-xs text-gray-400">
                {new Date(review.createdAt).toLocaleDateString("en-KE", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function PriceSummaryCard({ hotel }: { hotel: Hotel }) {
  return (
    <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
      <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">
        Starting from
      </p>
      <p className="text-3xl font-bold text-gray-900 mt-1">
        KES {hotel.priceFrom.toLocaleString()}
      </p>
      <p className="text-sm text-gray-400">per night</p>

      <div className="mt-4 space-y-2">
        <input
          type="date"
          placeholder="Check-in"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <input
          type="date"
          placeholder="Check-out"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <Link
        href="#book"
        className="mt-4 block w-full bg-emerald-600 text-white text-center font-semibold py-3 rounded-xl hover:bg-emerald-700 transition-colors"
        id="book"
      >
        Book a Room
      </Link>

      <p className="mt-3 text-xs text-center text-gray-400">
        No credit card required to inquire
      </p>
    </div>
  );
}
