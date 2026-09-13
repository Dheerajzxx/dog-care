# 🐕 PawCare Dog Hospital

A complete dog-hospital website prototype: a **public site** for dog owners (services, doctors, online booking, emergency info) and a full **admin panel** for hospital staff (appointments, patients, medical records, doctors, customers, services, settings).

Built with **pure HTML / CSS / JavaScript** — no frameworks, no build step. Data lives in a mock store backed by `localStorage`, so every feature is fully clickable. Swap `assets/js/data.js` for a real API later without touching the pages.

---

## Quick start

No build required. Either:

- **Open directly:** double-click `index.html` (works from `file://`), or
- **Serve locally** (recommended so localStorage is shared across pages):

```bash
npx serve .          # or: python3 -m http.server 8080
```

Then open the printed URL.

### Demo credentials (admin)

| URL | Username | Password |
|-----|----------|----------|
| `admin/login.html` | `admin` | `dog123` |

> The admin session and all data live in your browser's localStorage. Use **Admin → Settings → Reset demo data** to wipe changes and reseed.

---

## Pages

### Public site
| Page | Path | Highlights |
|------|------|-----------|
| Home | `index.html` | Hero, services preview, stats, doctors, testimonials |
| About | `public/about.html` | Story, values, facility, opening hours |
| Services | `public/services.html` | Category filter, pricing cards |
| Doctors | `public/doctors.html` | Profile cards + bio modals |
| **Booking** | `public/booking.html` | 4-step wizard with live slot availability |
| Emergency | `public/emergency.html` | 24/7 hotline, warning signs |
| Contact | `public/contact.html` | Info, form, FAQ accordion |

### Admin panel (`admin/`)
| Page | Highlights |
|------|-----------|
| `login.html` | Demo auth (localStorage session) |
| `dashboard.html` | Stat cards, weekly chart, today's schedule, vaccine reminders |
| `appointments.html` | Search/filter/sort, status workflow (pending → confirmed → completed/cancelled), walk-in creation, notes |
| `patients.html` | Patient profiles, vaccinations, allergies, medical-record timeline |
| `doctors.html` | CRUD + weekly availability schedule |
| `customers.html` | Owners with linked dogs & visit history |
| `services.html` | CRUD, pricing, publish/unlist |
| `settings.html` | Hospital info, booking slot rules, demo reset |

---

## Architecture

```
├── index.html
├── design-system.html      # component showcase
├── public/                 # 7 public pages
├── admin/                  # 8 admin pages
└── assets/
    ├── css/
    │   ├── shared.css      # design tokens + component library (both sites)
    │   ├── public.css      # public page styles
    │   └── admin.css       # admin page styles
    └── js/
        ├── data.js         # mock data + localStorage store (the "backend")
        ├── ui.js           # toasts, modals, validation, layout shells, auth guard
        ├── public.js       # public page renderers (services, doctors, stats)
        └── table.js        # reusable admin table: search, sort, paginate
```

**Data model:** `services`, `doctors`, `customers`, `patients`, `appointments`, `records` (medical), `settings` — all read/written through `DH.store` (`list / get / add / update / remove / reset`). Joined lookups via `DH.lookup` (e.g. `appointmentView`).

**Booking flow:** the wizard computes free slots from existing appointments + settings (open time, close time, slot interval) and upserts owner/patient records on submit.

---

## Known demo limitations

- Auth is client-side demo-grade (hardcoded credentials, no real security).
- Data is per-browser; clearing site data resets everything.
- Photos are initials-based avatars; drop real images into `assets/img/` and set `photo` fields.
