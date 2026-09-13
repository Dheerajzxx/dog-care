/* ============================================================
   DOG HOSPITAL — PUBLIC SITE RENDERERS
   Shared dynamic renderers for public pages.
   ============================================================ */

window.DH = window.DH || {};

(function () {
  'use strict';

  const ui = DH.ui;

  const SERVICE_ICONS = {
    Wellness: '💉',
    Surgery: '🔬',
    Dental: '🦷',
    Grooming: '🛁',
    Emergency: '🚨',
    Diagnostics: '📡'
  };

  const publicApi = {
    icons: SERVICE_ICONS,

    /** Service cards into a grid element. Optionally filter by category. */
    renderServices(gridEl, category) {
      if (!gridEl) return;
      const services = DH.store
        .list('services')
        .filter((s) => s.active)
        .filter((s) => !category || category === 'All' || s.category === category);

      if (!services.length) {
        gridEl.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><div class="icon">🔍</div><h3>No services found</h3><p>Try another category.</p></div>';
        return;
      }
      gridEl.innerHTML = services
        .map(
          (s) =>
            '<div class="card card-pad card-hover service-card">' +
            '  <div class="icon-bubble">' + (SERVICE_ICONS[s.category] || '🐾') + '</div>' +
            '  <h3>' + ui.escape(s.name) + '</h3>' +
            '  <p class="text-muted" style="font-size:0.92rem">' + ui.escape(s.description) + '</p>' +
            '  <div class="meta">' + ui.escape(s.category) + ' · ' + s.duration + ' min</div>' +
            '  <div class="mt-4" style="display:flex;justify-content:space-between;align-items:center">' +
            '    <span class="price-tag">' + ui.money(s.price) + '</span>' +
            '    <a class="btn btn-outline btn-sm" href="' + publicApi.root + '/public/booking.html?service=' + s.id + '">Book</a>' +
            '  </div>' +
            '</div>'
        )
        .join('');
    },

    /** Wire a filter bar of chips to a services grid. */
    initServiceFilter(barEl, gridEl) {
      if (!barEl || !gridEl) return;
      const categories = ['All'].concat(
        Array.from(new Set(DH.store.list('services').filter((s) => s.active).map((s) => s.category)))
      );
      barEl.innerHTML = categories
        .map((c, i) => '<button class="chip' + (i === 0 ? ' active' : '') + '" data-cat="' + c + '">' + c + '</button>')
        .join('');
      barEl.addEventListener('click', function (e) {
        const chip = e.target.closest('.chip');
        if (!chip) return;
        barEl.querySelectorAll('.chip').forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        publicApi.renderServices(gridEl, chip.getAttribute('data-cat'));
      });
      publicApi.renderServices(gridEl, 'All');
    },

    /** Doctor cards into a grid element. */
    renderDoctors(gridEl, limit) {
      if (!gridEl) return;
      let doctors = DH.store.list('doctors').filter((d) => d.active);
      if (limit) doctors = doctors.slice(0, limit);
      gridEl.innerHTML = doctors
        .map(
          (d) =>
            '<div class="card card-hover doctor-card">' +
            '  <div class="doc-photo" style="background:' + (d.color || 'var(--c-primary)') + '">' + ui.initials(d.name) + '</div>' +
            '  <h3>' + ui.escape(d.name) + '</h3>' +
            '  <div class="doc-spec">' + ui.escape(d.specialty) + '</div>' +
            '  <p>' + ui.escape(d.bio) + '</p>' +
            '  <button class="btn btn-outline btn-sm" data-open-modal="doc-modal" data-doc="' + d.id + '">View profile</button>' +
            '</div>'
        )
        .join('');
    },

    /** Fill the doctor bio modal body for a given doctor id. */
    fillDoctorModal(id) {
      const d = DH.lookup.doctor(id);
      if (!d) return;
      document.getElementById('doc-modal-body').innerHTML =
        '<div style="display:flex;gap:16px;align-items:center;margin-bottom:16px">' +
        '  <div class="avatar avatar-lg" style="background:' + d.color + ';color:#fff">' + ui.initials(d.name) + '</div>' +
        '  <div><h3 style="margin-bottom:2px">' + ui.escape(d.name) + '</h3>' +
        '  <span class="doc-spec">' + ui.escape(d.specialty) + '</span></div>' +
        '</div>' +
        '<p class="text-muted">' + ui.escape(d.bio) + '</p>';
    },

    /** Appointment-taking stats band on home. */
    renderStatsBand(el) {
      if (!el) return;
      const s = DH.store.getSettings();
      el.innerHTML =
        '<div><div class="stat-big">15+</div><div class="stat-sub">Years of care</div></div>' +
        '<div><div class="stat-big">12k</div><div class="stat-sub">Happy patients</div></div>' +
        '<div><div class="stat-big">24/7</div><div class="stat-sub">Emergency line</div></div>' +
        '<div><div class="stat-big">' + DH.store.list('doctors').filter((d) => d.active).length + '</div><div class="stat-sub">Veterinarians</div></div>';
    }
  };

  window.DH.public = publicApi;
})();
