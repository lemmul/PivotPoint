// ==================== Burger Menu Toggle ====================
const burger = document.getElementById('burger');
const nav = document.querySelector('nav');

if (burger && nav) {
    burger.addEventListener('click', () => {
        nav.classList.toggle('active');
    });
}

// ==================== FAQ Accordion ====================
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const answer = question.nextElementSibling;
        if (answer.style.maxHeight) {
            answer.style.maxHeight = null;
        } else {
            answer.style.maxHeight = answer.scrollHeight + 'px';
        }
    });
});

// ==================== Dog Mode (WOOF-WOOF Button + Video) ====================
const woofBtn = document.getElementById('woofBtn');
const mediaBlocks = document.querySelectorAll('.media-block');


const modeText = document.createElement('div');
modeText.className = 'dog-mode-text';
document.body.appendChild(modeText);

if (woofBtn) {
    woofBtn.addEventListener('click', (e) => {
        e.preventDefault();
        document.body.classList.toggle('dog-mode');
        
        const isDogMode = document.body.classList.contains('dog-mode');
        
        if (isDogMode) {
            woofBtn.innerHTML = '🐾 DOG MODE';
            modeText.innerHTML = '🐶 DOG MODE ACTIVATED';
           
            mediaBlocks.forEach(block => {
                block.classList.add('active-video');
                const video = block.querySelector('video');
                if (video) {
                    video.play().catch(e => console.log('Video play failed:', e));
                }
            });
        } else {
            woofBtn.innerHTML = 'WOOF-WOOF!';
            modeText.innerHTML = '❌ DOG MODE DISABLED';
            
            mediaBlocks.forEach(block => {
                block.classList.remove('active-video');
                const video = block.querySelector('video');
                if (video) {
                    video.pause();
                    video.currentTime = 0;
                }
            });
        }
        
        modeText.classList.add('active');
        setTimeout(() => modeText.classList.remove('active'), 2200);
    });
}

// ==================== Ask Question Form (с добавлением карточки вопроса) ====================
const askForm = document.querySelector('.question-form');
if (askForm) {
    // Находим родительский контейнер для карточек
    const formContainer = askForm.parentElement;
    const resultBlock = document.createElement('div');
    resultBlock.style.marginTop = '30px';
    resultBlock.style.display = 'flex';
    resultBlock.style.flexDirection = 'column';
    resultBlock.style.gap = '16px';
    formContainer.appendChild(resultBlock);
    
    askForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nameInput = askForm.querySelector('input[type="text"]');
        const emailInput = askForm.querySelector('input[type="email"]');
        const messageTextarea = askForm.querySelector('textarea');
        
        const name = nameInput ? nameInput.value : '';
        const email = emailInput ? emailInput.value : '';
        const message = messageTextarea ? messageTextarea.value : '';
        
        if (!name || !email || !message) return;
        
        const card = document.createElement('div');
        card.style.background = 'rgba(255,255,255,0.12)';
        card.style.backdropFilter = 'blur(10px)';
        card.style.border = '1px solid rgba(255,255,255,0.1)';
        card.style.borderRadius = '18px';
        card.style.padding = '20px';
        card.style.color = 'white';
        card.innerHTML = `
            <h3 style="margin-bottom:10px; font-size:20px;">${escapeHtml(name)}</h3>
            <p style="opacity:0.7; margin-bottom:14px; font-size:14px;">${escapeHtml(email)}</p>
            <p style="line-height:1.6; font-size:16px;">${escapeHtml(message)}</p>
        `;
        
        resultBlock.prepend(card);
        askForm.reset();
    });
}

// Простая защита от XSS
function escapeHtml(str) {
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    }).replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, function(c) {
        return c;
    });
}

// ==================== Scroll Animations (Intersection Observer) ====================
const animatedSections = document.querySelectorAll(
    '.creative-hero, .about-wrapper, .services .grid, .advantages-header, .advantages-grid, .reviews, .faq-container, .ask-question, .footer-content'
);

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            scrollObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -20px 0px' });

animatedSections.forEach(section => {
    scrollObserver.observe(section);
});

// Для элементов, которые уже видны при загрузке страницы
setTimeout(() => {
    animatedSections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            section.classList.add('visible');
            scrollObserver.unobserve(section);
        }
    });
}, 200);