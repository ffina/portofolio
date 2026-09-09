document.addEventListener('DOMContentLoaded', () => {
    const stack = document.querySelector('[data-trait-stack]');
    if (!stack) return;

    stack.addEventListener('click', () => {
        const front = stack.querySelector('.trait-card:first-child');
        if (!front || front.classList.contains('is-leaving')) return;

        front.classList.add('is-leaving');
        front.addEventListener('transitionend', () => {
            front.classList.remove('is-leaving');
            stack.appendChild(front);
        }, { once: true });
    });
});
