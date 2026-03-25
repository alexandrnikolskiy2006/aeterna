document.addEventListener('DOMContentLoaded', () => {
    const authModal       = document.getElementById('auth-modal');
    const regModal        = document.getElementById('reg-modal');
    const forgotModal     = document.getElementById('forgot-modal');
    const forgotCodeModal = document.getElementById('forgot-code-modal');
    const forgotNewPassModal = document.getElementById('forgot-newpass-modal');
    const carModal        = document.getElementById('car-modal');

    const openAuthTriggers = document.querySelectorAll('[data-modal="auth"]');

    function openModal(modal) {
        if (!modal) return;
        modal.classList.add('modal-active');
        document.body.style.overflow = 'hidden';
        modal.setAttribute('aria-hidden', 'false');

        const firstInput = modal.querySelector('input');
        if (firstInput) firstInput.focus();
    }

    function closeModal(modal) {
        if (!modal) return;

        modal.classList.remove('modal-active');
        modal.setAttribute('aria-hidden', 'true');

        setTimeout(() => {
            document.body.style.overflow = '';
        }, 300);
    }

    openAuthTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(authModal);
        });
    });

    [authModal, regModal, forgotModal, forgotCodeModal, forgotNewPassModal, carModal].forEach(modal => {
        if (!modal) return;

        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay') || 
                e.target.classList.contains('modal-close')) {
                closeModal(modal);
            }
        });
    });

    document.querySelectorAll('.modal-switch').forEach(link => {
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

    document.querySelectorAll('.otp-input').forEach((input, index, inputs) => {
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
            const activeModal = document.querySelector('.modal-active');
            if (activeModal) closeModal(activeModal);
        }
    });
});