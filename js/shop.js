// ==================== DATA ====================
const products = [
    { name: 'Премиальный поводок', price: 89, image: '/IMG/shop1.jpg', description: 'Мягкий поводок из прочного материала с удобной ручкой.', gallery: ['/IMG/shop1.jpg','/IMG/shop1.1.jpg', '/IMG/shop1.2.jpg', '/IMG/shop1.3.jpg', '/IMG/shop1.4.jpg', '/IMG/shop1.5.jpg', '/IMG/shop1.6.jpg', '/IMG/shop1.7.jpg'] },
    { name: 'Игрушка для собак', price: 45, image: '/IMG/shop2.jpg', description: 'Безопасная игрушка для активных собак.', gallery: ['/IMG/shop2.jpg', '/IMG/shop2.1.jpg', '/IMG/shop2.2.jpg', '/IMG/shop2.3.jpg'] },
    { name: 'Лежанка Premium', price: 240, image: '/IMG/shop3.jpg', description: 'Мягкая лежанка с ортопедическим наполнителем.', gallery: ['/IMG/shop3.jpg', '/IMG/shop3.1.jpg', '/IMG/shop3.2.jpg', '/IMG/shop3.3.jpg', '/IMG/shop3.4.jpg', '/IMG/shop3.5.jpg'] },
    { name: 'Кожаный ошейник', price: 75, image: '/IMG/shop4.jpg', description: 'Стильный ошейник из натуральной кожи.', gallery: ['/IMG/shop4.jpg', '/IMG/shop4.1.jpg', '/IMG/shop4.2.jpg', '/IMG/shop4.3.jpg', '/IMG/shop4.4.jpg', '/IMG/shop4.5.jpg'] },
    { name: 'Миски Premium', price: 60, image: '/IMG/shop5.jpg', description: 'Двойная миска для воды и еды.', gallery: ['/IMG/shop5.jpg', '/IMG/shop5.1.jpg', '/IMG/shop5.2.jpg', '/IMG/shop5.3.jpg', '/IMG/shop5.4.jpg'] },
    { name: 'Куртка для собак', price: 110, image: '/IMG/shop6.jpg', description: 'Тёплая куртка для прогулок.', gallery: ['/IMG/shop6.jpg', '/IMG/shop6.1.jpg', '/IMG/shop6.2.jpg', '/IMG/shop6.3.jpg', '/IMG/shop6.4.jpg'] },
    { name: 'Сумка для лакомств', price: 38, image: '/IMG/shop7.jpg', description: 'Компактная сумка для тренировок.', gallery: ['/IMG/shop7.jpg', '/IMG/shop7.1.jpg', '/IMG/shop7.2.jpg', '/IMG/shop7.3.jpg', '/IMG/shop7.4.jpg'] },
    { name: 'Проф. намордник', price: 95, image: '/IMG/shop8.jpg', description: 'Удобный намордник с мягкими вставками.', gallery: ['/IMG/shop8.jpg', '/IMG/shop8.1.jpg', '/IMG/shop8.2.jpg', '/IMG/shop8.3.jpg'] }
];

let cart = [];
let currentImageIndex = 0;

// ==================== ФУНКЦИЯ ВАЛИДАЦИИ ТЕЛЕФОНА ====================
function validatePhoneNumber(phone) {
    // Удаляем все пробелы, дефисы, скобки и другие разделители
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    
    // Регулярное выражение для белорусских номеров:
    // Варианты:
    // +375 XX XXXXXXX
    // 375 XX XXXXXXX
    // 8 029 XXXXXXX
    // 8029 XXXXXXX
    // 29 XXXXXXX (без кода страны)
    const patterns = [
        /^\+375(29|33|44|25|17)\d{7}$/,      // +375XX XXXXXXX
        /^375(29|33|44|25|17)\d{7}$/,        // 375XX XXXXXXX
        /^8(029|033|044|025|017)\d{7}$/,     // 8XXX XXXXXXX
        /^(29|33|44|25|17)\d{7}$/            // XX XXXXXXX (без кода)
    ];
    
    for (let pattern of patterns) {
        if (pattern.test(cleaned)) {
            return true;
        }
    }
    return false;
}

// Функция форматирования номера телефона при вводе (для удобства пользователя)
function formatPhoneOnInput(input) {
    let value = input.value.replace(/\D/g, ''); // оставляем только цифры
    
    // Если начинается с 8 или 3 (код страны)
    if (value.startsWith('8') && value.length <= 11) {
        // 8 029 123 45 67
        if (value.length > 3) {
            value = value.slice(0, 1) + ' ' + value.slice(1, 4) + ' ' + value.slice(4, 7) + ' ' + value.slice(7, 9) + ' ' + value.slice(9, 11);
        } else if (value.length > 1) {
            value = value.slice(0, 1) + ' ' + value.slice(1);
        }
    } 
    else if (value.startsWith('375') && value.length <= 12) {
        // +375 29 123 45 67
        if (value.length > 3) {
            value = '+' + value.slice(0, 3) + ' ' + value.slice(3, 5) + ' ' + value.slice(5, 8) + ' ' + value.slice(8, 10) + ' ' + value.slice(10, 12);
        } else {
            value = '+' + value;
        }
    }
    else if (value.length > 0 && value.length <= 9) {
        // 29 123 45 67
        if (value.length > 2) {
            value = value.slice(0, 2) + ' ' + value.slice(2, 5) + ' ' + value.slice(5, 7) + ' ' + value.slice(7, 9);
        }
    }
    
    input.value = value.trim();
}

// Показать ошибку для поля
function showError(input, message) {
    // Удаляем старую ошибку, если есть
    const existingError = input.parentElement.querySelector('.error-message');
    if (existingError) existingError.remove();
    
    input.style.border = '1px solid #e85d3a';
    input.style.backgroundColor = '#fff5f3';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = '#e85d3a';
    errorDiv.style.fontSize = '12px';
    errorDiv.style.marginTop = '-8px';
    errorDiv.style.marginBottom = '12px';
    errorDiv.style.paddingLeft = '18px';
    errorDiv.innerText = message;
    
    input.parentElement.insertBefore(errorDiv, input.nextSibling);
}

// Убрать ошибку с поля
function clearError(input) {
    const existingError = input.parentElement.querySelector('.error-message');
    if (existingError) existingError.remove();
    
    input.style.border = '1px solid #e8dfda';
    input.style.backgroundColor = '';
}

// ==================== CART FUNCTIONS ====================
function updateCartUI() {
    const cartItemsDiv = document.getElementById('cartItems');
    const cartTotalSpan = document.getElementById('cartTotal');
    const cartCountSpan = document.getElementById('cartCount');
    
    if (!cartItemsDiv) return;
    
    cartItemsDiv.innerHTML = '';
    let total = 0;
    
    cart.forEach((item, idx) => {
        total += item.price * item.quantity;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div>
                <strong>${item.name}</strong>
                <div style="display:flex; gap:8px; margin-top:8px;">
                    <button class="qty-btn" data-index="${idx}" data-delta="-1">−</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" data-index="${idx}" data-delta="1">+</button>
                </div>
            </div>
            <strong>${item.price * item.quantity} BYN</strong>
        `;
        cartItemsDiv.appendChild(div);
    });
    
    document.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const idx = parseInt(btn.dataset.index);
            const delta = parseInt(btn.dataset.delta);
            if (cart[idx].quantity + delta <= 0) {
                cart.splice(idx, 1);
            } else {
                cart[idx].quantity += delta;
            }
            updateCartUI();
        });
    });
    
    if (cartTotalSpan) cartTotalSpan.innerText = total + ' BYN';
    if (cartCountSpan) cartCountSpan.innerText = cart.reduce((s, i) => s + i.quantity, 0);
}

function addToCart(product) {
    const existing = cart.find(i => i.name === product.name);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCartUI();
}

// ==================== MODAL FUNCTIONS ====================
function openModal(product) {
    currentImageIndex = 0;
    const modal = document.getElementById('productModal');
    const modalContent = document.getElementById('modalContent');
    const gallery = product.gallery || [product.image];
    
    if (!modal || !modalContent) return;
    
    modalContent.innerHTML = `
        <button class="close-modal" id="closeModalBtn">✕</button>
        <div class="modal-gallery" style="position:relative;">
            <button class="slide-btn slide-left" id="slideLeftBtn">‹</button>
            <img class="main-img" id="modalMainImg" src="${gallery[0]}">
            <button class="slide-btn slide-right" id="slideRightBtn">›</button>
            <div class="thumbnails" id="thumbnailsContainer"></div>
        </div>
        <div class="modal-info">
            <h2>${product.name}</h2>
            <div class="modal-price">${product.price} BYN</div>
            <p class="modal-text">${product.description}<br><br>Премиальные материалы, безопасность и комфорт для вашего питомца. Рекомендовано кинологами Pivot Point.</p>
            <div class="features">
                <div class="feature">✓ Сертифицированное качество</div>
                <div class="feature">✓ Протестировано собаками</div>
                <div class="feature">✓ Быстрая доставка</div>
            </div>
        </div>
    `;
    
    const thumbContainer = document.getElementById('thumbnailsContainer');
    gallery.forEach((src, i) => {
        const thumb = document.createElement('img');
        thumb.src = src;
        thumb.classList.add('thumb');
        if (i === currentImageIndex) thumb.classList.add('active-thumb');
        thumb.addEventListener('click', () => {
            currentImageIndex = i;
            updateModalImage(gallery);
        });
        thumbContainer.appendChild(thumb);
    });
    
    const updateModalImage = (g) => {
        const main = document.getElementById('modalMainImg');
        const thumbs = document.querySelectorAll('.thumb');
        if (main && g[currentImageIndex]) main.src = g[currentImageIndex];
        thumbs.forEach((t, idx) => {
            if (idx === currentImageIndex) t.classList.add('active-thumb');
            else t.classList.remove('active-thumb');
        });
    };
    
    document.getElementById('slideLeftBtn').onclick = () => {
        if (gallery.length) {
            currentImageIndex = (currentImageIndex - 1 + gallery.length) % gallery.length;
            updateModalImage(gallery);
        }
    };
    
    document.getElementById('slideRightBtn').onclick = () => {
        if (gallery.length) {
            currentImageIndex = (currentImageIndex + 1) % gallery.length;
            updateModalImage(gallery);
        }
    };
    
    document.getElementById('closeModalBtn').onclick = () => modal.classList.remove('active');
    modal.classList.add('active');
}

// ==================== RENDER PRODUCTS ====================
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    products.forEach((p, idx) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image"><img src="${p.image}" alt="${p.name}"></div>
            <div class="product-info">
                <div class="product-category">PREMIUM</div>
                <div class="product-title">${p.name}</div>
                <div class="product-desc">${p.description}</div>
                <div class="product-bottom">
                    <div class="price">${p.price} BYN</div>
                    <button class="add-cart">В корзину</button>
                </div>
            </div>
        `;
        
        const cartBtn = card.querySelector('.add-cart');
        cartBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            addToCart(p);
            cartBtn.innerText = '✔';
            setTimeout(() => cartBtn.innerText = 'В корзину', 700);
        });
        
        card.addEventListener('click', () => openModal(p));
        grid.appendChild(card);
        
        if (idx === 3) {
            const banner = document.createElement('div');
            banner.className = 'wide-banner';
            banner.innerHTML = `
                <div class="banner-content">
                    <h2>Больше, чем просто аксессуары</h2>
                    <p>Каждый товар создан с любовью и одобрен кинологами Pivot Point. Доставка по всей Беларуси. Надёжность и стиль для вашего питомца.</p>
                </div>
            `;
            grid.appendChild(banner);
        }
    });
    
    initScrollAnimations();
}

// ==================== SCROLL ANIMATIONS ====================
function initScrollAnimations() {
    setTimeout(() => {
        const animatedElements = document.querySelectorAll('.product-card, .section-title, .section-sub, .wide-banner');
        
        if (window.scrollObserver) {
            window.scrollObserver.disconnect();
        }
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -20px 0px' });
        
        animatedElements.forEach(el => observer.observe(el));
        window.scrollObserver = observer;
        
        animatedElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                el.classList.add('visible');
                observer.unobserve(el);
            }
        });
    }, 100);
}

// ==================== EVENT LISTENERS ====================
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartUI();
    
    // Бургер-меню
    const burger = document.getElementById('burger');
    const nav = document.querySelector('nav');
    if (burger && nav) {
        burger.addEventListener('click', () => nav.classList.toggle('active'));
    }
    
    // Корзина toggle
    const cartToggle = document.getElementById('cartToggle');
    const cartBox = document.getElementById('cartBox');
    if (cartToggle && cartBox) {
        cartToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            cartBox.style.display = cartBox.style.display === 'block' ? 'none' : 'block';
        });
        
        document.addEventListener('click', (e) => {
            if (!cartToggle.contains(e.target) && !cartBox.contains(e.target) && cartBox.style.display === 'block') {
                cartBox.style.display = 'none';
            }
        });
    }
    
    // Закрытие модального окна по клику на фон
    const modalOverlay = document.getElementById('productModal');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) modalOverlay.classList.remove('active');
        });
    }
    
    // ==================== ФОРМА ОФОРМЛЕНИЯ С ВАЛИДАЦИЕЙ ТЕЛЕФОНА ====================
    const checkoutForm = document.getElementById('checkoutForm');
    const successModal = document.getElementById('successModal');
    const closeSuccess = document.getElementById('closeSuccess');
    
    if (checkoutForm) {
        const nameInput = checkoutForm.querySelector('input[placeholder="ФИО"]');
        const addressInput = checkoutForm.querySelector('input[placeholder="Адрес доставки"]');
        const phoneInput = checkoutForm.querySelector('input[placeholder="Телефон"]');
        
        // Добавляем маску/форматирование телефона при вводе
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                formatPhoneOnInput(this);
                clearError(this);
            });
            
            phoneInput.addEventListener('blur', function() {
                const cleaned = this.value.replace(/[\s\-\(\)\+]/g, '');
                if (cleaned.length > 0 && cleaned.length < 9) {
                    showError(this, 'Введите полный номер телефона');
                } else if (cleaned.length > 0 && !validatePhoneNumber(this.value)) {
                    showError(this, 'Введите корректный номер телефона (пример: +375 29 123 45 67 или 8029 123 45 67)');
                } else if (validatePhoneNumber(this.value)) {
                    clearError(this);
                }
            });
        }
        
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isValid = true;
            
            // Проверка имени
            if (!nameInput || nameInput.value.trim().length < 2) {
                if (nameInput) showError(nameInput, 'Введите ваше полное имя');
                isValid = false;
            } else if (nameInput) {
                clearError(nameInput);
            }
            
            // Проверка адреса
            if (!addressInput || addressInput.value.trim().length < 5) {
                if (addressInput) showError(addressInput, 'Введите полный адрес доставки');
                isValid = false;
            } else if (addressInput) {
                clearError(addressInput);
            }
            
            // Проверка телефона
            if (!phoneInput || !validatePhoneNumber(phoneInput.value)) {
                if (phoneInput) showError(phoneInput, 'Введите корректный номер телефона (пример: +375 29 123 45 67)');
                isValid = false;
            } else if (phoneInput) {
                clearError(phoneInput);
            }
            
            // Проверка корзины
            if (cart.length === 0) {
                alert('Корзина пуста. Добавьте товары перед оформлением заказа.');
                isValid = false;
            }
            
            if (isValid) {
                // Формируем данные заказа
                const orderData = {
                    name: nameInput.value.trim(),
                    address: addressInput.value.trim(),
                    phone: phoneInput.value.trim(),
                    items: cart.map(item => ({ name: item.name, quantity: item.quantity, price: item.price })),
                    total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
                    date: new Date().toLocaleString('ru-RU')
                };
                
                console.log('Заказ оформлен:', orderData);
                
                // Очищаем корзину
                cart = [];
                updateCartUI();
                checkoutForm.reset();
                
                // Закрываем корзину и показываем модалку успеха
                if (cartBox) cartBox.style.display = 'none';
                if (successModal) successModal.classList.add('active');
            }
        });
    }
    
    if (closeSuccess && successModal) {
        closeSuccess.addEventListener('click', () => successModal.classList.remove('active'));
    }
});

