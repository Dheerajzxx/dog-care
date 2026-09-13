/* ============================================================
   DOG HOSPITAL — DATA LAYER
   Mock data + localStorage-backed store ("fake backend").
   Swapping this file for a real API later requires no changes
   in pages: everything reads/writes through DH.store.
   ============================================================ */

window.DH = window.DH || {};

(function () {
  'use strict';

  /* ---------- Seed data ---------- */

  const SERVICES = [
    { id: 'svc-1', name: 'General Consultation', category: 'Wellness', price: 45, duration: 30, description: 'Full physical exam, health assessment, and care advice.', active: true },
    { id: 'svc-2', name: 'Vaccination', category: 'Wellness', price: 60, duration: 20, description: 'Core vaccines incl. rabies, distemper, parvovirus.', active: true },
    { id: 'svc-3', name: 'Spay / Neuter Surgery', category: 'Surgery', price: 250, duration: 120, description: 'Safe sterilization surgery with pre-op screening.', active: true },
    { id: 'svc-4', name: 'Dental Cleaning', category: 'Dental', price: 130, duration: 60, description: 'Ultrasound scaling and polishing under light anesthesia.', active: true },
    { id: 'svc-5', name: 'Grooming & Bath', category: 'Grooming', price: 40, duration: 45, description: 'Bath, blow-dry, nail trim, ear cleaning.', active: true },
    { id: 'svc-6', name: 'Emergency Care', category: 'Emergency', price: 95, duration: 60, description: '24/7 urgent care for accidents and sudden illness.', active: true },
    { id: 'svc-7', name: 'Diagnostic Imaging (X-ray)', category: 'Diagnostics', price: 110, duration: 40, description: 'Digital X-ray with radiologist review.', active: true },
    { id: 'svc-8', name: 'Microchipping', category: 'Wellness', price: 35, duration: 15, description: 'ISO-standard microchip with registration.', active: true }
  ];

  const DOCTORS = [
    { id: 'doc-1', name: 'Dr. Sarah Mitchell', specialty: 'Surgery', photo: '', color: '#0e7c86', bio: '12 years of experience in soft-tissue and orthopedic surgery. Lead of the surgical team.', active: true },
    { id: 'doc-2', name: 'Dr. James Chen', specialty: 'Internal Medicine', photo: '', color: '#f5872e', bio: 'Specializes in diagnostics and chronic disease management for senior dogs.', active: true },
    { id: 'doc-3', name: 'Dr. Emily Rodriguez', specialty: 'Dermatology', photo: '', color: '#3b82c4', bio: 'Allergy testing, skin conditions, and long-term dermatology care.', active: true },
    { id: 'doc-4', name: 'Dr. Michael Okafor', specialty: 'Dentistry', photo: '', color: '#2e9e5b', bio: 'Dental surgery, cleanings, and oral health programs.', active: true },
    { id: 'doc-5', name: 'Dr. Anna Kowalski', specialty: 'Emergency & Critical Care', photo: '', color: '#d64545', bio: 'Heads the night shift ER team. Trauma and critical care specialist.', active: true }
  ];

  const CUSTOMERS = [
    { id: 'cus-1', name: 'John Anderson', phone: '555-0101', email: 'john@example.com', address: '12 Maple St', createdAt: '2025-11-03' },
    { id: 'cus-2', name: 'Lisa Wang', phone: '555-0102', email: 'lisa@example.com', address: '48 Oak Ave', createdAt: '2025-12-11' },
    { id: 'cus-3', name: 'Carlos Mendez', phone: '555-0103', email: 'carlos@example.com', address: '7 Pine Rd', createdAt: '2026-01-22' },
    { id: 'cus-4', name: 'Sarah Johnson', phone: '555-0104', email: 'sarah.j@example.com', address: '230 Birch Blvd', createdAt: '2026-02-14' }
  ];

  const PATIENTS = [
    { id: 'pat-1', name: 'Max', breed: 'Golden Retriever', gender: 'Male', age: 4, weight: 32, ownerId: 'cus-1', photo: '', color: '#f5b942', vaccinations: [{ name: 'Rabies', date: '2025-09-15', due: '2026-09-15' }, { name: 'DHPP', date: '2025-10-02', due: '2026-10-02' }], allergies: ['Chicken protein'], notes: 'Very friendly, treats motivated.' },
    { id: 'pat-2', name: 'Bella', breed: 'Beagle', gender: 'Female', age: 2, weight: 11, ownerId: 'cus-2', photo: '', color: '#8b6fd6', vaccinations: [{ name: 'Rabies', date: '2026-01-10', due: '2027-01-10' }], allergies: [], notes: 'Anxious in waiting room — prefer quiet area.' },
    { id: 'pat-3', name: 'Rocky', breed: 'German Shepherd', gender: 'Male', age: 6, weight: 38, ownerId: 'cus-3', photo: '', color: '#6d8a4e', vaccinations: [{ name: 'Rabies', date: '2024-08-01', due: '2025-08-01' }], allergies: ['Flea saliva'], notes: 'Hip stiffness noted; monitor joints.' },
    { id: 'pat-4', name: 'Luna', breed: 'Poodle', gender: 'Female', age: 1, weight: 6, ownerId: 'cus-4', photo: '', color: '#d67fb0', vaccinations: [{ name: 'Rabies', date: '2026-03-20', due: '2027-03-20' }, { name: 'DHPP', date: '2026-03-20', due: '2027-03-20' }], allergies: [], notes: 'Puppy plan in progress.' }
  ];

  const APPOINTMENTS = [
    { id: 'apt-1001', serviceId: 'svc-1', doctorId: 'doc-2', patientId: 'pat-1', date: '2026-09-14', time: '09:00', status: 'confirmed', reason: 'Annual check-up', notes: '', createdAt: '2026-09-08T10:20:00Z' },
    { id: 'apt-1002', serviceId: 'svc-4', doctorId: 'doc-4', patientId: 'pat-3', date: '2026-09-14', time: '11:00', status: 'pending', reason: 'Bad breath, possible dental issue', notes: '', createdAt: '2026-09-09T15:45:00Z' },
    { id: 'apt-1003', serviceId: 'svc-2', doctorId: 'doc-1', patientId: 'pat-2', date: '2026-09-15', time: '14:30', status: 'confirmed', reason: 'Rabies booster due', notes: '', createdAt: '2026-09-09T09:10:00Z' },
    { id: 'apt-1004', serviceId: 'svc-6', doctorId: 'doc-5', patientId: 'pat-4', date: '2026-09-12', time: '19:45', status: 'completed', reason: 'Ate a sock — possible obstruction', notes: 'X-ray clear, sent home with monitoring advice.', createdAt: '2026-09-12T19:50:00Z' },
    { id: 'apt-1005', serviceId: 'svc-5', doctorId: 'doc-3', patientId: 'pat-1', date: '2026-09-10', time: '16:00', status: 'completed', reason: 'Routine grooming', notes: '', createdAt: '2026-09-05T12:00:00Z' },
    { id: 'apt-1006', serviceId: 'svc-1', doctorId: 'doc-2', patientId: 'pat-2', date: '2026-09-16', time: '10:15', status: 'pending', reason: 'Recurring ear infection', notes: '', createdAt: '2026-09-10T08:30:00Z' },
    { id: 'apt-1007', serviceId: 'svc-3', doctorId: 'doc-1', patientId: 'pat-4', date: '2026-09-18', time: '09:30', status: 'confirmed', reason: 'Spay surgery scheduled', notes: 'Pre-op fasting instructions given.', createdAt: '2026-09-11T11:15:00Z' },
    { id: 'apt-1008', serviceId: 'svc-1', doctorId: 'doc-2', patientId: 'pat-1', date: '2026-09-13', time: '13:00', status: 'confirmed', reason: 'Follow-up on seasonal itching', notes: '', createdAt: '2026-09-12T08:00:00Z' }
  ];

  const RECORDS = [
    { id: 'rec-1', patientId: 'pat-3', doctorId: 'doc-2', appointmentId: '', date: '2026-08-28', diagnosis: 'Mild hip dysplasia (left)', treatment: 'Joint supplement prescribed; weight management plan', prescription: 'Carprofen 100mg — 1 tab daily with food for 3 weeks', followUp: '2026-10-15', notes: 'Advise low-impact exercise, avoid stairs.' },
    { id: 'rec-2', patientId: 'pat-4', doctorId: 'doc-5', appointmentId: 'apt-1004', date: '2026-09-12', diagnosis: 'Suspected foreign body ingestion — no obstruction found', treatment: 'Observation, IV fluids for 2 hours', prescription: 'None', followUp: '', notes: 'X-ray clear. Owner advised on sock/toy safety at home.' },
    { id: 'rec-3', patientId: 'pat-1', doctorId: 'doc-3', appointmentId: 'apt-1005', date: '2026-09-10', diagnosis: 'Mild seasonal itching', treatment: 'Medicated bath during grooming visit', prescription: 'Antihistamine as needed', followUp: '', notes: 'Chicken protein allergy already on file — recommend hypoallergenic diet.' }
  ];

  const SETTINGS = {
    hospitalName: 'PawCare Dog Hospital',
    phone: '(555) 910-0123',
    email: 'care@pawcare.vet',
    address: '100 Wagging Tail Lane, Springfield',
    openHours: 'Mon–Sat 8:00–20:00 · Sun & Holidays 24/7 Emergency Only',
    emergencyPhone: '(555) 910-0911',
    slotInterval: 30,
    openTime: '08:00',
    closeTime: '20:00'
  };

  /* ---------- localStorage-backed store ---------- */

  const KEYS = {
    services: 'dh_services',
    doctors: 'dh_doctors',
    customers: 'dh_customers',
    patients: 'dh_patients',
    appointments: 'dh_appointments',
    records: 'dh_records',
    settings: 'dh_settings',
    auth: 'dh_admin_session'
  };

  const ENTITY_SEED = {
    services: SERVICES,
    doctors: DOCTORS,
    customers: CUSTOMERS,
    patients: PATIENTS,
    appointments: APPOINTMENTS,
    records: RECORDS,
    settings: SETTINGS
  };

  /** Read an entity by name; seeds localStorage on first run. */
  function read(entity) {
    const key = KEYS[entity];
    try {
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn('[DH] failed to read', key, e);
    }
    // First run (or corrupt data): seed and persist
    const seed = ENTITY_SEED[entity];
    if (seed) localStorage.setItem(key, JSON.stringify(seed));
    return seed ? JSON.parse(JSON.stringify(seed)) : null;
  }

  /** Persist an entity by name. */
  function write(entity, value) {
    localStorage.setItem(KEYS[entity], JSON.stringify(value));
  }

  const store = {
    /** Get all records of an entity. */
    list(entity) {
      return read(entity) || [];
    },

    /** Get one record by id, or null. */
    get(entity, id) {
      return store.list(entity).find((r) => r.id === id) || null;
    },

    /** Add a record; generates an id when missing. Returns the record. */
    add(entity, record) {
      const items = store.list(entity);
      if (!record.id) record.id = store.nextId(entity);
      items.push(record);
      write(entity, items);
      return record;
    },

    /** Update fields of a record by id. Returns updated record or null. */
    update(entity, id, patch) {
      const items = store.list(entity);
      const idx = items.findIndex((r) => r.id === id);
      if (idx === -1) return null;
      items[idx] = Object.assign({}, items[idx], patch, { id });
      write(entity, items);
      return items[idx];
    },

    /** Remove a record by id. Returns true if removed. */
    remove(entity, id) {
      const items = store.list(entity);
      const next = items.filter((r) => r.id !== id);
      if (next.length === items.length) return false;
      write(entity, next);
      return true;
    },

    /** Deterministic-ish incrementing id per entity, e.g. apt-1008 */
    nextId(entity) {
      const prefix = { services: 'svc', doctors: 'doc', customers: 'cus', patients: 'pat', appointments: 'apt', records: 'rec' }[entity] || 'itm';
      const items = store.list(entity);
      let max = 0;
      items.forEach((r) => {
        const m = String(r.id).match(/(\d+)$/);
        if (m) max = Math.max(max, parseInt(m[1], 10));
      });
      return prefix + '-' + (max + 1);
    },

    /** Wipe all data and reseed (demo reset). */
    reset() {
      Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
      Object.keys(ENTITY_SEED).forEach((entity) => write(entity, ENTITY_SEED[entity]));
      localStorage.setItem(KEYS.auth, '');
      localStorage.removeItem(KEYS.auth);
    },

    /** Site settings object (mutable copy). */
    getSettings() {
      return Object.assign({}, read('settings') || SETTINGS);
    },

    /** Save a settings patch. */
    saveSettings(patch) {
      const next = Object.assign(store.getSettings(), patch);
      write('settings', next);
      return next;
    }
  };

  /* ---------- Admin auth (demo-grade, localStorage only) ---------- */

  const DEMO_CREDENTIALS = { username: 'admin', password: 'dog123' };

  const auth = {
    DEMO_CREDENTIALS,
    login(username, password) {
      if (username === DEMO_CREDENTIALS.username && password === DEMO_CREDENTIALS.password) {
        localStorage.setItem(KEYS.auth, JSON.stringify({ user: username, at: new Date().toISOString() }));
        return true;
      }
      return false;
    },
    logout() {
      localStorage.removeItem(KEYS.auth);
    },
    session() {
      try {
        const raw = localStorage.getItem(KEYS.auth);
        return raw ? JSON.parse(raw) : null;
      } catch (e) {
        return null;
      }
    }
  };

  /* ---------- Lookup helpers ---------- */

  const lookup = {
    service(id) { return store.get('services', id); },
    doctor(id) { return store.get('doctors', id); },
    patient(id) { return store.get('patients', id); },
    customer(id) { return store.get('customers', id); },
    /** Owner name of a patient, for tables. */
    ownerName(patient) {
      const owner = patient && lookup.customer(patient.ownerId);
      return owner ? owner.name : '—';
    },
    /** Joined view of an appointment for tables/details. */
    appointmentView(apt) {
      return Object.assign({}, apt, {
        service: lookup.service(apt.serviceId),
        doctor: lookup.doctor(apt.doctorId),
        patient: lookup.patient(apt.patientId)
      });
    },
    record(id) { return store.get('records', id); },
    /** Medical records of one patient, newest first. */
    patientRecords(patientId) {
      return store.list('records')
        .filter((r) => r.patientId === patientId)
        .sort((a, b) => (a.date < b.date ? 1 : -1));
    },
    /** All appointments of one patient. */
    patientAppointments(patientId) {
      return store.list('appointments').filter((a) => a.patientId === patientId);
    },
    /** Customer (owner) record of a patient. */
    patientOwner(patientId) {
      const p = lookup.patient(patientId);
      return p ? lookup.customer(p.ownerId) : null;
    }
  };

  window.DH.store = store;
  window.DH.auth = auth;
  window.DH.lookup = lookup;
})();
