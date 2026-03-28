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
    let activePointerId = null;

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

            let z = absD === 0 ? 500 : 100 - absD * 15;
            if (d < 0) z += 1;
            slide.style.zIndex = String(z);

            slide.setAttribute('data-wheel-depth', String(Math.min(absD, 3)));
        });
    }

    function setWheelDrag(px) {
        viewport.style.setProperty('--wheel-drag', `${Math.round(px)}px`);
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

    function goNext() { goTo(index + 1); }
    function goPrev() { goTo(index - 1); }

    prevBtn.addEventListener('click', goPrev);
    nextBtn.addEventListener('click', goNext);

    viewport.addEventListener('keydown', (e) => {
        if (e.repeat) return;
        if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); goNext(); }
    });

    const DRAG_THRESHOLD = 10;

    viewport.addEventListener('pointerdown', (e) => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        isPointerDown = true;
        hasDragged = false;
        dragStartX = e.clientX;
        activePointerId = e.pointerId;
        setWheelDrag(0);
        if (e.pointerType !== 'touch') viewport.setPointerCapture(e.pointerId);
    });

    viewport.addEventListener('pointermove', (e) => {
        if (!isPointerDown || e.pointerId !== activePointerId) return;
        const delta = e.clientX - dragStartX;
        if (Math.abs(delta) < DRAG_THRESHOLD) return;

        hasDragged = true;
        viewport.classList.add('wheel-dragging');
        setWheelDrag(delta);
    });

    function endPointerDrag(e) {
        if (!isPointerDown || e.pointerId !== activePointerId) return;

        isPointerDown = false;
        activePointerId = null;
        viewport.classList.remove('wheel-dragging');

        const delta = Math.abs(e.clientX - dragStartX);

        if (hasDragged && delta > viewport.clientWidth * 0.12) {
            if (e.clientX - dragStartX > 0) goPrev();
            else goNext();
            return;
        }

        const hit = document.elementFromPoint(e.clientX, e.clientY);
        const tappedSlide = hit?.closest('.model-slide');

        if (tappedSlide && tappedSlide.getAttribute('data-wheel-depth') === '0') {
            setTimeout(() => {
                window.openCarModal(tappedSlide);
            }, 10);
        }
    }

    viewport.addEventListener('pointerup', endPointerDrag);
    viewport.addEventListener('pointercancel', () => {
        isPointerDown = false;
        activePointerId = null;
        viewport.classList.remove('wheel-dragging');
        setWheelDrag(0);
        goTo(index);
    });

    const ro = new ResizeObserver(() => goTo(index, { instant: true }));
    ro.observe(viewport);

    goTo(index, { instant: true });
});