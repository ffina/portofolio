const cards = document.querySelectorAll('.card');

cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        cards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
    });
});

// Experience carousel (mobile): remember which card the visitor was on so that
// coming back from a sub-page returns to it instead of resetting to the first.
(function () {
    const gallery = document.querySelector('.ronaldo-gallery');
    if (!gallery) return;
    const KEY = 'expCarouselScroll';

    function save() {
        try { sessionStorage.setItem(KEY, String(Math.round(gallery.scrollLeft))); } catch (e) {}
    }
    function restore() {
        try {
            const v = sessionStorage.getItem(KEY);
            if (v !== null) gallery.scrollLeft = parseInt(v, 10) || 0;
        } catch (e) {}
    }

    restore();
    window.addEventListener('pageshow', restore);

    let t;
    gallery.addEventListener('scroll', () => {
        clearTimeout(t);
        t = setTimeout(save, 120);
    }, { passive: true });

    // snapshot immediately before following a "view more" link
    gallery.querySelectorAll('a.view-more').forEach(a => a.addEventListener('click', save));
})();