// Skills — scroll-scrubbed reveal, grouped in batches.
// The tall wrapper ([data-skills-scroll]) is scrolled through while the stage is
// pinned (position: sticky). Scroll progress is split into one segment per BATCH
// (data-batch), not per icon — so ~5 "turns" instead of ~17. Within its segment a
// batch's icons are "active" (spread near centre via --active-x/y); once the
// segment has passed they "settle" into the final grid (--grid-x/y).
document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.querySelector('[data-skills-scroll]');
    const icons = document.querySelectorAll('[data-skill-icon]');
    if (!wrapper || !icons.length) return;

    const batchCount = Math.max(...Array.from(icons, i => Number(i.dataset.batch) || 0)) + 1;
    const segment = 1 / batchCount;
    let ticking = false;

    function apply() {
        ticking = false;
        const rect = wrapper.getBoundingClientRect();
        const scrollableHeight = wrapper.offsetHeight - window.innerHeight;
        const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(scrollableHeight, 0));
        const progress = scrollableHeight > 0 ? scrolled / scrollableHeight : 0;

        icons.forEach(icon => {
            const batch = Number(icon.dataset.batch) || 0;
            const start = batch * segment;
            const end = (batch + 1) * segment;
            let state = 'pending';
            if (progress >= start && progress < end) state = 'active';
            else if (progress >= end) state = 'settled';
            icon.dataset.state = state;
        });
    }

    function update() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(apply);
    }

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    apply();
});

// Grid positions (--grid-x / --grid-y) are computed here rather than hard-coded
// inline in the HTML — column count & spacing adapt to the viewport width.
function layoutSkillsGrid() {
    const icons = document.querySelectorAll('[data-skill-icon]');
    if (!icons.length) return;

    const width = window.innerWidth;
    let columns = 6, spacing = 128;

    if (width < 480) {
        columns = 3; spacing = 90;
    } else if (width < 768) {
        columns = 4; spacing = 100;
    }

    const rows = Math.ceil(icons.length / columns);
    const offsetX = ((columns - 1) * spacing) / 2;
    const offsetY = ((rows - 1) * spacing) / 2;

    icons.forEach((icon, i) => {
        const col = i % columns;
        const row = Math.floor(i / columns);
        icon.style.setProperty('--grid-x', `${col * spacing - offsetX}px`);
        icon.style.setProperty('--grid-y', `${row * spacing - offsetY}px`);
    });
}

document.addEventListener('DOMContentLoaded', layoutSkillsGrid);
window.addEventListener('resize', layoutSkillsGrid);
