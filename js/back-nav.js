document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-back-link]').forEach(link => {
        link.addEventListener('click', (e) => {
            const sameOrigin = document.referrer && document.referrer.startsWith(window.location.origin);
            if (sameOrigin && window.history.length > 1) {
                e.preventDefault();
                history.back();
            }
            // else: let the normal href run (fallback when opened directly, e.g. a shared link)
        });
    });
});
