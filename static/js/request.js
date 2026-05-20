document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('request-form');
    
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = 'Отправляем...';
        submitBtn.disabled = true;

        // Имитация отправки (позже подключим реальную)
        setTimeout(() => {
            alert('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.');
            form.reset();
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }, 1500);
    });
});