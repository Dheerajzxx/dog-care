/* ============================================================
   DOG HOSPITAL — UI HELPERS
   Formatting, toasts, modals, validation, shared layout
   (public header/footer + admin shell). Depends on data.js.
   ============================================================ */

window.DH = window.DH || {};

(function () {
  'use strict';

  const ui = {};

  /* ---------- Formatting ---------- */

  ui.money = function (n) {
    return '$' + Number(n || 0).toFixed(2).replace(/\.00$/, '');
  };

  ui.formatDate = function (iso) {
    if (!iso) return '—';
    const d = new Date(iso + (iso.length === 10 ? 'T12:00:00' : ''));
    if (isNaN(d)) return iso;
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  ui.formatTime = function (hhmm) {
    if (!hhmm) return '—';
    const [h, m] = hhmm.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hr = h % 12 === 0 ? 12 : h % 12;
    return hr + ':' + String(m).padStart(2, '0') + ' ' + ampm;
  };

  ui.initials = function (name) {
    return (name || '?')
      .split(/\s+/)
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const STATUS_BADGE = {
    pending: 'badge-warning',
    confirmed: 'badge-info',
    completed: 'badge-success',
    cancelled: 'badge-danger',
    active: 'badge-success',
    inactive: 'badge-neutral'
  };

  ui.statusBadge = function (status) {
    const cls = STATUS_BADGE[status] || 'badge-neutral';
    const label = status ? status.charAt(0).toUpperCase() + status.slice(1) : '—';
    return '<span class="badge ' + cls + '">' + label + '</span>';
  };

  ui.escape = function (s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  };

  /* ---------- Toasts ---------- */

  ui.toast = function (message, type) {
    type = type || 'success';
    let stack = document.querySelector('.toast-stack');
    if (!stack) {
      stack = document.createElement('div');
      stack.className = 'toast-stack';
      document.body.appendChild(stack);
    }
    const t = document.createElement('div');
    t.className = 'toast toast-' + type;
    const icons = { success: '✅', error: '⚠️', warning: '🔔', info: 'ℹ️' };
    t.innerHTML = '<span>' + (icons[type] || '') + '</span><span>' + ui.escape(message) + '</span>';
    stack.appendChild(t);
    setTimeout(function () {
      t.classList.add('hide');
      setTimeout(function () { t.remove(); }, 350);
    }, 3200);
  };

  /* ---------- Modals ---------- */

  ui.openModal = function (id) {
    const m = document.getElementById(id);
    if (!m) return;
    m.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  ui.closeModal = function (id) {
    const m = id ? document.getElementById(id) : document.querySelector('.modal-overlay.open');
    if (!m) return;
    m.classList.remove('open');
    document.body.style.overflow = '';
  };

  ui.initModals = function (root) {
    (root || document).addEventListener('click', function (e) {
      const openTrigger = e.target.closest('[data-open-modal]');
      if (openTrigger) {
        e.preventDefault();
        ui.openModal(openTrigger.getAttribute('data-open-modal'));
        return;
      }
      const closer = e.target.closest('[data-close-modal]');
      if (closer) {
        ui.closeModal(closer.closest('.modal-overlay').id);
        return;
      }
      if (e.target.classList && e.target.classList.contains('modal-overlay')) {
        ui.closeModal(e.target.id);
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') ui.closeModal();
    });
  };

  /** Promise-based confirmation dialog. Resolves true/false. */
  ui.confirm = function (opts) {
    opts = opts || {};
    return new Promise(function (resolve) {
      let overlay = document.getElementById('dh-confirm');
      if (overlay) overlay.remove();

      overlay = document.createElement('div');
      overlay.className = 'modal-overlay open';
      overlay.id = 'dh-confirm';
      overlay.innerHTML =
        '<div class="modal" style="max-width:420px">' +
        '  <div class="modal-header"><h3>' + ui.escape(opts.title || 'Are you sure?') + '</h3></div>' +
        '  <div class="modal-body"><p class="text-muted">' + ui.escape(opts.message || 'This action cannot be undone.') + '</p></div>' +
        '  <div class="modal-footer">' +
        '    <button class="btn btn-ghost" data-act="no">Cancel</button>' +
        '    <button class="btn ' + (opts.danger === false ? 'btn-primary' : 'btn-danger') + '" data-act="yes">' + ui.escape(opts.confirmText || 'Confirm') + '</button>' +
        '  </div>' +
        '</div>';
      document.body.appendChild(overlay);
      document.body.style.overflow = 'hidden';

      function done(val) {
        overlay.remove();
        document.body.style.overflow = '';
        resolve(val);
      }
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) return done(false);
        const act = e.target.closest('[data-act]');
        if (act) done(act.getAttribute('data-act') === 'yes');
      });
    });
  };

  /* ---------- Form validation ----------
     Marks fields with .invalid and shows .field-error siblings.
     Rules via data-validate: required | email | phone | number
     Returns true when valid. */

  const VALIDATORS = {
    required: function (v) { return v.trim() !== ''; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); },
    phone: function (v) { return /^[\d\s()+-]{7,}$/.test(v); },
    number: function (v) { return v.trim() !== '' && !isNaN(Number(v)); }
  };

  ui.validateForm = function (form) {
    let ok = true;
    form.querySelectorAll('[data-validate]').forEach(function (field) {
      const rules = field.getAttribute('data-validate').split(/\s+/);
      let valid = true;
      for (const rule of rules) {
        const fn = VALIDATORS[rule];
        if (fn && !fn(field.value)) { valid = false; break; }
      }
      field.classList.toggle('invalid', !valid);
      const err = field.closest('.form-group') && field.closest('.form-group').querySelector('.field-error');
      if (err) err.classList.toggle('show', !valid);
      if (!valid) ok = false;
    });
    return ok;
  };

  /* ---------- Shared layout: public header & footer ---------- */

  /** Absolute path to the deployed site root (e.g. "/dog-care", or ""
      when served from the domain root). Derived from the page's own path
      so links resolve correctly with or without a trailing slash, from a
      subpath like GitHub Pages, from the domain root, or from a local file. */
  function rootPrefix() {
    const path = location.pathname;
    // Inside /public, /admin or /assets → the site root is everything before it.
    const m = path.match(/^(.*?)\/(?:public|admin|assets)(?=\/|$)/);
    if (m) return m[1] || '';

    // Home page: the site root is the directory this page lives in.
    if (path === '/' || path === '') return '';
    const last = path.split('/').filter(Boolean).pop() || '';
    if (last.indexOf('.') > -1) {
      // Looks like a page (e.g. "/index.html") → root is its directory.
      return path.replace(/\/[^/]*$/, '');
    }
    // Bare directory with or without trailing slash ("/dog-care" / "/dog-care/").
    return path.replace(/\/$/, '');
  }

  ui.renderHeader = function () {
    const p = rootPrefix();
    const page = (location.pathname.split('/').pop() || 'index.html').replace('.html', '');
    const links = [
      { key: 'index', href: p + '/index.html', label: 'Home' },
      { key: 'about', href: p + '/public/about.html', label: 'About' },
      { key: 'services', href: p + '/public/services.html', label: 'Services' },
      { key: 'doctors', href: p + '/public/doctors.html', label: 'Doctors' },
      { key: 'contact', href: p + '/public/contact.html', label: 'Contact' }
    ];
    const header = document.createElement('header');
    header.className = 'site-header';
    header.innerHTML =
      '<div class="container nav-inner">' +
      '  <a class="brand" href="' + p + '/index.html"><span class="logo">🐾</span> PawCare Hospital</a>' +
      '  <nav class="nav-links" id="nav-links">' +
      links.map(function (l) {
        return '<a href="' + l.href + '" class="' + (page === l.key ? 'active' : '') + '">' + l.label + '</a>';
      }).join('') +
      '    <a href="' + p + '/public/emergency.html" class="btn btn-danger btn-sm" style="color: #fff;">🚨 Emergency</a>' +
      '    <a href="' + p + '/public/booking.html" class="btn btn-accent btn-sm" style="color: #fff;">Book Appointment</a>' +
      '  </nav>' +
      '  <button class="nav-toggle" id="nav-toggle" aria-label="Toggle menu" aria-expanded="false" aria-controls="nav-links">☰</button>' +
      '</div>';
    document.body.prepend(header);

    // Visible on mobile behind the drawer panel
    document.querySelector('.site-header').insertAdjacentHTML('beforeend',
      '<span class="nav-backdrop" id="nav-backdrop-static"></span>');

    // Wire up the mobile nav drawer
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');

    // Backdrop is the static <span> inside the header (position:fixed,
    // so DOM location doesn't matter)
    const backdrop = document.getElementById('nav-backdrop-static');

    function setNav(open) {
      navLinks.classList.toggle('open', open);
      backdrop.classList.toggle('show', open);
      document.body.classList.toggle('nav-locked', open);
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.textContent = open ? '✕' : '☰';
      if (open) {
        const first = navLinks.querySelector('a');
        if (first) first.focus();          // keyboard users land in the drawer
      } else if (document.activeElement && navLinks.contains(document.activeElement)) {
        navToggle.focus();                 // return focus to the trigger
      }
    }

    navToggle.addEventListener('click', function () {
      setNav(!navLinks.classList.contains('open'));
    });
    backdrop.addEventListener('click', function () { setNav(false); });
    navLinks.addEventListener('click', function (e) {
      if (e.target.closest('a')) setNav(false); // close after choosing a page
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setNav(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) setNav(false);
    });

    // Same gesture polish as the admin drawer: swipe-to-close on the panel,
    // edge-swipe-to-open from the right edge (drawer slides from the right)
    ui.addDrawerGestures(navLinks, {
      side: 'right',
      isOpen: function () { return navLinks.classList.contains('open'); },
      open: function () { setNav(true); },
      close: function () { setNav(false); }
    });
  };

  ui.renderFooter = function () {
    const p = rootPrefix();
    const footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.innerHTML =
      '<div class="container footer-inner">' +
      '  <div>' +
      '    <div class="footer-brand"><span class="logo">🐾</span> PawCare Hospital</div>' +
      '    <p style="font-size:0.9rem; max-width:280px;">Compassionate, around-the-clock care for the dogs you love.</p>' +
      '  </div>' +
      '  <div><h4>Care</h4>' +
      '    <a href="' + p + '/public/services.html">Services</a>' +
      '    <a href="' + p + '/public/doctors.html">Our Doctors</a>' +
      '    <a href="' + p + '/public/booking.html">Book Appointment</a>' +
      '  </div>' +
      '  <div><h4>Hospital</h4>' +
      '    <a href="' + p + '/public/about.html">About Us</a>' +
      '    <a href="' + p + '/public/contact.html">Contact</a>' +
      '    <a href="' + p + '/admin/login.html">Staff Login</a>' +
      '  </div>' +
      '  <div><h4>Emergency</h4>' +
      '    <p style="font-size:0.9rem;">24/7 Hotline<br><strong style="color:#fff; font-size:1.1rem;">(555) 910-0123</strong></p>' +
      '  </div>' +
      '</div>' +
      '<div class="footer-bottom">© 2026 PawCare Dog Hospital. All rights reserved.</div>';
    document.body.appendChild(footer);
  };

  /** Convenience for public pages: header + footer + modal wiring. */
  ui.initPublicPage = function () {
    ui.renderHeader();
    ui.renderFooter();
    ui.initModals();
  };

  /* ---------- Admin layout ---------- */

  const ADMIN_NAV = [
    { key: 'dashboard', icon: '📊', label: 'Dashboard', href: 'dashboard.html' },
    { key: 'appointments', icon: '📅', label: 'Appointments', href: 'appointments.html' },
    { key: 'patients', icon: '🐕', label: 'Patients', href: 'patients.html' },
    { key: 'doctors', icon: '🩺', label: 'Doctors', href: 'doctors.html' },
    { key: 'customers', icon: '🧑', label: 'Customers', href: 'customers.html' },
    { key: 'services', icon: '🏷️', label: 'Services', href: 'services.html' },
    { key: 'settings', icon: '⚙️', label: 'Settings', href: 'settings.html' }
  ];

  /** Auth guard: redirect to login when no session. Call on admin pages. */
  ui.requireAuth = function () {
    if (!window.DH.auth || !DH.auth.session()) {
      location.replace('login.html');
    }
  };

  /**
   * Build the admin shell (sidebar + topbar) and wrap #admin-content.
   * @param {string} activeKey - one of ADMIN_NAV keys
   * @param {string} pageTitle - shown in the topbar
   */
  /** Mobile admin drawer: open/close sidebar + backdrop + scroll lock. */
  ui.toggleAdminSidebar = function (force) {
    const sidebar = document.getElementById('admin-sidebar');
    if (!sidebar) return;
    const backdrop = document.getElementById('sidebar-backdrop');
    const open = typeof force === 'boolean' ? force : !sidebar.classList.contains('open');
    sidebar.classList.toggle('open', open);
    if (backdrop) backdrop.classList.toggle('show', open);
    document.body.classList.toggle('nav-locked', open);
  };

  ui.renderAdminShell = function (activeKey, pageTitle) {
    const body = document.body;
    body.classList.add('admin-page');

    // Capture everything currently in the body: the content div,
    // plus modals/templates that must survive the shell rebuild.
    const previous = Array.prototype.slice.call(body.children);
    const contentSrc = previous.find(function (el) { return el.id === 'admin-content'; });

    const sidebar = document.createElement('aside');
    sidebar.className = 'admin-sidebar';
    sidebar.id = 'admin-sidebar';
    sidebar.innerHTML =
      '<div class="side-brand"><span style="font-size:1.4rem">🐾</span> PawCare Admin</div>' +
      '<nav class="side-nav">' +
      '<div class="nav-label">Overview</div>' +
      ADMIN_NAV.slice(0, 2).map(navLink).join('') +
      '<div class="nav-label">Management</div>' +
      ADMIN_NAV.slice(2).map(navLink).join('') +
      '</nav>';

    const main = document.createElement('div');
    main.className = 'admin-main';
    main.innerHTML =
      '<div class="admin-topbar">' +
      '  <div style="display:flex;align-items:center;gap:12px">' +
      '    <button class="admin-menu-toggle" id="admin-menu-toggle" aria-label="Toggle sidebar">☰</button>' +
      '    <h2>' + ui.escape(pageTitle) + '</h2>' +
      '  </div>' +
      '  <div class="top-actions">' +
      '    <span class="badge badge-primary">admin</span>' +
      '    <button class="btn btn-ghost btn-sm" id="admin-logout">Log out</button>' +
      '  </div>' +
      '</div>' +
      '<div class="admin-content" id="admin-content"></div>';

    body.innerHTML = '';
    body.appendChild(sidebar);
    body.appendChild(main);

    const contentEl = document.getElementById('admin-content');

    // Restore non-content nodes (modals, templates, scripts) after the content
    previous.forEach(function (el) {
      if (el === contentSrc) return;
      contentEl.insertAdjacentElement('afterend', el);
    });

    // Copy page content into the shell's content area
    if (contentSrc) contentEl.innerHTML = contentSrc.innerHTML;

    function navLink(item) {
      return '<a href="' + item.href + '" class="' + (item.key === activeKey ? 'active' : '') + '">' +
        '<span>' + item.icon + '</span>' + item.label + '</a>';
    }

    document.getElementById('admin-menu-toggle').addEventListener('click', function () {
      ui.toggleAdminSidebar();
    });

    // Mobile drawer: dark backdrop, click to close
    const backdrop = document.createElement('div');
    backdrop.className = 'sidebar-backdrop';
    backdrop.id = 'sidebar-backdrop';
    document.body.appendChild(backdrop);
    backdrop.addEventListener('click', function () {
      ui.toggleAdminSidebar(false);
    });

    // Escape closes the drawer
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') ui.toggleAdminSidebar(false);
    });

    // Crossing back to desktop always resets the drawer
    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) ui.toggleAdminSidebar(false);
    });

    // Touch gestures: swipe-to-close on the panel, edge-swipe-to-open
    ui.addDrawerGestures(sidebar, {
      isOpen: function () { return sidebar.classList.contains('open'); },
      open: function () { ui.toggleAdminSidebar(true); },
      close: function () { ui.toggleAdminSidebar(false); }
    });

    const logoutBtn = document.getElementById('admin-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function () {
        DH.auth.logout();
        location.href = 'login.html';
      });
    }
  };

  /* ---------- Mobile drawer gestures ----------
     Finger-following swipe-to-close on the panel + edge-swipe-to-open.
     Only active ≤860px. Skips swipes that start inside scrollable
     content so vertical scrolling still works naturally. */
  ui.addDrawerGestures = function (panel, handlers) {
    if (!panel || !handlers) return;

    const side = handlers.side === 'right' ? 'right' : 'left';
    const EDGE = 24;          // px from the drawer's edge that opens it
    const THRESHOLD = 0.35;   // release flips state past 35% of width
    const VELOCITY = 0.5;     // px/ms — flick flips even before threshold

    let tracking = false, axis = null, startX = 0, startY = 0;
    let startTime = 0, baseOffset = 0, currentX = 0, panelWidth = 0;

    function mobile() { return window.innerWidth <= 860; }

    function setTranslate(x) {
      panel.classList.add('dragging');
      panel.style.transform = 'translateX(' + x + 'px)';
    }

    function clearTranslate() {
      panel.classList.remove('dragging');
      panel.style.transform = '';
    }

    function onTouchStart(e) {
      if (!mobile() || e.touches.length !== 1) return;
      const t = e.touches[0];
      const open = handlers.isOpen();

      let inPanel = false;
      try { inPanel = panel.contains(e.target); } catch (err) { /* old browsers */ }
      if (open && !inPanel) return;               // only panel swipes close
      if (!open) {
        const fromEdge = side === 'left'
          ? t.clientX <= EDGE
          : t.clientX >= window.innerWidth - EDGE;
        if (!fromEdge) return;                    // only edge swipes open
      }

      // Let vertical scrollers inside the panel win
      let node = e.target;
      while (node && node !== panel) {
        if (node.nodeType === 1) {
          const oy = getComputedStyle(node).overflowY;
          if ((oy === 'auto' || oy === 'scroll') && node.scrollHeight > node.clientHeight) return;
        }
        node = node.parentNode;
      }

      tracking = true; axis = null;
      startX = t.clientX; startY = t.clientY; startTime = Date.now();
      currentX = open ? 0 : (side === 'left' ? -panel.offsetWidth : panel.offsetWidth);
      baseOffset = currentX;
      panelWidth = panel.offsetWidth || 240;
    }

    function onTouchMove(e) {
      if (!tracking) return;
      const t = e.touches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;

      if (!axis) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
        axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
        if (axis === 'y') { tracking = false; clearTranslate(); return; }
      }
      if (axis !== 'x') return;

      e.preventDefault(); // horizontal drag: stop the page scrolling
      const raw = baseOffset + dx;
      // clamp between open (0) and closed (±W): left [-W,0], right [0,W]
      currentX = side === 'left'
        ? Math.min(0, Math.max(-panelWidth, raw))
        : Math.max(0, Math.min(panelWidth, raw));
      setTranslate(currentX);
    }

    function onTouchEnd() {
      if (!tracking) return;
      tracking = false;
      const dt = Math.max(1, Date.now() - startTime);
      const vel = (currentX - baseOffset) / dt;          // px/ms along x
      const opening = side === 'left' ? vel : -vel;      // positive = toward open
      const travelled = Math.abs(currentX) / panelWidth; // 0 = open .. 1 = closed
      const shouldOpen = (baseOffset !== 0)
        ? (1 - travelled) > THRESHOLD || opening > VELOCITY
        : travelled < THRESHOLD || opening > VELOCITY;
      clearTranslate();                                // CSS transition takes over
      if (shouldOpen) handlers.open(); else handlers.close();
      axis = null;
    }

    // Listeners live on `document`, not the panel: an edge swipe starts on
    // the page body (which never bubbles through the off-canvas panel), and
    // once a drag starts the finger can move anywhere. The guards inside
    // onTouchStart ensure only relevant gestures begin tracking.
    document.addEventListener('touchstart', onTouchStart, { passive: true });
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEnd);
    document.addEventListener('touchcancel', onTouchEnd);
  };

  ui.siteRoot = rootPrefix;

  window.DH.ui = ui;
})();
