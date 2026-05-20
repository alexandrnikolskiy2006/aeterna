document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.profile__data-input').forEach(input => {
        input.style.display = 'none';
    });

    document.querySelectorAll('.profile__edit-btn').forEach(btn => {
        btn.addEventListener('click', () => toggleEdit(btn));
    });

    document.querySelectorAll('.profile__save-btn').forEach(btn => {
        btn.addEventListener('click', () => saveEdit(btn));
    });
});

function toggleEdit(btn) {
    const row = btn.parentElement;
    const valueSpan = row.querySelector('.profile__data-value');
    const input = row.querySelector('.profile__data-input');
    const saveBtn = row.querySelector('.profile__save-btn');

    valueSpan.style.display = 'none';
    input.style.display = 'block';
    btn.style.display = 'none';
    saveBtn.style.display = 'inline-block';

    input.focus();
    input.select();
}

function saveEdit(btn) {
    const row = btn.parentElement;
    const input = row.querySelector('.profile__data-input');
    const valueSpan = row.querySelector('.profile__data-value');
    const editBtn = row.querySelector('.profile__edit-btn');

    const field = row.dataset.field;
    const newValue = input.value.trim();

    if (!validateField(field, newValue)) {
        alert('Пожалуйста, введите корректные данные');
        input.focus();
        return;
    }

    valueSpan.textContent = newValue;
    valueSpan.style.display = 'block';
    input.style.display = 'none';
    btn.style.display = 'none';
    editBtn.style.display = 'inline-block';
}

function validateField(field, value) {
    if (!value) return false;

    switch (field) {
        case 'name':
            return value.length >= 2;

        case 'phone':
            const phoneRegex = /^(\+7|8)?[\s\-()]*(\d[\s\-()]*){10,11}$/;
            return phoneRegex.test(value);

        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(value);

        default:
            return true;
    }
}