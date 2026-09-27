document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('[data-phone-track]');
    const prevBtn = document.querySelector('[data-phone-prev]');
    const nextBtn = document.querySelector('[data-phone-next]');
    const dotsWrap = document.querySelector('[data-phone-dots]');
    const titleEl = document.querySelector('[data-phone-title]');
    const descEl = document.querySelector('[data-phone-desc]');
    if (!track || !prevBtn || !nextBtn || !dotsWrap) return;

    const screens = [
        { title: 'Login', desc: 'Sign in screen for returning users.' },
        { title: 'Register', desc: 'New account registration with name, email, phone, and password.' },
        { title: 'Home', desc: 'Dashboard with a greeting, quick access to the SOS panel, and the latest earthquake update.' },
        { title: 'Home — Quick Access', desc: 'Shortcuts to the earthquake map, alerts, safety guide, and community reports, plus a live feed of recent earthquakes.' },
        { title: 'SOS', desc: 'Emergency SOS signal sent directly to admins, with auto-detected GPS location and a short condition note.' },
        { title: 'Alerts — Earthquake', desc: 'Significant earthquakes (M ≥ 5.0) sourced from BMKG, alongside quakes reported as felt by the community.' },
        { title: 'Alerts — Weather', desc: 'Weather forecast switchable across major Indonesian cities.' },
        { title: 'Guide', desc: 'Disaster-type articles with risk levels, plus quick safety tips.' },
        { title: 'Profile', desc: 'User profile; admin accounts get access to an additional Admin Panel.' },
        { title: 'Admin — Incoming SOS', desc: 'Admins view incoming SOS signals and mark them as handled or remove them.' },
        { title: 'Admin — Broadcast Alert', desc: 'Admins broadcast alerts (Info, Warning, Danger) as push notifications to every user.' },
        { title: 'Reports', desc: 'Users submit community disaster reports with a photo, location, and description; submissions show a status (pending, verified, rejected) that admins can update.' },
        { title: 'Admin — Manage Reports', desc: 'Admins review community reports, update their status (Pending, Verified, Rejected), and remove entries when no longer needed.' }
    ];
    const count = screens.length;
    let index = 0;

    screens.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Screen ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
    });

    function update() {
        track.style.transform = `translateX(-${index * 100}%)`;
        dotsWrap.querySelectorAll('.carousel-dot').forEach((d, i) => d.classList.toggle('active', i === index));
        titleEl.textContent = screens[index].title;
        descEl.textContent = screens[index].desc;
    }
    function goTo(i) { index = (i + count) % count; update(); }

    nextBtn.addEventListener('click', () => goTo(index + 1));
    prevBtn.addEventListener('click', () => goTo(index - 1));
    update();
});
