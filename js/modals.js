document.addEventListener('DOMContentLoaded', () => {
    const authModal = document.getElementById('auth-modal');
    const regModal = document.getElementById('reg-modal');
    const forgotModal = document.getElementById('forgot-modal');
    const forgotCodeModal = document.getElementById('forgot-code-modal');
    const forgotNewPassModal = document.getElementById('forgot-newpass-modal');
    const carModal = document.getElementById('car-modal');

    const carTitle = document.getElementById('car-title');
    const carSpec = document.getElementById('car-spec-line');
    const carPrice = document.getElementById('car-price');
    const carDesc = document.getElementById('car-description');
    const techList = document.getElementById('tech-list');
    const sliderWrapper = document.getElementById('car-slider-wrapper');

    let carSwiper = null;

    function openModal(modal) {
        if (!modal) return;
        modal.classList.add('modal--active');
        document.body.style.overflow = 'hidden';
        modal.setAttribute('aria-hidden', 'false');

        const firstInput = modal.querySelector('.modal__input');
        if (firstInput) firstInput.focus();
    }

    function closeModal(modal) {
        if (!modal) return;
        modal.classList.remove('modal--active');
        modal.setAttribute('aria-hidden', 'true');

        setTimeout(() => {
            document.body.style.overflow = '';
        }, 300);
    }

    function fillCarModal(slide) {
        if (!slide) return;

        const modelKey = slide.dataset.model;
        const car = window.carsData ? window.carsData[modelKey] : null;
        if (!car) return;

        carTitle.textContent = car.name;
        carSpec.textContent = car.spec;
        carPrice.textContent = car.price;
        carDesc.textContent = car.description;

        techList.innerHTML = '';
        car.tech.forEach(([label, value]) => {
            const div = document.createElement('div');
            div.className = 'modal__tech-item';
            div.textContent = `${label} - ${value}`;
            techList.appendChild(div);
        });

        sliderWrapper.innerHTML = '';
        car.images.forEach(src => {
            const slideEl = document.createElement('div');
            slideEl.className = 'swiper-slide';
            const img = document.createElement('img');
            img.src = src;
            img.alt = car.name;
            slideEl.appendChild(img);
            sliderWrapper.appendChild(slideEl);
        });

        if (carSwiper) carSwiper.destroy(true, true);

        setTimeout(() => {
            carSwiper = new Swiper('.modal__car-slider', {
                loop: true,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                }
            });
        }, 100);
    }

    document.querySelectorAll('[data-modal]').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = trigger.getAttribute('data-modal');
            const modal = document.getElementById(modalId + '-modal') || document.getElementById(modalId);
            if (modal) openModal(modal);
        });
    });

    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal__overlay') || e.target.classList.contains('modal__close')) {
                closeModal(modal);
            }
        });
    });

    document.querySelectorAll('.modal__switch').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const currentModal = link.closest('.modal');
            const targetId = link.getAttribute('href').replace('#', '');
            const targetModal = document.getElementById(targetId);
            if (currentModal && targetModal) {
                closeModal(currentModal);
                setTimeout(() => openModal(targetModal), 200);
            }
        });
    });

    document.querySelectorAll('.modal__otp-input').forEach((input, index, inputs) => {
        input.addEventListener('input', () => {
            input.value = input.value.replace(/[^0-9]/g, '');
            if (input.value.length === 1 && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && input.value.length === 0 && index > 0) {
                inputs[index - 1].focus();
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal--active');
            if (activeModal) closeModal(activeModal);
        }
    });

    window.openCarModal = function(slide) {
        if (!slide || slide.getAttribute('data-wheel-depth') !== '0') return;
        fillCarModal(slide);
        openModal(carModal);
    };
});