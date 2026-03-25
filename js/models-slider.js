document.addEventListener('DOMContentLoaded', () => {
    const viewport = document.getElementById('models-carousel');
    const track = viewport?.querySelector('.models-track');
    const prevBtn = document.querySelector('[data-carousel-prev]');
    const nextBtn = document.querySelector('[data-carousel-next]');

    const carModal = document.getElementById('car-modal');
    const carTitle = document.getElementById('car-title');
    const carSpec = document.getElementById('car-spec-line');
    const carPrice = document.getElementById('car-price');
    const carDesc = document.getElementById('car-description');
    const techList = document.getElementById('tech-list');
    const sliderWrapper = document.getElementById('car-slider-wrapper');

    if (!viewport || !track || !prevBtn || !nextBtn) return;

    const slides = () => Array.from(track.querySelectorAll('.model-slide'));
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    let index = 1;
    let dragStartX = 0;
    let isPointerDown = false;
    let hasDragged = false;

    let carSwiper = null;

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

    function goNext() {
        goTo(index + 1);
    }

    function goPrev() {
        goTo(index - 1);
    }

    prevBtn.addEventListener('click', goPrev);
    nextBtn.addEventListener('click', goNext);

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
    const DRAG_THRESHOLD = 6;

    viewport.addEventListener('pointerdown', (e) => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;

        isPointerDown = true;
        hasDragged = false;
        dragStartX = e.clientX;
        setWheelDrag(0);

        try {
            viewport.setPointerCapture(e.pointerId);
        } catch {}
    });

    viewport.addEventListener('pointermove', (e) => {
        if (!isPointerDown) return;

        const delta = e.clientX - dragStartX;
        if (Math.abs(delta) < DRAG_THRESHOLD) return;

        hasDragged = true;
        viewport.classList.add('wheel-dragging');
        setWheelDrag(delta);
    });

    viewport.addEventListener('pointerup', (e) => {
        if (!isPointerDown) return;
        isPointerDown = false;

        try {
            viewport.releasePointerCapture(e.pointerId);
        } catch {}

        viewport.classList.remove('wheel-dragging');

        const delta = e.clientX - dragStartX;
        const threshold = viewport.clientWidth * 0.15;

        if (hasDragged) {
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

            return;
        }

        const el = document.elementFromPoint(e.clientX, e.clientY);
        const slide = el?.closest('.model-slide');
        if (!slide) return;
        if (slide.getAttribute('data-wheel-depth') !== '0') return;

        carTitle.textContent = slide.dataset.name || '';
        carSpec.textContent = slide.dataset.spec || '';
        carPrice.textContent = slide.dataset.price || '';
        carDesc.textContent = slide.dataset.description || '';

        techList.innerHTML = '';

        if (slide.dataset.tech) {
            try {
                const techArray = JSON.parse(slide.dataset.tech);
                techArray.forEach(([label, value]) => {
                    const div = document.createElement('div');
                    div.className = 'tech-item';
                    div.textContent = `${label} - ${value}`;
                    techList.appendChild(div);
                });
            } catch (e) {
                console.error('Tech parse error', e);
            }
        }

        sliderWrapper.innerHTML = '';

        if (slide.dataset.images) {
            try {
                const images = JSON.parse(slide.dataset.images);

                images.forEach(src => {
                    const slideEl = document.createElement('div');
                    slideEl.className = 'swiper-slide';

                    const img = document.createElement('img');
                    img.src = src;
                    img.alt = slide.dataset.name || '';

                    slideEl.appendChild(img);
                    sliderWrapper.appendChild(slideEl);
                });
            } catch (e) {
                console.error('Images parse error', e);
            }
        }

        if (carSwiper) {
            carSwiper.destroy(true, true);
        }

        carModal.classList.add('modal-active');
        carModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        setTimeout(() => {
            carSwiper = new Swiper('.car-slider', {
                loop: true,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
            });
        }, 50);
    });

    const ro = new ResizeObserver(() => goTo(index, { instant: true }));
    ro.observe(viewport);

    goTo(index, { instant: true });
});