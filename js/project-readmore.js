document.addEventListener('DOMContentLoaded', () => {
    function addButtons() {
        document.querySelectorAll('.project-desc').forEach(desc => {
            const next = desc.nextElementSibling;
            if (next && next.classList.contains('project-read-more')) return; // already done
            if (desc.scrollHeight > desc.clientHeight + 1) {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'project-read-more is-visible';
                btn.textContent = 'Read more';
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const expanded = desc.classList.toggle('is-expanded');
                    btn.textContent = expanded ? 'Read less' : 'Read more';
                });
                desc.insertAdjacentElement('afterend', btn);
            }
        });
    }

    addButtons();

    // cards past the initial limit only get measured once "Show all" reveals them
    const showAllBtn = document.querySelector('[data-project-show-all]');
    if (showAllBtn) {
        showAllBtn.addEventListener('click', () => setTimeout(addButtons, 60));
    }
});
