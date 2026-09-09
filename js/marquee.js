// Marquee: markup is written ONCE (one .marquee-group). This script clones it
// enough times to fill the screen, then animates a seamless infinite loop.
//
// How the loop stays seamless: we shift left by exactly one group's width and
// restart. Since there are always more groups than fit on screen, the moment
// group 1 slides off, group 2 already sits where group 1 started — the jump
// back to 0 is invisible.
(function () {
    var SPEED = 70; // px per second (lower = slower)

    document.querySelectorAll('.animate-marquee-container').forEach(function (track) {
        var original = track.querySelector('.marquee-group');
        if (!original) return;

        function build() {
            // reset to a single group
            track.querySelectorAll('.marquee-group').forEach(function (g, i) {
                if (i > 0) g.remove();
            });
            original.style.animation = '';

            var groupWidth = original.offsetWidth;
            if (!groupWidth) return;

            // need enough copies to cover the viewport, + 1 spare that scrolls off
            var copies = Math.ceil(window.innerWidth / groupWidth) + 1;
            for (var i = 1; i < copies; i++) {
                var clone = original.cloneNode(true);
                clone.setAttribute('aria-hidden', 'true');
                track.appendChild(clone);
            }

            track.style.setProperty('--marquee-shift', '-' + groupWidth + 'px');
            track.style.setProperty('--marquee-duration', (groupWidth / SPEED) + 's');
        }

        build();

        var t;
        window.addEventListener('resize', function () {
            clearTimeout(t);
            t = setTimeout(build, 200);
        });
    });
})();
