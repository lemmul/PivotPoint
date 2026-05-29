// ==================== ЕДИНЫЙ JS ДЛЯ СТРАНИЦЫ ПЕРСОНАЛ ====================
document.addEventListener('DOMContentLoaded', () => {
    // ---------- 1. Бургер-меню ----------
    const burger = document.getElementById('burger');
    const nav = document.querySelector('nav');
    if (burger && nav) {
        burger.addEventListener('click', () => nav.classList.toggle('active'));
    }

    // ---------- 2. Загрузка и отрисовка карточек из XML ----------
    const staffGrid = document.getElementById('staffGrid');
    if (!staffGrid) return;

    async function loadAndRenderStaff() {
        try {
            const response = await fetch('xml/personal.xml');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const xmlText = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
            
            // Проверка на ошибку парсинга
            if (xmlDoc.querySelector('parsererror')) throw new Error('Ошибка парсинга XML');
            
            const members = xmlDoc.querySelectorAll('member');
            if (members.length === 0) {
                staffGrid.innerHTML = '<p style="text-align:center;">Нет данных о сотрудниках</p>';
                return;
            }

            staffGrid.innerHTML = ''; // очищаем

            members.forEach(member => {
                const reverse = member.getAttribute('reverse') === 'true';
                const photo = member.querySelector('photo')?.textContent || '';
                const role = member.querySelector('role')?.textContent || '';
                const name = member.querySelector('name')?.textContent || '';
                const age = member.querySelector('age')?.textContent || '';
                const description = member.querySelector('description')?.textContent || '';
                const tags = Array.from(member.querySelectorAll('tag')).map(tag => tag.textContent);

                const card = document.createElement('div');
                card.className = 'staff-card';
                if (reverse) card.classList.add('reverse');

                const photoDiv = document.createElement('div');
                photoDiv.className = 'staff-photo';
                const img = document.createElement('img');
                img.src = photo;
                img.alt = name;
                img.loading = 'lazy';
                photoDiv.appendChild(img);

                const contentDiv = document.createElement('div');
                contentDiv.className = 'staff-content';
                contentDiv.innerHTML = `
                    <div class="staff-role">${escapeHtml(role)}</div>
                    <h2>${escapeHtml(name)}</h2>
                    <div class="staff-age">${escapeHtml(age)}</div>
                    <p>${escapeHtml(description)}</p>
                    <div class="staff-tags">${tags.map(tag => `<span>${escapeHtml(tag)}</span>`).join('')}</div>
                `;

                card.appendChild(photoDiv);
                card.appendChild(contentDiv);
                staffGrid.appendChild(card);
            });

            // После отрисовки карточек — запускаем анимации
            initScrollAnimations();

        } catch (error) {
            console.error('Ошибка загрузки персонала:', error);
            staffGrid.innerHTML = '<p style="text-align:center; color:#b9121b;">Не удалось загрузить данные о сотрудниках. Проверьте файл personal.xml.</p>';
        }
    }

    // ---------- 3. Анимации при скролле (Intersection Observer) ----------
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.staff-card, .quote-block');
        if (animatedElements.length === 0) return;

        // Если уже есть наблюдатель — отключаем старый (чтобы не дублировать)
        if (window.scrollObserver) window.scrollObserver.disconnect();

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -20px 0px' });

        animatedElements.forEach(el => observer.observe(el));
        window.scrollObserver = observer; // сохраняем на случай повторного вызова

        // Проверка уже видимых элементов (например, если страница загрузилась с прокруткой)
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

    // ---------- 4. Вспомогательная функция для защиты от XSS ----------
    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }

    // ---------- 5. Старт загрузки ----------
    loadAndRenderStaff();
});