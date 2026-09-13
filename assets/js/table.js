/* ============================================================
   DOG HOSPITAL — ADMIN TABLE HELPERS
   Reusable table rendering: columns, search, filters,
   sorting, pagination, empty states, row actions.
   ============================================================ */

window.DH = window.DH || {};

(function () {
  'use strict';

  const tables = {};

  /**
   * Build a paginated, searchable table.
   *
   * @param {Object} cfg
   * @param {string}   cfg.mount      - element id for .table-wrap
   * @param {Array}    cfg.data       - row objects
   * @param {Array}    cfg.columns    - [{ header, render(row), sortValue?(row), className? }]
   * @param {number}  [cfg.pageSize]  - rows per page (default 8)
   * @param {string} [cfg.emptyText]  - message when no rows
   * @param {Function}[cfg.getFiltered]- override filter logic; returns rows to show
   * @param {Function}[cfg.onBind]     - (wrapEl) called after each render
   * @returns {{ setData, refresh, getFilteredData }}
   */
  tables.renderTable = function (cfg) {
    let data = cfg.data || [];
    let page = 1;
    const pageSize = cfg.pageSize || 8;
    let sortKey = null, sortDir = 1;

    const mount = document.getElementById(cfg.mount);
    if (!mount) throw new Error('table mount not found: ' + cfg.mount);

    function getRows() {
      if (cfg.getFiltered) return cfg.getFiltered(data);
      return data;
    }

    function render() {
      const rows = getRows();
      const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
      if (page > totalPages) page = totalPages;

      const slice = rows.slice((page - 1) * pageSize, page * pageSize);

      const headHtml = '<thead><tr>' + cfg.columns.map((c) => {
        const sortable = !!c.sortValue;
        const arrow = sortKey === c.header ? (sortDir === 1 ? ' ▲' : ' ▼') : '';
        return '<th ' + (sortable ? 'class="sortable" data-sort="' + c.header + '"' : '') + '>' +
          c.header + arrow + '</th>';
      }).join('') + '</tr></thead>';

      const bodyHtml = slice.length
        ? '<tbody>' + slice.map((row) =>
            '<tr>' + cfg.columns.map((c) =>
              '<td ' + (c.className ? 'class="' + c.className + '"' : '') + '>' + c.render(row) + '</td>'
            ).join('') + '</tr>'
          ).join('') + '</tbody>'
        : '<tbody><tr><td colspan="' + cfg.columns.length + '">' +
          '<div class="empty-state"><div class="icon">🐾</div><h3>' + (cfg.emptyText || 'Nothing here yet') + '</h3>' +
          '<p>Try changing the filters or search terms.</p></div></td></tr></tbody>';

      mount.innerHTML =
        '<table class="table">' + headHtml + bodyHtml + '</table>' +
        '<div class="pagination">' +
        '<span>' + rows.length + ' record' + (rows.length === 1 ? '' : 's') + '</span>' +
        '<div class="spacer" style="flex:1"></div>' +
        '<button class="page-btn" data-pg="prev" ' + (page === 1 ? 'disabled' : '') + '>‹</button>' +
        '<span>Page ' + page + ' / ' + totalPages + '</span>' +
        '<button class="page-btn" data-pg="next" ' + (page === totalPages ? 'disabled' : '') + '>›</button>' +
        '</div>';

      // Wire sorting
      mount.querySelectorAll('th.sortable').forEach((th) => {
        th.addEventListener('click', function () {
          const key = this.getAttribute('data-sort');
          if (sortKey === key) sortDir = -sortDir; else { sortKey = key; sortDir = 1; }
          const col = cfg.columns.find((c) => c.header === key);
          rows.sort((a, b) => {
            const va = col.sortValue(a), vb = col.sortValue(b);
            if (va < vb) return -1 * sortDir;
            if (va > vb) return 1 * sortDir;
            return 0;
          });
          render();
        });
      });

      // Wire pagination
      mount.querySelectorAll('.page-btn').forEach((btn) => {
        btn.addEventListener('click', function () {
          const act = this.getAttribute('data-pg');
          if (act === 'prev' && page > 1) page--;
          if (act === 'next' && page < totalPages) page++;
          render();
        });
      });

      if (cfg.onBind) cfg.onBind(mount);
    }

    render();

    return {
      setData(next) { data = next || []; page = 1; render(); },
      refresh: render,
      getFilteredData: getRows
    };
  };

  /** Wire search + filter selects to a table's getFiltered callback. */
  tables.bindFilters = function (table, inputs) {
    inputs.forEach((el) => {
      const evt = el.tagName === 'SELECT' ? 'change' : 'input';
      el.addEventListener(evt, () => { table.refresh(); });
    });
  };

  /** Read standard filter values by id (search, status, date, doctor). */
  tables.readFilters = function () {
    const val = (id) => {
      const el = document.getElementById(id);
      return el ? el.value.trim() : '';
    };
    return {
      search: val('flt-search').toLowerCase(),
      status: val('flt-status'),
      date: val('flt-date'),
      doctor: val('flt-doctor')
    };
  };

  window.DH.tables = tables;
})();
