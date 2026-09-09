// Click-to-activate, true lazy-load PDF preview:
// the iframe has NO src until the overlay is clicked — so Google Drive doesn't
// load anything in the background. On click we set src from data-src, re-enable
// pointer events, and remove the overlay.
document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.querySelector('[data-pdf-overlay]');
    const frame = document.querySelector('[data-pdf-frame]');
    if (!overlay || !frame) return;

    overlay.addEventListener('click', () => {
        if (!frame.src && frame.dataset.src) {
            frame.src = frame.dataset.src;
        }
        frame.style.pointerEvents = 'auto';
        overlay.remove();
    });
});
