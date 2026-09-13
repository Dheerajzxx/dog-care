# 🐕 Dog Hospital — Development Plan

A phased plan for building a **Dog Hospital** website: a public-facing frontend for dog owners and a full-featured **Admin panel** for hospital staff.

- **Tech stack:** Pure HTML / CSS / JavaScript (no build step, no frameworks)
- **Language:** English
- **Data:** Mock data in JS + `localStorage` as a fake backend (easy to swap for a real API later)
- **Every phase ends in a working, reviewable state**

---

## Target Folder Structure

```
dog-hospital/
├── PLAN.md
├── index.html                  # Home (public)
├── public/                     # Public site pages
│   ├── about.html
│   ├── services.html
│   ├── doctors.html
│   ├── booking.html
│   ├── contact.html
│   └── emergency.html
├── admin/                      # Admin panel pages
│   ├── login.html
│   ├── dashboard.html
│   ├── appointments.html
│   ├── patients.html           # Dog patients + medical records
│   ├── doctors.html
│   ├── customers.html          # Dog owners
│   ├── services.html           # Services & pricing management
│   └── settings.html
├── assets/
│   ├── css/
│   │   ├── shared.css          # Design tokens, resets, common components
│   │   ├── public.css          # Public site styles
│   │   └── admin.css           # Admin panel styles
│   ├── js/
│   │   ├── data.js             # Mock data + localStorage "API"
│   │   ├── ui.js               # Shared UI helpers (toast, modal, format)
│   │   ├── public.js           # Public site behavior (nav, forms)
│   │   └── admin.js            # Admin behavior (auth guard, tables, CRUD)
│   └── img/                    # Logo, illustrations, doctor photos (placeholders)
```

---

## Phase 0 — Foundation & Design System
**Goal:** Shared skeleton so every page looks consistent.

- [x] Create folder structure and `PLAN.md` (this file)
- [x] `shared.css`: design tokens (colors, spacing, fonts, radii, shadows), CSS reset, reusable components (buttons, forms, cards, badges, tables, modal, toast)
- [x] `data.js`: mock data — doctors, services, dog patients, owners, appointments, and a tiny localStorage-backed store (`get`, `save`, `list`, seed data)
- [x] `ui.js`: helpers — currency/date formatting, toast notifications, modal open/close, form validation helpers
- [x] Public site header/footer (shared markup pattern) + responsive mobile nav
- [x] Decide color palette (calming teal/warm orange, pet-friendly tone) and pick a Google Font (e.g., Nunito or Quicksand)
- [x] `design-system.html`: live component demo (verify in browser)

**Deliverable:** Design system + data layer ready for all pages.

---

## Phase 1 — Public Site: Core Pages
**Goal:** The marketing/informational site.

- [x] `index.html` — Home: hero with CTA ("Book Appointment"), services preview, why-choose-us stats, featured doctors, testimonials, footer
- [x] `public/about.html` — Hospital story, mission, facility photos, hours
- [x] `public/services.html` — Service cards with icons, descriptions, pricing; filter by category (Wellness / Surgery / Dental / Grooming / Emergency)
- [x] `public/doctors.html` — Doctor profile cards (photo, specialty, availability, bio modal)
- [x] `public/emergency.html` — Emergency notice banner component + 24/7 hotline CTA

**Deliverable:** Complete informational site, fully responsive.

---

## Phase 2 — Public Site: Appointment Booking
**Goal:** The core conversion flow.

- [x] `public/booking.html` — Multi-step booking wizard:
  1. Select service → 2. Select doctor & date/time slot → 3. Dog & owner details → 4. Review & confirm
- [x] Slot availability computed from existing appointments in the store
- [x] Client-side validation (phone, email, dog age/weight)
- [x] Confirmation screen with booking reference number + "Add another" 
- [x] Link booking CTAs across all public pages

**Deliverable:** End-to-end booking flow writing to the shared data store.

---

## Phase 3 — Public Site: Contact & Extras
**Goal:** Round out the public experience.

- [x] `public/contact.html` — Contact info, embedded map placeholder, contact form, FAQ accordion
- [x] SEO basics: page titles, meta descriptions, favicon
- [x] Accessibility pass: alt text, labels, focus states, keyboard nav

**Deliverable:** Public site complete — 6 pages.

---

## Phase 4 — Admin: Auth & Dashboard
**Goal:** Admin shell and overview.

- [x] `admin/login.html` — Login form, demo credentials, session via localStorage
- [x] Auth guard in `admin.js` (redirect to login if no session)
- [x] Admin layout: sidebar nav, topbar (search, admin menu, logout), content area
- [x] `admin/dashboard.html` — Stat cards (today's appointments, total patients, revenue this month, pending requests), upcoming appointments list, recent registrations, simple chart (CSS/SVG bars)

**Deliverable:** Login → dashboard flow working.

---

## Phase 5 — Admin: Appointments Management
**Goal:** The daily operations screen.

- [x] `admin/appointments.html` — Table with search, filters (status, date, doctor), pagination
- [x] Status workflow: Pending → Confirmed → Completed / Cancelled
- [x] Appointment detail modal; confirm/cancel/reschedule actions
- [x] New walk-in appointment form (reuses booking fields)
- [x] Status changes update the store and reflect on dashboard stats

**Deliverable:** Staff can manage the full appointment lifecycle.

---

## Phase 6 — Admin: Patients & Medical Records
**Goal:** The clinical core.

- [x] `admin/patients.html` — Dog patient list (photo, breed, age, owner), search & filters
- [x] Patient profile page/modal: owner info, vaccination history, allergies, notes
- [x] Medical records: add visit records (diagnosis, treatment, prescription, follow-up date)
- [x] Vaccination due reminders list

**Deliverable:** Complete patient records management.

---

## Phase 7 — Admin: Doctors, Customers, Services, Settings
**Goal:** Remaining management screens.

- [x] `admin/doctors.html` — CRUD doctors, specialties, availability schedules
- [x] `admin/customers.html` — Owner list with linked dogs and appointment history
- [x] `admin/services.html` — CRUD services, categories, pricing, active/inactive toggle
- [x] `admin/settings.html` — Hospital info, opening hours, booking slot interval

**Deliverable:** Full CRUD across all entities.

---

## Phase 8 — Polish & QA
**Goal:** Ship-quality pages.

- [x] Responsive testing across breakpoints (mobile / tablet / desktop)
- [x] Form validation + empty/error/empty-state UI everywhere
- [x] Cross-page consistency audit (spacing, buttons, badges)
- [x] Reset-data utility for demos (clear localStorage, reseed)
- [x] Final review + README with how to run and demo credentials
- [x] Mobile admin: off-canvas sidebar with backdrop, Escape/backdrop close, scroll lock (geometry-verified)
- [x] Admin drawer gestures: finger-following swipe-to-close, edge-swipe-to-open, snap-back threshold + flick velocity (synthetic-touch verified)
- [x] Public mobile navbar: animated drawer panel, backdrop, Escape, scroll lock, aria-expanded
- [x] Responsive audit: 16 pages × 390/768/1440 — zero horizontal overflow, zero offenders; dashboard 2-col grids collapse on mobile

**Deliverable:** Polished, consistent, demo-ready site.

---

## Milestones Summary

| Phase | Scope | Pages |
|-------|-------|-------|
| 0 | Foundation & design system | — |
| 1 | Public core pages | 4 |
| 2 | Booking flow | 1 |
| 3 | Contact & extras | 1 |
| 4 | Admin auth + dashboard | 2 |
| 5 | Admin appointments | 1 |
| 6 | Admin patients & records | 1 |
| 7 | Admin CRUD screens | 4 |
| 8 | Polish & QA | — |

**Total: ~14 pages** across public site + admin panel.
