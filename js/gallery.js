document.addEventListener('DOMContentLoaded', () => {
    // ==================== Бургер-меню ====================
    const burger = document.getElementById('burger');
    const nav = document.querySelector('nav');
    if (burger && nav) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
    }

    // ==================== Модальное окно для изображений ====================
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const closeModalBtn = document.getElementById('closeModal');
    
    // Функция открытия модального окна
    window.openImage = function(card) {
        const img = card.querySelector('img');
        if (img && modal && modalImage) {
            modal.classList.add('active');
            modalImage.src = img.src;
        }
    };
    
    // Функция закрытия модального окна
    window.closeImage = function() {
        if (modal) {
            modal.classList.remove('active');
        }
    };
    
    // Закрытие по кнопке
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeImage);
    }
    
    // Закрытие по клику на фон
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeImage();
        });
    }
    
    // Навешиваем обработчики на карточки галереи
    const galleryCards = document.querySelectorAll('.gallery-card');
    galleryCards.forEach(card => {
        card.addEventListener('click', () => {
            const img = card.querySelector('img');
            if (img && modal && modalImage) {
                modal.classList.add('active');
                modalImage.src = img.src;
            }
        });
    });

    // ==================== Анимации при скролле (Intersection Observer) ====================
    const animatedElements = document.querySelectorAll('.gallery-card, .quote-card, .review, .divider, .strip-box');
    
    if (animatedElements.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -20px 0px' });
        
        animatedElements.forEach(el => observer.observe(el));
        
        // Дополнительная проверка для элементов, уже видимых при загрузке
        setTimeout(() => {
            animatedElements.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight - 100) {
                    el.classList.add('visible');
                    observer.unobserve(el);
                }
            });
        }, 200);
    }
});