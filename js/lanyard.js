document.addEventListener('DOMContentLoaded', () => {
    const wrap = document.querySelector('[data-lanyard-wrap]');
    const card = document.querySelector('[data-lanyard-card]');
    const path = document.querySelector('[data-lanyard-path]');
    if (!wrap || !card || !path) return;

    const ANCHOR_X = 160; // .lanyard-svg sits at left:-160px, so the anchor is at SVG-space x=160
    const SEGMENTS = 8;
    const SEGMENT_LENGTH = 12;
    const GRAVITY = 0.5;
    const DAMPING = 0.98;
    const ITERATIONS = 8;
    const MAX_REACH = SEGMENTS * SEGMENT_LENGTH * 1.4;

    const points = [];
    for (let i = 0; i <= SEGMENTS; i++) {
        points.push({ x: 0, y: i * SEGMENT_LENGTH, oldX: 0, oldY: i * SEGMENT_LENGTH, pinned: i === 0 });
    }
    const lastIndex = points.length - 1;

    const INTRO_OFFSET = 30;
    points.forEach((p, i) => {
        if (p.pinned) return;
        const t = i / SEGMENTS;
        p.x = INTRO_OFFSET * t;
        p.oldX = p.x;
    });
    let dragging = false;
    let raf = null;

    function isFixed(i) {
        return points[i].pinned || (dragging && i === lastIndex);
    }

    function stepPhysics() {
        points.forEach((p, i) => {
            if (isFixed(i)) return;
            const vx = (p.x - p.oldX) * DAMPING;
            const vy = (p.y - p.oldY) * DAMPING;
            p.oldX = p.x;
            p.oldY = p.y;
            p.x += vx;
            p.y += vy + GRAVITY;
        });

        for (let iter = 0; iter < ITERATIONS; iter++) {
            for (let i = 0; i < lastIndex; i++) {
                const a = points[i], b = points[i + 1];
                const dx = b.x - a.x, dy = b.y - a.y;
                const dist = Math.sqrt(dx * dx + dy * dy) || 0.0001;
                const diff = (dist - SEGMENT_LENGTH) / dist;
                const offsetX = dx * 0.5 * diff;
                const offsetY = dy * 0.5 * diff;
                if (!isFixed(i)) { a.x += offsetX; a.y += offsetY; }
                if (!isFixed(i + 1)) { b.x -= offsetX; b.y -= offsetY; }
            }
        }
    }

    function buildPath() {
        let d = `M ${ANCHOR_X + points[0].x} ${points[0].y}`;
        for (let i = 1; i < lastIndex; i++) {
            const midX = ANCHOR_X + (points[i].x + points[i + 1].x) / 2;
            const midY = (points[i].y + points[i + 1].y) / 2;
            d += ` Q ${ANCHOR_X + points[i].x} ${points[i].y} ${midX} ${midY}`;
        }
        const last = points[lastIndex];
        d += ` L ${ANCHOR_X + last.x} ${last.y}`;
        return d;
    }

    function render() {
        path.setAttribute('d', buildPath());
        const last = points[lastIndex];
        card.style.transform = `translate(calc(-50% + ${last.x}px), ${last.y}px)`;
    }

    function totalMotion() {
        let m = 0;
        points.forEach((p, i) => {
            if (p.pinned) return;
            m += Math.abs(p.x - p.oldX) + Math.abs(p.y - p.oldY);
        });
        return m;
    }

    function loop() {
        stepPhysics();
        render();
        if (dragging || totalMotion() > 0.05) {
            raf = requestAnimationFrame(loop);
        } else {
            raf = null;
        }
    }

    function pointerToLocal(e) {
        const rect = wrap.getBoundingClientRect();
        return {
            x: e.clientX - (rect.left + rect.width / 2),
            y: e.clientY - rect.top
        };
    }

    card.addEventListener('pointerdown', (e) => {
        dragging = true;
        card.setPointerCapture(e.pointerId);
        if (!raf) loop();
    });

    card.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        const { x, y } = pointerToLocal(e);
        const dist = Math.hypot(x, y);
        const scale = dist > MAX_REACH ? MAX_REACH / dist : 1;
        const last = points[lastIndex];
        last.oldX = last.x;
        last.oldY = last.y;
        last.x = x * scale;
        last.y = y * scale;
    });

    function endDrag() { dragging = false; }
    card.addEventListener('pointerup', endDrag);
    card.addEventListener('pointercancel', endDrag);

    loop();
});
