// "What they say" section — student feedback pulled LIVE from a Google Sheet
// published to the web as CSV (File → Share → Publish to web → choose CSV).
//
// The fetch to Google Sheets can take a second or two, so the last successful
// result is cached in localStorage: on the next visit the cards render
// instantly (still re-shuffled to 8 random), while a fresh copy is fetched
// quietly in the background for next time.
var FEEDBACK_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSd3OwuLaCZr8B6KWEHtbJbeElhpoKUWgju-2GROGS-1Pfjipm2PjiGmPOQII9EXg0Bjloezg_RxhTh/pub?gid=442951614&single=true&output=csv';

var FEEDBACK_COUNT = 8;
var FEEDBACK_CACHE_KEY = 'feedback_cache_v1';

(function () {
    var grid = document.getElementById('feedback-grid');
    if (!grid) return;

    // shared modal (reuses .project-modal styles) for full-length feedback
    (function wireModal() {
        var overlay = document.querySelector('[data-feedback-modal-overlay]');
        var closeBtn = document.querySelector('[data-feedback-modal-close]');
        if (!overlay || !closeBtn) return;
        closeBtn.addEventListener('click', function () { overlay.hidden = true; });
        overlay.addEventListener('click', function (e) { if (e.target === overlay) overlay.hidden = true; });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') overlay.hidden = true; });
    })();

    // --- CSV parser: handles commas & newlines inside quoted text ---
    function parseCSV(text) {
        var rows = [];
        var row = [];
        var field = '';
        var inQuotes = false;

        for (var i = 0; i < text.length; i++) {
            var c = text[i];

            if (inQuotes) {
                if (c === '"') {
                    if (text[i + 1] === '"') { field += '"'; i++; }
                    else { inQuotes = false; }
                } else {
                    field += c;
                }
            } else if (c === '"') {
                inQuotes = true;
            } else if (c === ',') {
                row.push(field); field = '';
            } else if (c === '\n') {
                row.push(field); rows.push(row); row = []; field = '';
            } else if (c !== '\r') {
                field += c;
            }
        }
        if (field !== '' || row.length) { row.push(field); rows.push(row); }
        return rows;
    }

    function shuffle(arr) {
        var a = arr.slice();
        for (var i = a.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var t = a[i]; a[i] = a[j]; a[j] = t;
        }
        return a;
    }

    function escapeHtml(s) {
        return s.replace(/[&<>"']/g, function (ch) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
        });
    }

    function showState(msg) {
        grid.innerHTML = '<p class="feedback-state">' + escapeHtml(msg) + '</p>';
    }

    var TRUNCATE_AT = 100;

    function openFeedbackModal(fullText) {
        var overlay = document.querySelector('[data-feedback-modal-overlay]');
        var body = document.querySelector('[data-feedback-modal-body]');
        if (!overlay || !body) return;
        body.innerHTML = '';
        var p = document.createElement('p');
        p.style.cssText = 'color:#d1d5db;line-height:1.7;';
        p.textContent = fullText;
        body.appendChild(p);
        overlay.hidden = false;
    }

    function render(list) {
        grid.innerHTML = '';
        shuffle(list).slice(0, FEEDBACK_COUNT).forEach(function (text) {
            var isLong = text.length > TRUNCATE_AT;
            var shown = isLong ? text.slice(0, TRUNCATE_AT).trim() + '…' : text;

            var card = document.createElement('figure');
            card.className = 'feedback-card' + (isLong ? ' feedback-card-clickable' : '');
            var rot = (Math.random() * 4 - 2).toFixed(2); // -2deg .. 2deg
            card.style.transform = 'rotate(' + rot + 'deg)';
            card.innerHTML =
                '<span class="feedback-quote" aria-hidden="true">“</span>' +
                '<blockquote>' + escapeHtml(shown) + '</blockquote>' +
                (isLong ? '<span class="feedback-more">Read full</span>' : '');

            if (isLong) {
                card.setAttribute('role', 'button');
                card.setAttribute('tabindex', '0');
                card.addEventListener('click', function () { openFeedbackModal(text); });
                card.addEventListener('keydown', function (e) {
                    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openFeedbackModal(text); }
                });
            }
            grid.appendChild(card);
        });
    }

    function readCache() {
        try {
            var raw = localStorage.getItem(FEEDBACK_CACHE_KEY);
            if (!raw) return null;
            var parsed = JSON.parse(raw);
            return (parsed && parsed.items && parsed.items.length) ? parsed.items : null;
        } catch (e) { return null; }
    }

    function writeCache(items) {
        try {
            localStorage.setItem(FEEDBACK_CACHE_KEY, JSON.stringify({ t: Date.now(), items: items }));
        } catch (e) { /* private mode / quota — ignore */ }
    }

    function parseItems(csv) {
        // assume 1 column = feedback text; drop the header row + empty rows
        return parseCSV(csv)
            .slice(1)
            .map(function (r) { return (r[0] || '').trim(); })
            .filter(function (v) { return v.length > 0; });
    }

    var cached = readCache();
    if (cached) {
        render(cached);            // instant
    } else {
        showState('Loading…');
    }

    fetch(FEEDBACK_CSV_URL)
        .then(function (res) {
            if (!res.ok) throw new Error('HTTP ' + res.status);
            return res.text();
        })
        .then(function (csv) {
            var items = parseItems(csv);
            if (!items.length) throw new Error('empty');
            writeCache(items);
            if (!cached) render(items);   // only paint if nothing was shown yet
        })
        .catch(function () {
            if (!cached) showState('Feedback can’t be loaded right now. Please check back later.');
        });
})();
