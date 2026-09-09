document.addEventListener('DOMContentLoaded', () => {
    const targets = document.querySelectorAll('.reveal, .timeline-item');
    if (!targets.length) return;

    function animateCount(el) {
        const target = parseFloat(el.dataset.countTarget);
        const decimals = parseInt(el.dataset.countDecimals || '0', 10);
        const suffix = el.dataset.countSuffix || '';
        const duration = 1200;
        const start = performance.now();

        function step(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = (target * eased).toFixed(decimals) + suffix;
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = target.toFixed(decimals) + suffix;
        }
        requestAnimationFrame(step);
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            entry.target.querySelectorAll('[data-count-target]').forEach(animateCount);
            if (entry.target.hasAttribute('data-count-target')) animateCount(entry.target);
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    targets.forEach((el, i) => {
        el.style.transitionDelay = `${(i % 4) * 0.08}s`;
        observer.observe(el);
    });
});
