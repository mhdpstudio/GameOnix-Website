// 1. دالة العداد التنازلي (GTA VI Countdown)
function startGTACountdown() {
    const target = new Date('November 19, 2026 00:00:00').getTime();

    const timer = setInterval(() => {
        const now = new Date().getTime();
        const diff = target - now;

        if (diff > 0) {
            const d = Math.floor(diff / (1000 * 60 * 60 * 24));
            const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);

            // التأكد من وجود العناصر قبل التحديث لتجنب أخطاء Console
            if (document.getElementById('days')) {
                document.getElementById('days').innerText = d;
                document.getElementById('hours').innerText = h.toString().padStart(2, '0');
                document.getElementById('minutes').innerText = m.toString().padStart(2, '0');
                document.getElementById('seconds').innerText = s.toString().padStart(2, '0');
            }
        } else {
            clearInterval(timer);
            const countdownEl = document.getElementById('gta-countdown');
            if (countdownEl) countdownEl.innerHTML = "OUT NOW!";
        }
    }, 1000);
}

// 2. دالة تحميل الأخبار من الـ JSON
async function loadNews() {
    try {
        const response = await fetch('https://mhdpstudio.github.io/GameOnix-Website/data/json/news-data.json');
        const newsData = await response.json();
        const grid = document.getElementById('news-grid');

        if (!grid) return;

        newsData.forEach(item => {
            const card = document.createElement('div');
            card.className = 'news-card scroll-reveal';
            // جعل الكارت كله قابل للضغط
            card.style.cursor = 'pointer';
            card.onclick = () => {
                window.location.href = `game-news-page.html?slug=${item.slug}`;
            };

            card.innerHTML = `
        <img src="${item.image}" class="card-img" alt="${item.title}">
        <div class="card-body">
            <span class="tag">${item.category}</span>
            <div class="card-header">
                <h3>${item.title}</h3>
                <p class="card-pub">${item.pub}</p>
            </div>
            <p>${item.excerpt}</p>
            <span class="read-more-btn">INITIALIZE READ <i class="fa-solid fa-chevron-right"></i></span>
        </div>
    `;
            grid.appendChild(card);
        });

        setTimeout(reveal, 100);
    } catch (error) {
        console.error("Error loading news:", error);
    }

}

// 3. دالة التحريك عند السكرول
function reveal() {
    const reveals = document.querySelectorAll('.scroll-reveal');
    reveals.forEach(el => {
        const windowHeight = window.innerHeight;
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop < windowHeight - 50) {
            el.classList.add('active');
        }
    });
}

window.addEventListener('scroll', reveal);
window.onload = () => {
    loadNews();    
    startGTACountdown();
};