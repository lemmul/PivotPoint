document.addEventListener('DOMContentLoaded', () => {
    // ==================== Бургер-меню ====================
    const burger = document.getElementById('burger');
    const nav = document.querySelector('nav');
    if (burger && nav) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
    }

    // ==================== Модальное окно для услуг ====================
    const serviceBoxes = document.querySelectorAll('.service-box');
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalText = document.getElementById('modalText');
    const modalPrice = document.getElementById('modalPrice');
    const modalImage = document.getElementById('modalImage');
    const closeModal = document.getElementById('closeModal');

    if (serviceBoxes.length && modal) {
        serviceBoxes.forEach(box => {
            box.addEventListener('click', () => {
                modal.classList.add('active');
                if (modalTitle) modalTitle.innerText = box.dataset.title;
                if (modalText) modalText.innerText = box.dataset.text;
                if (modalPrice) modalPrice.innerText = box.dataset.price;
                if (modalImage) modalImage.src = box.dataset.image;
            });
        });

        if (closeModal) {
            closeModal.addEventListener('click', () => {
                modal.classList.remove('active');
            });
        }

        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });
    }

    // ==================== Анимации при скролле (Intersection Observer) ====================
    const animatedElements = document.querySelectorAll('.offer-block, .service-box, .image-box');
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
(function() {
        // Элементы
        const modal = document.getElementById('modal');
        const closeModalBtn = document.getElementById('closeModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalText = document.getElementById('modalText');
        const modalPrice = document.getElementById('modalPrice');
        const modalImage = document.getElementById('modalImage');
        const openBookingBtn = document.getElementById('openBookingFromModal');
        
        const bookingModal = document.getElementById('bookingModal');
        const closeBookingBtn = document.getElementById('closeBookingModal');
        const bookingForm = document.getElementById('bookingForm');
        const serviceSelect = document.getElementById('serviceSelect');
        
        let currentServiceTitle = '';
        
        // Открытие модалки услуги при клике на карточку
        const serviceBoxes = document.querySelectorAll('.service-box');
        serviceBoxes.forEach(box => {
            box.addEventListener('click', function(e) {
                const title = this.getAttribute('data-title');
                const text = this.getAttribute('data-text');
                const price = this.getAttribute('data-price');
                const image = this.getAttribute('data-image');
                
                currentServiceTitle = title || '';
                
                if (modalTitle) modalTitle.textContent = title || 'Услуга';
                if (modalText) modalText.textContent = text || 'Подробное описание';
                if (modalPrice) modalPrice.textContent = price || 'Цена уточняется';
                if (modalImage && image) modalImage.src = image;
                
                if (modal) modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            });
        });
        
        // Закрытие модалки услуги
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', function() {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            });
        }
        
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.style.display = 'none';
                    document.body.style.overflow = '';
                }
            });
        }
        
        // Открытие формы записи из модалки услуги
        if (openBookingBtn) {
            openBookingBtn.addEventListener('click', function() {
                // Закрываем модалку услуги
                modal.style.display = 'none';
                
                // Устанавливаем выбранную услугу в селекте
                if (serviceSelect && currentServiceTitle) {
                    for (let i = 0; i < serviceSelect.options.length; i++) {
                        if (serviceSelect.options[i].value === currentServiceTitle) {
                            serviceSelect.selectedIndex = i;
                            break;
                        }
                    }
                }
                
                // Сброс ошибок и полей формы
                if (bookingForm) {
                    bookingForm.reset();
                    if (serviceSelect && currentServiceTitle) {
                        for (let i = 0; i < serviceSelect.options.length; i++) {
                            if (serviceSelect.options[i].value === currentServiceTitle) {
                                serviceSelect.selectedIndex = i;
                                break;
                            }
                        }
                    }
                }
                
                document.querySelectorAll('.error-message').forEach(el => el.classList.remove('show'));
                document.querySelectorAll('.form-group input, .form-group select').forEach(el => el.classList.remove('error'));
                
                // Открываем модалку записи
                bookingModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }
        
        // Закрытие формы записи
        function closeBookingModal() {
            bookingModal.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        if (closeBookingBtn) {
            closeBookingBtn.addEventListener('click', closeBookingModal);
        }
        
        bookingModal.addEventListener('click', function(e) {
            if (e.target === bookingModal) closeBookingModal();
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && bookingModal.classList.contains('active')) {
                closeBookingModal();
            }
            if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
        
        // Валидация
        function validatePhone(phone) {
            const clean = phone.replace(/\s/g, '');
            const belarusRegex = /^(\+375|80)(29|33|44|25|17)\d{7}$/;
            return belarusRegex.test(clean);
        }
        
        function validateFullName(name) {
            const trimmed = name.trim();
            const words = trimmed.split(/\s+/);
            return words.length >= 2 && /^[a-zA-Zа-яА-ЯёЁ\-\s]+$/.test(trimmed) && trimmed.length > 3;
        }
        
        function validateBreed(breed) {
            return breed.trim().length >= 2;
        }
        
        function validateAge(age) {
            return age.trim().length >= 1;
        }
        
        function validateDateTime(datetime) {
            if (!datetime) return false;
            const selected = new Date(datetime);
            const now = new Date();
            return selected > now;
        }
        
        // Отправка формы
        if (bookingForm) {
            bookingForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                let isValid = true;
                
                const fullName = document.getElementById('fullName');
                const nameError = document.getElementById('nameError');
                if (!validateFullName(fullName.value)) {
                    nameError.classList.add('show');
                    fullName.classList.add('error');
                    isValid = false;
                } else {
                    nameError.classList.remove('show');
                    fullName.classList.remove('error');
                }
                
                const phone = document.getElementById('phone');
                const phoneError = document.getElementById('phoneError');
                if (!validatePhone(phone.value)) {
                    phoneError.classList.add('show');
                    phone.classList.add('error');
                    isValid = false;
                } else {
                    phoneError.classList.remove('show');
                    phone.classList.remove('error');
                }
                
                const breed = document.getElementById('breed');
                const breedError = document.getElementById('breedError');
                if (!validateBreed(breed.value)) {
                    breedError.classList.add('show');
                    breed.classList.add('error');
                    isValid = false;
                } else {
                    breedError.classList.remove('show');
                    breed.classList.remove('error');
                }
                
                const dogAge = document.getElementById('dogAge');
                const ageError = document.getElementById('ageError');
                if (!validateAge(dogAge.value)) {
                    ageError.classList.add('show');
                    dogAge.classList.add('error');
                    isValid = false;
                } else {
                    ageError.classList.remove('show');
                    dogAge.classList.remove('error');
                }
                
                const service = document.getElementById('serviceSelect');
                const serviceError = document.getElementById('serviceError');
                if (!service.value) {
                    serviceError.classList.add('show');
                    service.classList.add('error');
                    isValid = false;
                } else {
                    serviceError.classList.remove('show');
                    service.classList.remove('error');
                }
                
                const datetime = document.getElementById('datetime');
                const datetimeError = document.getElementById('datetimeError');
                if (!validateDateTime(datetime.value)) {
                    datetimeError.classList.add('show');
                    datetime.classList.add('error');
                    isValid = false;
                } else {
                    datetimeError.classList.remove('show');
                    datetime.classList.remove('error');
                }
                
                if (isValid) {
                    const formData = {
                        fullName: fullName.value.trim(),
                        phone: phone.value.trim(),
                        breed: breed.value.trim(),
                        dogAge: dogAge.value.trim(),
                        service: service.value,
                        datetime: datetime.value
                    };
                    
                    console.log('Заявка на запись:', formData);
                    alert(`✅ Заявка отправлена!\n\nФИО: ${formData.fullName}\nТелефон: ${formData.phone}\nПорода: ${formData.breed}\nВозраст: ${formData.dogAge}\nУслуга: ${formData.service}\nДата: ${new Date(formData.datetime).toLocaleString('ru-RU')}\n\nМы свяжемся с вами для подтверждения!`);
                    
                    closeBookingModal();
                    bookingForm.reset();
                }
            });
        }
    })();