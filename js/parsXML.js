// ==================== ЗАГРУЗКА ДАННЫХ ПЕРСОНАЛА ИЗ XML ====================
(async function loadStaffFromXML() {
    const staffGrid = document.getElementById('staffGrid');
    if (!staffGrid) return;

    try {
        const response = await fetch('xml/personal.xml');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
        
        // Проверка на ошибки парсинга
        const parseError = xmlDoc.querySelector('parsererror');
        if (parseError) throw new Error('Ошибка парсинга XML');

        const members = xmlDoc.querySelectorAll('member');
        if (members.length === 0) {
            staffGrid.innerHTML = '<p style="text-align:center;">Нет данных о сотрудниках</p>';
            return;
        }

        // Очищаем контейнер перед вставкой
        staffGrid.innerHTML = '';

        members.forEach(member => {
            const reverse = member.getAttribute('reverse') === 'true';
            const photo = member.querySelector('photo')?.textContent || '';
            const role = member.querySelector('role')?.textContent || '';
            const name = member.querySelector('name')?.textContent || '';
            const age = member.querySelector('age')?.textContent || '';
            const description = member.querySelector('description')?.textContent || '';
            const tags = Array.from(member.querySelectorAll('tag')).map(tag => tag.textContent);

            // Создаём карточку
            const card = document.createElement('div');
            card.className = 'staff-card';
            if (reverse) card.classList.add('reverse');

            // Фото
            const photoDiv = document.createElement('div');
            photoDiv.className = 'staff-photo';
            const img = document.createElement('img');
            img.src = photo;
            img.alt = name;
            img.loading = 'lazy';
            photoDiv.appendChild(img);

            // Контент
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

        // Инициализируем повторную проверку видимости для новых карточек (если нужно)
        // Можно вызвать функцию из основного скрипта, но лучше просто подождать
        setTimeout(() => {
            const newCards = document.querySelectorAll('.staff-card');
            if (window.staffObserver) {
                newCards.forEach(card => window.staffObserver.observe(card));
            }
        }, 100);

    } catch (error) {
        console.error('Ошибка загрузки персонала:', error);
        staffGrid.innerHTML = '<p style="text-align:center; color:#b9121b;">Не удалось загрузить данные о сотрудниках. Проверьте файл personal.xml.</p>';
    }
})();

// Вспомогательная функция для защиты от XSS
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}