document.addEventListener('DOMContentLoaded', () => {
    const viewport = document.getElementById('models-carousel');
    const track = viewport?.querySelector('.models-track');
    const prevBtn = document.querySelector('[data-carousel-prev]');
    const nextBtn = document.querySelector('[data-carousel-next]');

    if (!viewport || !track || !prevBtn || !nextBtn) return;

    const slides = () => Array.from(track.querySelectorAll('.model-slide'));
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    let index = 1;
    let dragStartX = 0;
    let isPointerDown = false;
    let hasDragged = false;

    function circularDelta(i, center, n) {
        if (n <= 0) return 0;
        let d = i - center;
        const h = Math.floor(n / 2);
        if (d > h) d -= n;
        if (d < -h) d += n;
        return d;
    }

    function updateWheelLayout() {
        const list = slides();
        const n = list.length;

        list.forEach((slide, i) => {
            const d = circularDelta(i, index, n);
            const absD = Math.abs(d);
            const sign = d < 0 ? -1 : d > 0 ? 1 : 0;
            const visualStep = sign * Math.min(absD, 2);

            slide.style.setProperty('--wheel-x', String(visualStep));

            let z;
            if (absD === 0) {
                z = 500;
            } else {
                z = 100 - absD * 15;
                if (d < 0) z += 1;
            }
            slide.style.zIndex = String(z);

            const depthAttr = String(Math.min(absD, 3));
            slide.setAttribute('data-wheel-depth', depthAttr);
        });
    }

    function setWheelDrag(px) {
        const rounded = Math.round(px);
        viewport.style.setProperty('--wheel-drag', `${rounded}px`);
    }

    function goTo(newIndex, { instant } = {}) {
        const list = slides();
        const n = list.length;
        if (n === 0) return;

        index = ((newIndex % n) + n) % n;

        const skip = instant || reducedMotion.matches;

        if (skip) {
            viewport.classList.add('wheel-skip-transition');
            updateWheelLayout();
            void viewport.offsetHeight;
            viewport.classList.remove('wheel-skip-transition');
        } else {
            updateWheelLayout();
        }

        viewport.classList.remove('wheel-dragging');
        setWheelDrag(0);
    }

    function goNext() {
        goTo(index + 1);
    }

    function goPrev() {
        goTo(index - 1);
    }

    function onResize() {
        goTo(index, { instant: true });
    }

    prevBtn.addEventListener('click', () => goPrev());
    nextBtn.addEventListener('click', () => goNext());

    viewport.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            goPrev();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            goNext();
        }
    });

    let suppressNavigationClick = false;

    viewport.addEventListener(
        'click',
        (e) => {
            if (suppressNavigationClick) {
                e.preventDefault();
                e.stopPropagation();
                suppressNavigationClick = false;
            }
        },
        true
    );

    const dragThresholdPx = 6;

    viewport.addEventListener('pointerdown', (e) => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;

        isPointerDown = true;
        hasDragged = false;
        dragStartX = e.clientX;
        setWheelDrag(0);

        try {
            viewport.setPointerCapture(e.pointerId);
        } catch {
            /* ignore */
        }
    });

    viewport.addEventListener('pointermove', (e) => {
        if (!isPointerDown) return;
        const delta = e.clientX - dragStartX;
        if (Math.abs(delta) < dragThresholdPx) return;

        hasDragged = true;
        viewport.classList.add('wheel-dragging');
        setWheelDrag(delta);
    });

    viewport.addEventListener('pointerup', (e) => {
        if (!isPointerDown) return;
        isPointerDown = false;

        try {
            viewport.releasePointerCapture(e.pointerId);
        } catch {
            /* ignore */
        }

        viewport.classList.remove('wheel-dragging');

        if (!hasDragged) {
            return;
        }

        const delta = e.clientX - dragStartX;
        const threshold = viewport.clientWidth * 0.15;

        if (delta > threshold) {
            goPrev();
        } else if (delta < -threshold) {
            goNext();
        } else {
            goTo(index);
        }

        if (Math.abs(delta) > 12) {
            suppressNavigationClick = true;
        }
    });

    viewport.addEventListener('pointercancel', () => {
        if (!isPointerDown) return;
        isPointerDown = false;
        viewport.classList.remove('wheel-dragging');
        if (hasDragged) {
            goTo(index);
        }
    });

    const ro = new ResizeObserver(() => onResize());
    ro.observe(viewport);

    if (typeof reducedMotion.addEventListener === 'function') {
        reducedMotion.addEventListener('change', () => onResize());
    } else if (typeof reducedMotion.addListener === 'function') {
        reducedMotion.addListener(() => onResize());
    }

    goTo(index, { instant: true });
});
