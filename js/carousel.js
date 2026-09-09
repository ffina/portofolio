// Simple image carousel.
// Markup per carousel:
//   <div data-carousel>
//     <div data-carousel-track> <div class="carousel-slide">…</div> … </div>
//     <button data-carousel-prev>  <button data-carousel-next>
//     <div data-carousel-dots></div>
//   </div>
// Add / remove .carousel-slide elements freely — dots & wrap-around adjust automatically.
document.querySelectorAll('[data-carousel]').forEach(function (root) {
    var track = root.querySelector('[data-carousel-track]');
    if (!track) return;

    var slides = Array.prototype.slice.call(track.querySelectorAll('.carousel-slide'));
    var prevBtn = root.querySelector('[data-carousel-prev]');
    var nextBtn = root.querySelector('[data-carousel-next]');
    var dotsWrap = root.querySelector('[data-carousel-dots]');
    var index = 0;

    if (slides.length <= 1) {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        return;
    }

    // build dots
    var dots = [];
    if (dotsWrap) {
        slides.forEach(function (_, i) {
            var dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'carousel-dot';
            dot.setAttribute('aria-label', 'Go to image ' + (i + 1));
            dot.addEventListener('click', function () { go(i); });
            dotsWrap.appendChild(dot);
            dots.push(dot);
        });
    }

    function go(i) {
        index = (i + slides.length) % slides.length;
        track.style.transform = 'translateX(' + (-index * 100) + '%)';
        dots.forEach(function (d, di) { d.classList.toggle('active', di === index); });
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { go(index - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { go(index + 1); });

    // swipe (touch)
    var startX = null;
    track.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', function (e) {
        if (startX === null) return;
        var dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
        startX = null;
    });

    go(0);
});
