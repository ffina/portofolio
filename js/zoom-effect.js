document.addEventListener('DOMContentLoaded', () => {
    const wrap = document.querySelector('[data-zoom-wrap]');
    const img = document.querySelector('[data-zoom-img]');
    if (!wrap || !img) return;

    function update() {
        const rect = wrap.getBoundingClientRect();
        const vh = window.innerHeight;
        const progress = Math.min(Math.max((vh - rect.top) / (vh + rect.height), 0), 1);
        const scale = 1 + progress * 0.25;
        img.style.transform = `scale(${scale.toFixed(3)})`;
    }

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
});