// Lanyard card — lightweight 2D physics (single point mass on a springy cord).
// Pendulum swing + spring stretch + damping → it really swings and eases back.
// The rAF loop runs ONLY while dragging or still settling, then stops itself.
document.addEventListener('DOMContentLoaded', () => {
    const wrap = document.querySelector('[data-lanyard-wrap]');
    const card = document.querySelector('[data-lanyard-card]');
    const string = document.querySelector('[data-lanyard-string]');
    if (!wrap || !card || !string) return;

    const REST = 100;         // natural hang length (px)
    const MAX = 190;          // furthest the card can be pulled from the anchor
    const GRAVITY = 2200;     // px/s^2
    const STIFFNESS = 420;    // cord spring pulling the card back (higher = stiffer strap)
    const DAMPING = 2.2;      // velocity damping (higher = settles faster)
    const sag = GRAVITY / STIFFNESS;
    const springRest = REST - sag;   // so it hangs at exactly REST under gravity

    // card-centre position measured from the anchor, y pointing down
    let cx = 0, cy = REST, vx = 0, vy = 0;
    let targetX = 0, targetY = REST;
    let dragging = false;
    let raf = null;
    let last = 0;

    function render() {
        const d = Math.hypot(cx, cy) || 0.001;
        const swing = Math.atan2(cy, cx) - Math.PI / 2;   // 0 at rest, +/- when off to a side
        string.style.height = d.toFixed(1) + 'px';
        string.style.transform = 'rotate(' + swing.toFixed(4) + 'rad)';
        card.style.transform =
            'translate(calc(-50% + ' + cx.toFixed(1) + 'px), ' + cy.toFixed(1) + 'px) ' +
            'rotate(' + (swing * 0.6).toFixed(4) + 'rad)';
    }

    function step(now) {
        let dt = (now - last) / 1000;
        last = now;
        if (!(dt > 0)) dt = 0.016;
        if (dt > 1 / 30) dt = 1 / 30;

        if (dragging) {
            const inv = 1 / dt;
            vx = 0.6 * vx + 0.4 * (targetX - cx) * inv;
            vy = 0.6 * vy + 0.4 * (targetY - cy) * inv;
            cx = targetX;
            cy = targetY;
        } else {
            const sub = 3;
            const h = dt / sub;
            for (let i = 0; i < sub; i++) {
                const d = Math.hypot(cx, cy) || 0.001;
                const stretch = d - springRest;
                const ax = -(cx / d) * STIFFNESS * stretch;
                const ay = -(cy / d) * STIFFNESS * stretch + GRAVITY;
                vx += ax * h;
                vy += ay * h;
                const damp = Math.max(0, 1 - DAMPING * h);
                vx *= damp;
                vy *= damp;
                cx += vx * h;
                cy += vy * h;
            }
        }

        render();

        if (!dragging && Math.hypot(cx, cy - REST) < 0.4 && Math.hypot(vx, vy) < 3) {
            cx = 0; cy = REST; vx = 0; vy = 0;
            render();
            raf = null;
            return;
        }
        raf = requestAnimationFrame(step);
    }

    function start() {
        if (raf) return;
        last = performance.now();
        raf = requestAnimationFrame(step);
    }

    function pointerToTarget(e) {
        const r = wrap.getBoundingClientRect();
        let dx = e.clientX - r.left;
        let dy = e.clientY - r.top;
        const d = Math.hypot(dx, dy);
        if (d > MAX) { dx = dx / d * MAX; dy = dy / d * MAX; }
        targetX = dx;
        targetY = dy;
    }

    card.addEventListener('pointerdown', (e) => {
        dragging = true;
        try { card.setPointerCapture(e.pointerId); } catch (_) {}
        pointerToTarget(e);
        start();
    });

    card.addEventListener('pointermove', (e) => {
        if (dragging) pointerToTarget(e);
    });

    function release() {
        if (!dragging) return;
        dragging = false;
        start();
    }
    card.addEventListener('pointerup', release);
    card.addEventListener('pointercancel', release);

    render();

    // gentle intro sway shortly after load (skipped if the user prefers less motion)
    const calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!calm) {
        setTimeout(() => {
            if (!dragging && !raf) { vx = 210; start(); }
        }, 650);
    }
});
