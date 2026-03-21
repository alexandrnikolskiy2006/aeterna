document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.models-container');
    const prevBtn = document.querySelector('.top-button:first-child');
    const nextBtn = document.querySelector('.top-button:last-child');

    let isAnimating = false;

    function updateActive() {
        const figures = container.querySelectorAll('figure');
        figures.forEach(f => f.classList.remove('active'));
        if (figures[1]) figures[1].classList.add('active');
    }

    function slide(direction) {
        if (isAnimating) return;
        isAnimating = true;

        const width = container.children[0].offsetWidth + 40;
        const figures = Array.from(container.children);

        figures.forEach((fig, i) => {
            fig.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
            fig.style.transform = `translateX(${direction === 'next' ? -width : width}px)`;
        });

        setTimeout(() => {
            if (direction === 'next') {
                const first = container.firstElementChild;
                container.appendChild(first);
            } else {
                const last = container.lastElementChild;
                container.prepend(last);
            }

            figures.forEach(fig => {
                fig.style.transition = '';
                fig.style.transform = '';
            });

            updateActive();
            isAnimating = false;
        }, 300);
    }

    nextBtn.addEventListener('click', () => slide('next'));
    prevBtn.addEventListener('click', () => slide('prev'));

    updateActive();
});