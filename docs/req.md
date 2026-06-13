# Requirements Document — Kenyan Hospitality Booking Platform

**Project Codename:** HamuKenya (working title)
**Version:** 1.0.0
**Prepared by:** GTSS (Great Thumbs Software Solutions)
**Date:** June 2026
**Stack:** Next.js · TypeScript · PostgreSQL · Prisma · Node.js

---

## 1. Project Overview

HamuKenya is a unified hospitality booking platform for the Kenyan market. It aggregates hotel and restaurant listings into a single, mobile-first product, enabling guests to discover venues, make reservations, pay via M-Pesa or card, and receive confirmation through WhatsApp — all without leaving the platform.

The platform serves three actor groups:

| Actor | Portal | Description |
|---|---|---|
| **Guest** | Public Web / Mobile | Discovers, books, pays, and reviews hotels & restaurants |
| **Vendor** | Vendor Dashboard | Hotel/restaurant owner manages their listings, bookings, and availability |
| **Admin** | Admin Dashboard | Platform operator manages all vendors, users, content, and system config |

---

## 2. Scope

### In Scope (v1.0)

1. Hotel Listings
2. Restaurant Listings
3. Room Booking
4. Table Booking
5. M-Pesa Payments (Daraja 3.0 STK Push + B2C Refunds)
6. WhatsApp Notifications (Booking confirmations, reminders, cancellations)
7. Basic Reviews
8. Admin Dashboard
9. Vendor Dashboard
10. Maps & Location Search

### Out of Scope (v1.0)

- AI revenue management / dynamic pricing
- Digital nomad long-stay module
- Experiential / culinary tour bookings
- IoT sustainability dashboard
- Two-way POS hardware sync (JiPOS/Oracle Micros)
- NLP sentiment analysis on reviews
- Multi-outlet franchise management (planned v2)

---

## 3. Tech Stack & Architecture

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14+ (App Router), TypeScript, Tailwind CSS |
| **Backend** | Next.js API Routes / Node.js |
| **Database** | PostgreSQL via Prisma ORM |
| **Auth** | NextAuth.js (credentials + Google OAuth) |
| **Payments** | Safaricom Daraja 3.0 API, IntaSend (card fallback) |
| **Messaging** | WhatsApp Business API (via Twilio or Meta Cloud API) |
| **Maps** | Google Maps JavaScript API + Places API |
| **Storage** | Cloudinary or AWS S3 (images/media) |
| **Email** | Resend or Nodemailer (transactional email fallback) |
| **Deployment** | Vercel (frontend) + Railway/Render (background jobs) |
| **Cron / Queue** | node-cron / BullMQ for async job processing |

---

## 4. Feature Requirements

---

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

### Feature 2 — Restaurant Listings

#### 4.2.1 Description
A publicly searchable directory of restaurants, cafés, rooftop bars, and dining experiences across Kenya.

#### 4.2.2 Functional Requirements

**FR-R-01** — Each restaurant listing must display:
- Name, description, cuisine type(s), price range (KES symbols: KES / KES KES / KES KES KES)
- Address, neighborhood, GPS coordinates
- Cover image + gallery (up to 20 images)
- Opening hours (per day of week, with "Closed" flag)
- Dining capacity and seating options (indoor, outdoor, bar, terrace, private room)
- Menu (PDF upload or structured menu builder with categories and items)
- Amenities: parking, Wi-Fi, live music, LGBTQ-friendly, family-friendly, halal, etc.
- Verified badge if vendor KYC is complete

**FR-R-02** — Listings must be filterable by:
- Neighborhood / area
- Cuisine type (Swahili, Continental, Indian, BBQ/Nyama Choma, Fast Food, Fine Dining, etc.)
- Price range
- Seating preference (indoor / outdoor / rooftop)
- Dietary options (vegetarian, vegan, halal, gluten-free)
- Opening now (boolean toggle using current time)
- Average review rating (4+, 3+, etc.)

**FR-R-03** — Each listing must have a canonical public URL: `/restaurants/[slug]`

**FR-R-04** — A restaurant listing page must include:
- Sticky "Book a Table" CTA bar
- Embedded Google Maps pin
- Reviews section
- Full menu viewer

**FR-R-05** — Search cards must display: thumbnail, name, cuisine tags, neighborhood, price range, rating, opening status ("Open Now" / "Closes at 10 PM"), and a "View" CTA.

#### 4.2.3 Non-Functional Requirements

- Same performance requirements as hotel listings (Lighthouse ≥ 85 mobile)
- Menu PDFs must be stored on CDN and served with signed URLs

---

### Feature 3 — Room Booking

#### 4.3.1 Description
End-to-end room reservation flow for hotel guests, from date selection through to payment and confirmation.

#### 4.3.2 Functional Requirements

**FR-RB-01** — Guest must be able to:
- Select check-in and check-out dates via a calendar picker (minimum 1 night)
- Select number of guests (adults, children)
- View available room types filtered by that date range
- Select a specific room type and proceed to checkout

**FR-RB-02** — Room types must specify:
- Name (e.g., "Deluxe King", "Standard Twin"), description, max occupancy
- Bed configuration (King, Queen, Twin, Double, etc.)
- Price per night (KES), with breakdown in checkout (subtotal, taxes if applicable, total)
- Included amenities (breakfast, airport transfer, etc.)
- Cancellation policy (Free cancellation / Non-refundable / Partial refund)

**FR-RB-03** — The booking checkout must:
- Not require account creation (guest checkout supported)
- Collect: full name, email address, phone number (E.164 format), special requests (optional textarea)
- Display a clear booking summary before payment
- Support a deposit model (e.g., 30% deposit at booking, remainder on arrival) configurable per hotel

**FR-RB-04** — Availability logic:
- The system must block dates that are fully booked for a given room type
- Vendors must be able to manually block dates (e.g., for maintenance)
- Overbooking must be impossible: a room type has a defined `quantity` (e.g., 5 Standard Twins), and availability is computed as `quantity - confirmed_bookings` for any date range

**FR-RB-05** — Booking statuses:

| Status | Description |
|---|---|
| `PENDING` | Payment initiated but not yet confirmed |
| `CONFIRMED` | Payment verified, booking active |
| `CHECKED_IN` | Guest has arrived |
| `CHECKED_OUT` | Stay complete |
| `CANCELLED` | Cancelled by guest or vendor |
| `NO_SHOW` | Guest did not arrive |

**FR-RB-06** — On booking confirmation, the system must:
- Generate a unique booking reference (e.g., `HMK-H-20261305-XXXX`)
- Store the booking in the database linked to the guest, hotel, and room type
- Trigger WhatsApp and email confirmation (Feature 6)
- Update room availability in real time

**FR-RB-07** — Guests must be able to cancel a booking from:
- Their booking confirmation email/WhatsApp link (tokenised URL, no login required)
- Their account booking history (if registered)

**FR-RB-08** — Cancellation must:
- Respect the hotel's cancellation policy
- Trigger an automated B2C M-Pesa refund if the guest paid via M-Pesa and cancellation is within the refund window (Feature 5)
- Update booking status to `CANCELLED` and release inventory

#### 4.3.3 Non-Functional Requirements

- Booking creation must be atomic — inventory decrement and booking record creation must occur in a single database transaction
- The checkout page must load in under 2 seconds on a 4G connection
- Booking reference must be globally unique and collision-resistant

---

### Feature 4 — Table Booking

#### 4.4.1 Description
End-to-end table reservation flow for diners, from date/time/party-size selection through to payment (if deposit required) and confirmation.

#### 4.4.2 Functional Requirements

**FR-TB-01** — Guest must be able to:
- Select a date using a date picker
- Select a time slot from the restaurant's available slots (dynamically generated from opening hours and pacing config)
- Select party size (number of diners)
- Choose seating preference (Indoor / Outdoor / Bar / Terrace / No preference)

**FR-TB-02** — The platform must enforce seating intervals and pacing limits configured by the vendor:
- Restaurants must be able to set booking slots in 15, 30, 45, or 60-minute intervals
- Restaurants must be able to set a maximum number of covers (guests) per slot
- If a slot is full, it must be hidden or shown as unavailable

**FR-TB-03** — The booking checkout must:
- Collect: full name, phone number, email, dietary requirements/allergies (optional), special occasion (birthday, anniversary, business — optional)
- Support optional deposit requirement (configurable by restaurant)
- Not require account creation

**FR-TB-04** — Table booking statuses:

| Status | Description |
|---|---|
| `PENDING` | Awaiting payment confirmation (if deposit required) |
| `CONFIRMED` | Reservation confirmed |
| `RUNNING_LATE` | Guest self-reported via WhatsApp reply |
| `ARRIVED` | Marked by restaurant host |
| `COMPLETED` | Dining session finished |
| `CANCELLED` | Cancelled by guest or restaurant |
| `NO_SHOW` | Guest did not arrive |

**FR-TB-05** — On confirmation, the system must:
- Generate a unique booking reference (e.g., `HMK-R-20261305-XXXX`)
- Send a WhatsApp confirmation message to the guest (Feature 6)
- Notify the restaurant vendor dashboard of the new reservation in real time

**FR-TB-06** — Two hours before the reservation, the system must automatically send a WhatsApp reminder asking the guest to confirm attendance. The guest can reply with a keyword (e.g., "CONFIRM" or "CANCEL" or "LATE") to update their status automatically.

**FR-TB-07** — If a guest cancels, the system must:
- Update status to `CANCELLED`
- Release the slot capacity
- If a waitlist exists for that slot, notify the next person on the waitlist

**FR-TB-08** — Vendors must be able to configure a digital waitlist per time slot. When a slot fills up, guests can join the waitlist and are automatically notified via WhatsApp if a slot opens.

#### 4.4.3 Non-Functional Requirements

- Time slot generation must account for timezone (Africa/Nairobi — EAT, UTC+3)
- Slot availability checks must be real-time (no stale cache during checkout)

---

### Feature 5 — M-Pesa Payments (Daraja 3.0)

#### 4.5.1 Description
Native M-Pesa integration using Safaricom's Daraja 3.0 API as the primary payment method for all deposits and bookings, with card payment as a secondary option via IntaSend.

#### 4.5.2 Functional Requirements

**FR-MP-01 — STK Push (C2B)**

- When a guest confirms a booking and selects "Pay with M-Pesa", the system must:
  1. Validate the guest's phone number is a valid Safaricom number (07XX / 01XX)
  2. Call `POST /stkpush/v1/processrequest` on the Daraja 3.0 API
  3. Display a loading state: "Check your phone — enter your M-Pesa PIN to complete payment"
  4. Poll for or await the asynchronous callback from Safaricom

**FR-MP-02 — Callback Reconciliation**

- The platform must expose a secure, publicly accessible HTTPS webhook endpoint to receive Safaricom's payment result callback (e.g., `POST /api/payments/mpesa/callback`)
- On receiving a callback, the system must:
  1. Verify the `CheckoutRequestID` matches an active pending booking session
  2. Verify the `Amount` matches the expected payment amount (no partial payments accepted)
  3. Verify the payload originates from Safaricom's known IP ranges (IP whitelist)
  4. Process the callback idempotently using the unique `MpesaReceiptNumber` to prevent duplicate processing
  5. If successful: update booking status to `CONFIRMED`, store `MpesaReceiptNumber` on the booking record, and trigger the confirmation WhatsApp message
  6. If failed: update booking status to `FAILED`, release the held inventory, and notify the guest via WhatsApp

**FR-MP-03 — Payment Session Timeout**

- If no callback is received within 5 minutes of initiating an STK push, the system must:
  - Mark the session as `EXPIRED`
  - Release held inventory
  - Notify the guest that the payment timed out and offer a retry option

**FR-MP-04 — B2C Refunds**

- When a booking is cancelled within the refund window, the system must:
  1. Call Safaricom's B2C API to initiate an automated refund to the guest's M-Pesa number
  2. Log the B2C transaction reference on the booking record
  3. Notify the guest via WhatsApp: "Your refund of KES [amount] has been sent to [phone]. It may take up to 24 hours to reflect."
  4. If the B2C refund fails, flag the booking for manual processing and alert the admin dashboard

**FR-MP-05 — Transaction Ledger**

- Every M-Pesa transaction (inbound C2B and outbound B2C) must be stored in a `transactions` table with:
  - `booking_id`, `mpesa_receipt_number`, `amount`, `phone_number`, `type` (C2B / B2C), `status`, `created_at`, `raw_payload` (JSON)

**FR-MP-06 — Card Payment Fallback**

- The checkout must also offer "Pay with Card" via IntaSend
- IntaSend must support Visa, Mastercard, and local card schemes
- Card payment confirmations must follow the same booking status update flow as M-Pesa

#### 4.5.3 Non-Functional Requirements

- The Daraja API credentials (Consumer Key, Consumer Secret, Passkey, ShortCode) must be stored in environment variables — never in source code or the database in plaintext
- The callback endpoint must be secured with a validation layer (IP whitelist + payload signature check)
- All payment amounts must be stored in KES as integers (cents-equivalent: multiply by 100 for M-Pesa) to avoid floating-point errors
- The system must handle Daraja API timeouts gracefully with retry logic (max 3 retries, exponential backoff)

---

### Feature 6 — WhatsApp Notifications

#### 4.6.1 Description
Automated WhatsApp message delivery for all key booking lifecycle events, using the WhatsApp Business API (via Meta Cloud API or Twilio).

#### 4.6.2 Notification Triggers & Templates

| Trigger | Recipient | Template Name | Channel |
|---|---|---|---|
| Booking confirmed (hotel) | Guest | `hotel_booking_confirmed` | WhatsApp + Email |
| Booking confirmed (restaurant) | Guest | `table_booking_confirmed` | WhatsApp + Email |
| New booking received | Vendor | `vendor_new_booking` | WhatsApp |
| 24-hour reminder | Guest | `booking_reminder_24h` | WhatsApp |
| 2-hour pre-dining reminder + status check | Guest | `table_reminder_2h` | WhatsApp |
| Cancellation confirmed | Guest | `booking_cancelled` | WhatsApp + Email |
| Refund initiated | Guest | `refund_initiated` | WhatsApp |
| Waitlist slot available | Guest | `waitlist_available` | WhatsApp |
| New review received | Vendor | `vendor_new_review` | WhatsApp |

**FR-WA-01** — All outgoing WhatsApp messages must use pre-approved Meta message templates with dynamic variables populated from the booking record.

**FR-WA-02** — The booking confirmation message must include:
- Guest name, venue name, booking reference
- Date, time (for tables) or check-in/check-out dates (for rooms)
- Number of guests / room type
- Total amount paid, M-Pesa receipt number
- A tokenised cancellation link (valid for 48 hours after booking or until 24h before the event, whichever comes first)

**FR-WA-03** — The 2-hour pre-dining message must present the guest with reply options:
- Reply "1" to confirm attendance
- Reply "2" if running late
- Reply "3" to cancel

The platform must listen for inbound WhatsApp webhook replies and update the booking status accordingly.

**FR-WA-04** — If WhatsApp delivery fails (invalid number, user not on WhatsApp), the system must fall back to SMS via Africa's Talking or a similar local SMS gateway.

**FR-WA-05** — All sent and received WhatsApp messages must be logged in a `notifications` table with: `booking_id`, `recipient_phone`, `template_name`, `status` (sent / delivered / read / failed), `sent_at`.

#### 4.6.3 Non-Functional Requirements

- WhatsApp message dispatch must be handled via an async job queue (BullMQ) to avoid blocking the payment confirmation response
- Inbound reply webhook must respond with HTTP 200 within 5 seconds to prevent Meta from retrying the delivery
- Phone numbers must be normalised to E.164 format (`+254XXXXXXXXX`) before any API call

---

### Feature 7 — Basic Reviews

#### 4.7.1 Description
A review system allowing guests to rate and review hotels and restaurants after their visit, visible on listing pages.

#### 4.7.2 Functional Requirements

**FR-REV-01** — Only guests with a `COMPLETED` or `CHECKED_OUT` booking may submit a review for that specific property.

**FR-REV-02** — A review must capture:
- Overall star rating (1–5, required)
- Category ratings (optional sub-ratings): Cleanliness, Food Quality, Service, Value for Money, Location — each 1–5 stars
- Written review body (minimum 20 characters, maximum 1,000 characters)
- Date of visit (auto-populated from the booking record)
- Anonymous submission option (name shown as "Guest")

**FR-REV-03** — Reviews must go through a moderation queue before being published:
- Auto-approved if the written content passes a profanity/abuse filter
- Flagged for manual admin review if the filter is triggered

**FR-REV-04** — Vendor response: Vendors must be able to write a single public reply to any review on their property. The reply is displayed below the guest's review on the listing page.

**FR-REV-05** — The listing page must display:
- Overall average rating (e.g., 4.3 / 5)
- Total review count
- Rating distribution bar chart (5★ → 1★)
- Individual reviews sorted by most recent, with pagination (10 per page)

**FR-REV-06** — A guest must only be able to review a booking once. The "Leave a Review" prompt must be sent via WhatsApp 24 hours after check-out or dining completion.

**FR-REV-07** — Guests must be able to report a review as inappropriate. Reports must be surfaced in the Admin Dashboard for manual review.

#### 4.7.3 Non-Functional Requirements

- Review scores must be recalculated and cached whenever a new review is published (not recomputed on every page load)
- All reviews must be stored with soft-delete support (admin can remove without destroying the record)

---

### Feature 8 — Admin Dashboard

#### 4.8.1 Description
A secure, internal web dashboard used by the platform operator (GTSS) to manage all vendors, users, bookings, payments, content, and system configuration.

#### 4.8.2 Access Control

- Admin accounts are created manually by a super-admin; no self-registration
- Role: `SUPER_ADMIN` (full access) and `ADMIN` (restricted — cannot delete vendors or manage admins)
- Auth: email + password with mandatory 2FA (TOTP via Google Authenticator)

#### 4.8.3 Functional Requirements

**FR-AD-01 — Overview Dashboard**
- Real-time KPIs:
  - Total bookings today / this week / this month
  - Total revenue (KES) processed today / this month
  - Active vendors (hotels / restaurants split)
  - Pending vendor applications
  - Failed payment count
  - New reviews pending moderation

**FR-AD-02 — Vendor Management**
- View all vendors in a searchable, filterable table (name, type, status, date joined, total bookings)
- Approve or reject vendor applications with a reason field (triggers WhatsApp/email notification to vendor)
- Suspend or reactivate a vendor account
- View any vendor's full profile, listings, and booking history
- Manually edit any vendor's listing (emergency override)
- Delete a vendor (soft delete with data retention)

**FR-AD-03 — User Management**
- View all registered guest accounts (name, email, phone, join date, booking count, lifetime spend)
- Search/filter users by name, email, date range, booking activity
- View a user's full booking history
- Ban a user account (blocks future bookings without deleting data)

**FR-AD-04 — Booking Management**
- View all bookings (hotels + restaurants) in a unified table
- Filter by: status, vendor, booking type, date range, payment method
- View full booking details including payment transaction records
- Manually update booking status (e.g., mark as `NO_SHOW`, force `CANCELLED`)
- Trigger manual refund (invokes B2C API) for edge cases where auto-refund failed

**FR-AD-05 — Payments & Transactions**
- View all M-Pesa and card transactions in a searchable ledger
- Filter by: status (success / failed / pending), date range, vendor, amount range
- Export transactions as CSV (date-range filtered)
- View failed callbacks and manually re-trigger reconciliation

**FR-AD-06 — Review Moderation**
- View reviews pending moderation in a queue
- Approve, reject, or edit (for minor corrections) each review
- View flagged reviews reported by users
- View vendor replies awaiting moderation (optional, if required)

**FR-AD-07 — System Configuration**
- Manage platform-level settings:
  - Commission rate per vendor (percentage of booking value)
  - Daraja API environment toggle (sandbox / production)
  - WhatsApp template management (view active templates)
  - Maintenance mode toggle

#### 4.8.4 Non-Functional Requirements

- Admin dashboard must be hosted at a non-public, obscured route (e.g., `/internal/[randomSegment]/admin`)
- All admin actions must be logged in an `audit_log` table (`admin_id`, `action`, `target_type`, `target_id`, `payload`, `timestamp`)
- Admin session timeout: 30 minutes of inactivity

---

### Feature 9 — Vendor Dashboard

#### 4.9.1 Description
A self-service web dashboard for hotel and restaurant owners to manage their property profile, listings, availability, bookings, and payouts.

#### 4.9.2 Access Control

- Vendors self-register via the platform's vendor signup flow
- Account is `PENDING` until approved by an admin
- Each vendor account can manage one or more properties (multi-property support scoped to v1 for chains)
- Roles within a vendor account: `OWNER` (full access) and `MANAGER` (cannot manage billing/payouts)

#### 4.9.3 Functional Requirements

**FR-VD-01 — Overview Dashboard**
- KPIs for the vendor's own property:
  - Today's bookings (arriving / dining)
  - This month's confirmed revenue
  - Average review rating
  - Upcoming bookings for the next 7 days (list view)
  - Cancellation rate (last 30 days)

**FR-VD-02 — Listing Management**
- Create and edit property profile:
  - Name, description, contact details, social media links
  - Address and pin the location on a Google Map
  - Upload/delete/reorder property images (up to 20)
  - Set amenities and tags
  - Set dining seating options (restaurant only)
  - Upload or build menu (restaurant only)

**FR-VD-03 — Room / Table Management (Hotels)**
- Create, edit, and delete room types
- Set name, description, bed type, max occupancy, price per night
- Set quantity available (e.g., "5 Standard Twin rooms")
- Set cancellation policy per room type (Free / 24h / 48h / Non-refundable)
- Set deposit percentage (0% = full payment at booking, or e.g. 30%)
- Manually block specific dates per room type (for maintenance, private events)

**FR-VD-04 — Slot / Pacing Management (Restaurants)**
- Configure opening hours per day of week (open/close time or "Closed")
- Set booking slot interval (15 / 30 / 45 / 60 minutes)
- Set maximum covers per slot
- Block specific dates or time slots (e.g., for private events)
- Set deposit requirement per booking (0% or fixed KES amount)

**FR-VD-05 — Booking Management**
- View all bookings in a filterable table (status, date, guest name, party size / room type)
- See today's arrivals / dining reservations in a "Today's View" summary
- Update booking status (Check In, Check Out, Mark as No-Show)
- Cancel a booking (triggers guest notification and refund if applicable)
- Contact a guest directly (opens a WhatsApp chat link)
- Add internal notes to a booking (private, not visible to guest)

**FR-VD-06 — Reviews**
- View all reviews received, sorted by date
- Write a single public reply per review
- Flag a review as inappropriate (escalates to admin)

**FR-VD-07 — Payouts & Revenue**
- View revenue breakdown per booking (gross booking value, platform commission, net payout)
- View payout schedule and pending/completed payout history
- Export revenue report as CSV for a given date range

#### 4.9.4 Non-Functional Requirements

- Vendor dashboard routes must be protected behind `VENDOR` role middleware
- Vendor can only view and manage their own properties' data — strict row-level isolation in all database queries
- Listing changes (price, availability, description) must take effect immediately on the public site

---

### Feature 10 — Maps & Location Search

#### 4.10.1 Description
An integrated map experience allowing guests to discover hotels and restaurants geographically, with neighborhood clustering and distance-aware search.

#### 4.10.2 Functional Requirements

**FR-MAP-01 — Map View on Search Results**
- The search results page for both hotels and restaurants must include a map panel alongside the list/grid results
- Each property is shown as a custom pin/marker on the map
- Clicking a map marker opens a preview card (thumbnail, name, rating, price from, "View" button)
- Panning or zooming the map updates the displayed results (map-bounds-based filtering)

**FR-MAP-02 — Neighborhood / Area Filter**
- The search must support a predefined list of Kenyan neighborhoods and regions, including but not limited to:
  - Nairobi: Westlands, Karen, Kilimani, Lavington, Gigiri, Parklands, CBD, Upper Hill, Hurlingham, Runda
  - Mombasa: Nyali, Diani, Mtwapa, Watamu
  - Other: Nakuru, Kisumu, Naivasha, Amboseli, Maasai Mara, Lamu, Malindi
- Selecting a neighborhood auto-centers the map and filters results to properties within that area

**FR-MAP-03 — "Near Me" Search**
- A "Near Me" button must request the user's geolocation (browser Geolocation API)
- If permission is granted, results are sorted by distance from the user's current location
- Distance in kilometers is displayed on each search result card ("1.2 km away")

**FR-MAP-04 — Vendor Location Pinning**
- During listing setup, vendors must pin their property location on a Google Map
- The system stores the GPS coordinates (`lat`, `lng`) and reverse-geocodes the address using Google Places API
- The stored coordinates are used for all map-based search and distance calculations

**FR-MAP-05 — Static Map Embed on Listing Pages**
- Each hotel and restaurant listing page must embed a static Google Map showing the property pin
- The map must include a "Get Directions" link that opens Google Maps / Waze in a new tab
- Nearby landmark annotations (optional for v1)

**FR-MAP-06 — Traffic-Aware Neighborhood Grouping (MVP)**
- The search must display results grouped by neighborhood with a readable header (e.g., "Restaurants in Westlands (12)")
- Real-time traffic estimates are deferred to v2; v1 must at minimum include static travel time estimates from Nairobi CBD to each major neighborhood (displayed as static labels, e.g., "~15 min from CBD")

#### 4.10.3 Non-Functional Requirements

- Google Maps JavaScript API must be loaded asynchronously to avoid blocking page render
- Maps API key must be restricted by domain in Google Cloud Console
- Map view must be responsive and functional on mobile (touch drag, pinch-to-zoom)
- For SEO purposes, listing pages must include structured data (`schema.org/LocalBusiness`) with `geo` coordinates

---

## 5. Database Schema (Logical Overview)

```
users           → id, name, email, phone, role (GUEST/VENDOR/ADMIN), created_at
vendors         → id, user_id, business_name, status (PENDING/ACTIVE/SUSPENDED), kyc_verified
properties      → id, vendor_id, type (HOTEL/RESTAURANT), name, slug, description, address, lat, lng, neighborhood, status
property_images → id, property_id, url, sort_order
amenities       → id, property_id, label
room_types      → id, property_id, name, description, bed_type, max_occupancy, price_per_night, quantity, cancellation_policy, deposit_pct
availability_blocks → id, room_type_id, blocked_date (for hotels)
dining_config   → id, property_id, slot_interval_mins, max_covers_per_slot
operating_hours → id, property_id, day_of_week, open_time, close_time, is_closed
slot_blocks     → id, property_id, blocked_date, blocked_slot_time
bookings        → id, reference, user_id (nullable), property_id, type (HOTEL/RESTAURANT), status, guest_name, guest_phone, guest_email, party_size, check_in, check_out, slot_time, special_requests, total_amount, deposit_amount, created_at
transactions    → id, booking_id, mpesa_receipt_number, amount, phone, type (C2B/B2C), status, raw_payload, created_at
reviews         → id, booking_id, property_id, user_id, overall_rating, cleanliness, food_quality, service, value, location, body, status (PENDING/APPROVED/REJECTED), created_at
review_replies  → id, review_id, vendor_id, body, created_at
notifications   → id, booking_id, recipient_phone, template_name, channel (WHATSAPP/SMS/EMAIL), status, sent_at
audit_logs      → id, admin_id, action, target_type, target_id, payload, created_at
waitlist        → id, property_id, slot_date, slot_time, guest_name, guest_phone, position, status (WAITING/NOTIFIED/BOOKED/EXPIRED)
```

---

## 6. API Endpoint Summary

### Public Endpoints (no auth)

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/properties` | Search/filter hotels and restaurants |
| `GET` | `/api/properties/[slug]` | Get single property details |
| `GET` | `/api/properties/[slug]/availability` | Get available rooms or time slots |
| `GET` | `/api/properties/[slug]/reviews` | Get paginated reviews |
| `POST` | `/api/bookings` | Create a new booking (pre-payment) |
| `POST` | `/api/payments/mpesa/initiate` | Trigger STK Push |
| `POST` | `/api/payments/mpesa/callback` | Daraja callback webhook (Safaricom only) |
| `POST` | `/api/payments/card/callback` | IntaSend card payment callback |
| `GET` | `/api/bookings/[reference]/cancel` | Tokenised guest cancellation |

### Vendor Endpoints (auth: VENDOR role)

| Method | Path | Description |
|---|---|---|
| `GET/PUT` | `/api/vendor/profile` | Get or update vendor profile |
| `GET/POST` | `/api/vendor/properties` | List or create a property |
| `PUT/DELETE` | `/api/vendor/properties/[id]` | Update or delete a property |
| `GET/POST` | `/api/vendor/properties/[id]/rooms` | Manage room types |
| `GET/POST` | `/api/vendor/properties/[id]/hours` | Manage operating hours / pacing |
| `GET` | `/api/vendor/bookings` | List all vendor bookings |
| `PUT` | `/api/vendor/bookings/[id]/status` | Update booking status |
| `POST` | `/api/vendor/reviews/[id]/reply` | Reply to a review |

### Admin Endpoints (auth: ADMIN role)

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/admin/dashboard` | Overview KPIs |
| `GET/PUT` | `/api/admin/vendors` | List vendors / approve/suspend |
| `GET` | `/api/admin/users` | List users |
| `GET` | `/api/admin/bookings` | All bookings |
| `GET` | `/api/admin/transactions` | All transactions |
| `POST` | `/api/admin/refunds` | Manual refund trigger |
| `GET/PUT` | `/api/admin/reviews` | Moderation queue |
| `GET` | `/api/admin/audit-logs` | Audit trail |

### WhatsApp Inbound Webhook

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/whatsapp/webhook` | Receive inbound guest replies (status updates) |
| `GET` | `/api/whatsapp/webhook` | Meta webhook verification challenge |

---

## 7. Environment Variables

```env
# App
NEXT_PUBLIC_APP_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Database
DATABASE_URL=

# Daraja (M-Pesa)
DARAJA_CONSUMER_KEY=
DARAJA_CONSUMER_SECRET=
DARAJA_SHORTCODE=
DARAJA_PASSKEY=
DARAJA_CALLBACK_URL=
DARAJA_B2C_INITIATOR_NAME=
DARAJA_B2C_SECURITY_CREDENTIAL=
DARAJA_ENV=sandbox # or production

# IntaSend (Card payments)
INTASEND_API_KEY=
INTASEND_PUBLISHABLE_KEY=

# WhatsApp Business API
WHATSAPP_API_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_VERIFY_TOKEN=
WHATSAPP_WEBHOOK_SECRET=

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
GOOGLE_MAPS_SERVER_API_KEY=

# Cloudinary (Media)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Email (Resend)
RESEND_API_KEY=
EMAIL_FROM=

# SMS Fallback (Africa's Talking)
AT_API_KEY=
AT_USERNAME=

# Redis / BullMQ
REDIS_URL=

# Safaricom IP Whitelist (comma-separated)
DARAJA_ALLOWED_IPS=
```

---

## 8. Non-Functional Requirements (System-Wide)

| Category | Requirement |
|---|---|
| **Performance** | Public pages (SSR/SSG) must achieve Lighthouse mobile score ≥ 85 |
| **Performance** | API response time (p95) must be under 500ms for read endpoints |
| **Performance** | Checkout page must load in under 2s on a 4G connection |
| **Availability** | Target 99.5% uptime; deployment must use zero-downtime deployments |
| **Security** | All API keys stored in environment variables; no secrets in source code |
| **Security** | Payment webhook endpoints must validate origin and payload integrity |
| **Security** | All routes in vendor and admin dashboards protected by role-based middleware |
| **Security** | Parameterised Prisma queries only — no raw SQL string interpolation |
| **Data** | All booking and payment operations must be wrapped in database transactions |
| **Data** | Soft deletes only for bookings, reviews, users, and vendors |
| **Compliance** | No PII logged in plaintext application logs |
| **Localisation** | All prices displayed in KES; all times in EAT (Africa/Nairobi, UTC+3) |
| **Accessibility** | WCAG 2.1 AA compliance on all public-facing pages |
| **Mobile** | All public UI must be fully usable on a 375px viewport (mobile-first) |

---

## 9. Phased Implementation Roadmap

### Phase 1 — Foundation (Weeks 1–4)

- Database schema setup and Prisma migrations
- NextAuth authentication (guest, vendor, admin roles)
- Hotel and restaurant listing pages (public, SSG/SSR)
- Property search with neighborhood and type filters
- Image upload with Cloudinary
- Google Maps integration (search + listing embed)
- Vendor dashboard: profile and listing management

### Phase 2 — Booking & Payments (Weeks 5–8)

- Room booking flow (availability, checkout, confirmation)
- Table booking flow (slots, pacing, checkout, confirmation)
- Daraja 3.0 STK Push integration
- Callback reconciler and payment ledger
- IntaSend card payment integration
- B2C automated refunds
- WhatsApp notification system (confirmations, reminders)
- Inbound WhatsApp webhook (guest status replies)

### Phase 3 — Trust, Reviews & Admin (Weeks 9–12)

- Reviews system (submission, moderation, display, vendor replies)
- Admin dashboard (KPIs, vendor/user/booking/payment management)
- Vendor dashboard: booking management, pacing controls, review replies, payout view
- Waitlist feature (restaurants)
- 2-hour pre-dining WhatsApp reminder + status update flow
- QA, performance tuning, and security audit
- Production deployment

---

## 10. Open Questions / Decisions Pending

| # | Question | Owner | Target Decision |
|---|---|---|---|
| 1 | Will the platform charge vendors a fixed monthly SaaS fee, a per-booking commission, or both? Commission rate affects the `transactions` ledger design. | GTSS Founders | Before Phase 2 |
| 2 | Which WhatsApp provider: Meta Cloud API directly, or Twilio? Meta is cheaper at scale; Twilio has faster sandbox setup for dev. | Elvin | Before Phase 2 |
| 3 | KYC verification for vendors — is this manual (admin reviews docs) or automated via a third-party identity API (e.g., Smile ID)? | GTSS | Before Phase 1 launch |
| 4 | Is guest account creation optional (guest checkout supported) or mandatory? Current spec says optional — confirm this won't impact review eligibility tracking. | GTSS | Before Phase 1 |
| 5 | Payout mechanism for vendors — manual bank transfers by admin, or automated via Pesapal / bank API? | GTSS | Before Phase 3 |