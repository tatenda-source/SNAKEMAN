# SNAKEMAN — Project Status

**Zimbabwe Snake Identification & Expert Consultation Platform**
Built for Chawa's Wild Adventures (@chawaswildadventures)

---

## What Has Been Built

### Architecture Overview

A full-stack, cross-platform application spanning four packages:

```
SNAKEMAN/
├── backend/     FastAPI (Python)        → localhost:8000
├── web/         Next.js 14 (client)     → localhost:3000
├── portal/      Next.js 14 (experts)    → localhost:3001
└── mobile/      Expo React Native       → iOS + Android
```

---

## Package Breakdown

### 1. Backend — `backend/`

**Stack:** Python, FastAPI, Anthropic Claude API, Pydantic, Uvicorn

#### AI Engine (`ai/claude_identify.py`)
- Snake identification via **Claude claude-sonnet-4-6 vision** — accepts a base64-encoded image and returns a structured JSON result with species name, confidence score, danger level, visible features, immediate action advice, and alternative matches
- Emergency guidance via Claude — accepts a free-text encounter description and returns severity assessment, step-by-step instructions, do-not list, and a reassurance message
- Uses `AsyncAnthropic` client so Claude API calls are non-blocking
- User-supplied text is wrapped in XML delimiters and truncated before prompt injection into Claude to prevent prompt injection attacks

#### Species Database (`data/snakes.py`)
Full profiles for all 8 Zimbabwe snake species:

| Species | Danger | Venom Type |
|---------|--------|------------|
| Black Mamba | CRITICAL | Neurotoxic |
| Mozambique Spitting Cobra | CRITICAL | Cytotoxic + Spit |
| Puff Adder | CRITICAL | Cytotoxic |
| Boomslang | HIGH | Haemotoxic |
| Eastern Green Mamba | HIGH | Neurotoxic |
| Egyptian Cobra | HIGH | Neuro + Cytotoxic |
| African Rock Python | MEDIUM | Non-venomous |
| Rinkhals | HIGH | Neuro + Spit |

Each profile includes: description, habitat, behaviour, venom effects, first aid protocol, antivenom availability, endemic regions, and visual identification tags.

#### API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `GET /health` | — | Health check |
| `GET /api/snakes` | — | All 8 species |
| `GET /api/snakes/{id}` | — | Single species |
| `POST /api/identify/` | multipart | Photo → AI identification |
| `GET /api/identify/species` | — | Species summary list |
| `GET /api/experts/` | — | List experts (filter: available) |
| `GET /api/experts/{id}` | — | Single expert profile |
| `POST /api/bookings/` | JSON | Create booking |
| `GET /api/bookings/` | — | List bookings (filter: status, expert) |
| `GET /api/bookings/{id}` | — | Single booking |
| `PATCH /api/bookings/{id}/status` | JSON | Confirm / cancel / complete |
| `GET /api/bookings/slots/available` | — | Available time slots for a date |
| `POST /api/emergency/report` | JSON | Report emergency → AI guidance + expert alert |
| `GET /api/emergency/active` | — | All active emergencies |
| `POST /api/emergency/{id}/resolve` | JSON | Mark resolved + broadcast to experts |
| `WS /api/emergency/ws/expert` | WebSocket | Expert portal real-time feed |
| `WS /api/emergency/ws/user/{id}` | WebSocket | User status updates |
| `GET /api/content/` | — | Library content (filter: type, species, featured) |
| `POST /api/content/` | JSON | Create content item |
| `GET /api/content/{id}` | — | Single item + view count |
| `POST /api/content/{id}/like` | — | Like content |
| `DELETE /api/content/{id}` | JSON | Delete (author verified via body) |
| `POST /api/auth/register` | JSON | User registration (Supabase stub) |
| `POST /api/auth/login` | JSON | Login (Supabase stub) |

#### Expert Profiles (seeded)
- **Dr. Tendai Moyo** — Senior Herpetologist, Harare (847 sessions, 4.9★)
- **Sibongile Ncube** — Wildlife Rescue Specialist, Bulawayo (623 sessions, 4.8★)
- **Marcus Fitzgerald** — Emergency Toxicologist, Harare (1,204 sessions, 4.95★)
- **Ruvimbo Chikwanda** — Conservation Educator, Mutare (312 sessions, 4.7★)

---

### 2. Web Client — `web/`

**Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, Framer Motion, Axios, React Query, React Dropzone, React Hot Toast

**Design System — "Scales & Shadows"**
- Colour palette: deep forest black (`#030A05`), venom green (`#22C55E`), danger red (`#EF4444`), warning amber (`#F59E0B`), safe violet (`#A78BFA`)
- Typography: Playfair Display (headings), Inter (body)
- Effects: glassmorphism cards, animated SVG snake scale background patterns, ambient glow orbs, CSS glow on emergency elements

#### Pages

**`/` — Landing Page**
- Full-viewport hero with animated snake SVG and rotating species card (cycles every 3.5 s through all 8 species)
- Live danger level badge, venom type, and max length on each card
- Four feature cards (Identify, Consult, Emergency, Library) with glassmorphism
- Horizontal scroll species encyclopedia
- Emergency section with pulsing red CTA and 3-step protocol
- Expert team preview grid with availability indicators
- Stats: 8 species, 4 experts, 24/7 support

**`/identify` — AI Snake Identification**
- Drag-and-drop image upload zone (or click to browse)
- Optional context text field (capped at 500 characters)
- Live image preview with clear button
- Loading state while Claude processes
- Result panel: confidence percentage, danger badge, species name, scientific name, immediate action, visible features tags, AI reasoning, first aid protocol, antivenom availability, alternative matches
- CRITICAL species triggers a toast + direct link to Emergency page

**`/emergency` — Emergency Response**
- Bitten / not bitten toggle with visual state change
- Free-text encounter description
- Manual address entry + one-tap GPS capture via browser geolocation
- Phone number field
- Submits to backend → gets AI guidance immediately
- Result view: severity badge, reassurance message, numbered DO steps, DO NOT list, direct 999 call button

**`/book` — Expert Consultation Booking**
- Expert selection cards with availability badge, rating, consultation count, location, specialisation
- Horizontal date picker (next 14 weekdays, weekends excluded)
- Time slot grid (8 slots) with real-time availability from API
- User details form (name, email, phone, location, reason)
- Booking summary card
- Success screen with booking ID

**`/library` — Knowledge Library**
- Search bar
- Species filter chips (all 8 snakes)
- Category tabs (All, First Aid, Identification, Safety, Emergency, Education)
- Species encyclopedia grid (8 cards with SVG silhouettes)
- Article/tip cards with type badges, view counts, author attribution

---

### 3. Expert Portal — `portal/`

**Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, Recharts, Lucide Icons

A separate application served on port 3001 with its own sidebar navigation — isolated from the public client UI.

#### Sidebar Navigation
- Dashboard, Bookings, Emergency, Content, Experts, Settings, Sign Out
- Expert profile display with online indicator
- Active emergency indicator dot on the Emergency nav item

#### Pages

**`/` — Dashboard**
- 4 stat cards: Total Bookings, Active Emergencies (with urgent pulse), Consultations Done, Library Views
- Recharts `AreaChart` showing Bookings vs Emergencies over the past 7 days (with gradient fills)
- Active emergencies panel — severity-coded cards with timestamps, location, bitten indicator
- Recent bookings table with status badges, confirm/cancel inline actions, hover-reveal action menu

**`/bookings` — Booking Management**
- Full data table with search and status filter tabs
- Click-to-select row opens a detail side panel
- Detail panel: all client info (name, email, phone, date/time, location, species concern, reason)
- Confirm and Cancel actions from both the table and the detail panel
- Toast notifications on status changes

**`/emergency` — Emergency Response Centre**
- Split layout: emergency list (left) + detail panel (right)
- Severity-coded cards (CRITICAL / HIGH / MEDIUM) with colour-coded backgrounds
- Detail panel: full encounter description, location, GPS coordinates, phone, bitten status
- AI guidance display (steps given to the user)
- Expert notes textarea
- Direct "Call User" tel link
- "Mark Resolved" action with broadcast to all connected expert sockets
- WebSocket-ready architecture (resolving broadcasts `EMERGENCY_RESOLVED` to all connected portals)

---

### 4. Mobile App — `mobile/`

**Stack:** Expo SDK 51, Expo Router (file-based navigation), React Native, NativeWind, Expo Camera, Expo Image Picker, Expo Location, Expo Haptics, React Query

#### Tab Navigation
Five tabs with a **raised emergency button** in the centre position — tapping it triggers error-level haptic feedback and opens the emergency modal full-screen.

#### Screens

**Home (`/`)** — Hero section, emergency CTA, 3 quick-action feature cards (Identify, Library, Consult), horizontal snake species scroll, daily safety tip card

**Identify (`/identify`)** — Camera and gallery picker, image preview, optional context input, POST to `/api/identify/`, full result display (danger badge, confidence %, immediate action, features, first aid, CRITICAL emergency link)

**Emergency (`/emergency`)** — Full-screen modal, bitten toggle with switch, encounter description, GPS capture via `expo-location`, phone field, submit with haptic feedback, AI guidance result with numbered steps and 999 call button

**Library (`/library`)** — Search, species encyclopedia horizontal scroll, article list with type badges and view counts

**Book (`/book`)** — Expert selection, weekday date picker (next 7), time slot grid, user details form, booking confirmation screen with booking ID

---

## Audit Fixes Applied

After initial scaffold, a full senior engineer audit was performed. Every issue was fixed before any code shipped.

### P0 — Would break in production

| Issue | Fix |
|-------|-----|
| `client.messages.create()` (synchronous) called inside `async` functions — blocks entire event loop on every Claude API call | Switched to `AsyncAnthropic` + `await` |
| Emergency ID format `EMG-{timestamp}` — two simultaneous reports in the same second overwrite each other | Added `uuid.uuid4().hex[:6]` suffix |
| `postcss.config.js` missing on both `web/` and `portal/` — Tailwind generates nothing without it; entire UI renders unstyled | Created both |
| `tsconfig.json` missing on both `web/` and `portal/` — Next.js refuses to start | Created both |

### P1 — Security

| Issue | Fix |
|-------|-----|
| User `description` and `location` interpolated directly into LLM prompts — prompt injection possible | Wrapped in XML delimiters, truncated to max chars before interpolation |
| `ALLOWED_ORIGINS.split(",")` — a space in the env var produces `" http://..."` which never matches | Strip whitespace + filter empty strings |
| `image.content_type` is `Optional[str]` — `None not in set` evaluates to `True`, bypassing the MIME check | Added `not image.content_type or ...` guard |
| `DELETE /content/{id}?author_id=xxx` — authorization via query param is trivially spoofed and logged | Moved to `DeleteRequest` body model |

### P2 — Correctness & code quality

| Issue | Fix |
|-------|-----|
| `connected_experts: List[WebSocket]` — plain list with no deduplication; `asyncio.sleep(5)` in user websocket sends redundant payloads and blocks client messages | Replaced with `_ConnectionManager` class using a `set`; user socket is now event-driven |
| `resolve_emergency(expert_notes: Optional[str] = None)` — long notes as query param break URL length limits and log PII | Replaced with `ResolveRequest` body model |
| `import json` inside two function bodies | Moved to top-level |
| `UploadFile, File, Form` imported in `content.py`, never used | Removed |
| `date, time, List` imported in `bookings.py`, never used | Removed |
| `BookingStatus` was a free-form `str` — any value passed validation | Changed to `Literal["PENDING","CONFIRMED","CANCELLED","COMPLETED"]` |
| Manual `content_type in CONTENT_TYPES` check redundant after switching to `Literal` | Removed; replaced with explanatory comment |

### P3 — Configuration & minor

| Issue | Fix |
|-------|-----|
| `portal/next.config.ts` missing | Created |
| `mobile/babel.config.js` missing — Expo won't build without it | Created |
| `.env.example` / `.env.local.example` missing on all packages | Created for all 3 packages |
| `getNext14Days()` called inside component body — recomputes 14-iteration loop on every render | Moved to module scope as `NEXT_14_WEEKDAYS` constant |
| Unused `Clock`, `User` imports in `web/app/book/page.tsx` | Removed |

---

## Setup Instructions

### Prerequisites
- Python 3.11+
- Node.js 20+
- An Anthropic API key
- (Optional) Supabase project for auth and persistent storage

### 1 — Backend

```bash
cd SNAKEMAN/backend
pip install -r requirements.txt
cp .env.example .env
# Edit .env — add ANTHROPIC_API_KEY
uvicorn main:app --reload --port 8000
```

API docs auto-generated at `http://localhost:8000/docs`

### 2 — Web Client

```bash
cd SNAKEMAN/web
npm install
cp .env.local.example .env.local
# Edit .env.local if API is not on localhost:8000
npm run dev
# → http://localhost:3000
```

### 3 — Expert Portal

```bash
cd SNAKEMAN/portal
npm install
cp .env.local.example .env.local
npm run dev
# → http://localhost:3001
```

### 4 — Mobile

```bash
cd SNAKEMAN/mobile
npm install
cp .env.example .env
npx expo start
# Scan QR with Expo Go app (iOS or Android)
```

---

## What Remains (Next Steps)

### Supabase Integration
- [ ] Replace placeholder auth routes in `backend/routes/auth.py` with Supabase Auth
- [ ] Replace in-memory `bookings_db`, `content_db`, `active_emergencies` with Supabase tables
- [ ] Wire Supabase Realtime to replace the in-memory WebSocket emergency broadcast
- [ ] Use Supabase Storage for photo uploads from the identify flow

### Authentication & Authorisation
- [ ] Add JWT middleware to protected routes (bookings, content, emergency)
- [ ] Replace `author_id` body field in content delete with JWT claim
- [ ] Expert portal login screen with role-based access

### Feature Completions
- [ ] `web/app/library/[snake_id]/page.tsx` — full species detail page
- [ ] `mobile/app/snake/[id].tsx` — species detail screen
- [ ] `portal/app/content/page.tsx` — content management UI
- [ ] `portal/app/experts/page.tsx` — expert management UI
- [ ] Push notifications (Expo Notifications) for expert alerts on new emergency reports
- [ ] Rate limiting on the `/api/identify/` endpoint (Claude API costs)

### Production Readiness
- [ ] Deploy backend to Railway or Fly.io
- [ ] Deploy web + portal to Vercel
- [ ] EAS Build for iOS TestFlight and Android APK
- [ ] Add Sentry for error tracking
- [ ] Add structured logging (structlog or loguru)

---

*Last updated: March 2026*
