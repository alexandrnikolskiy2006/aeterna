document.addEventListener('DOMContentLoaded', () => {
    // Вспомогательная функция для получения CSRF токена (обязательно для Django!)
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    async function submitFormAJAX(formElement, errorContainerId) {
        const url = formElement.getAttribute('action');
        const formData = new FormData(formElement);
        const errorContainer = document.getElementById(errorContainerId);
        
        // Достаем токен прямо из инпута формы или из куки браузера
        const csrfToken = formElement.querySelector('[name=csrfmiddlewaretoken]')?.value || getCookie('csrftoken');

        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRFToken': csrfToken // Вот это спасет нас от блокировок Django!
                }
            });

            // Если Django вернул не 200/302, а например 403 Forbidden (ошибка безопасности)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                // Успех -> в личный кабинет
                window.location.href = '/profile/'; 
            } else {
                // Выводим ошибки (если пароль короткий и т.д.)
                if (errorContainer) {
                    errorContainer.innerHTML = data.errors.join('<br>');
                    errorContainer.style.display = 'block';
                } else {
                    alert(data.errors.join('\n'));
                }
            }
        } catch (error) {
            console.error('Ошибка:', error);
            if (errorContainer) {
                errorContainer.textContent = 'Ошибка соединения с сервером. Попробуйте еще раз.';
                errorContainer.style.display = 'block';
            } else {
                alert('Ошибка соединения с сервером. Попробуйте еще раз.');
            }
        }
    }

    // Привязываем функцию к форме Входа
    const authForm = document.getElementById('auth-form');
    if (authForm) {
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            submitFormAJAX(authForm, 'auth-error');
        });
    }

    // Привязываем функцию к форме Регистрации
    const regForm = document.getElementById('reg-form');
    if (regForm) {
        regForm.addEventListener('submit', (e) => {
            e.preventDefault();
            submitFormAJAX(regForm, 'reg-error');
        });
    }
});