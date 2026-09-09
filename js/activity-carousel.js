// Per-item photo carousel — runs on every [data-activity-carousel] on the page,
// each one independent. Reuses the .carousel-btn / .carousel-dot styles.
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-activity-carousel]').forEach(initCarousel);
});

function initCarousel(root) {
    const track = root.querySelector('[data-activity-track]');
    const prevBtn = root.querySelector('[data-activity-prev]');
    const nextBtn = root.querySelector('[data-activity-next]');
    const dotsWrap = root.querySelector('[data-activity-dots]');
    if (!track || !prevBtn || !nextBtn || !dotsWrap) return;

    const slides = track.querySelectorAll('.activity-slide');
    const count = slides.length;
    let index = 0;

    if (count <= 1) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        return;
    }

    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Photo ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
    });

    function update() {
        track.style.transform = `translateX(-${index * 100}%)`;
        dotsWrap.querySelectorAll('.carousel-dot').forEach((d, i) => d.classList.toggle('active', i === index));
    }
    function goTo(i) { index = (i + count) % count; update(); }

    nextBtn.addEventListener('click', () => goTo(index + 1));
    prevBtn.addEventListener('click', () => goTo(index - 1));
    update();
}
