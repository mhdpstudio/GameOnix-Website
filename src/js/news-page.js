async function generateArticle() {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');
    const container = document.getElementById('game-news-page');

    if (!slug) {
        container.innerHTML = "<h2>Article not found</h2>";
        return;
    }

    try {
        const response = await fetch('https://mhdpstudio.github.io/GameOnix-Website/data/json/news-data-main.json');
        const data = await response.json();
        const article = data.find(item => item.slug === slug);

        if (!article) {
            container.innerHTML = "<h2>Article not found</h2>";
            return;
        }

        document.title = `GameOnix | ${article.title}`;

        container.innerHTML = `
    <div class="article-hero scroll-reveal">
        <a href="games-news.html" class="hero-back-btn">
            <span class="material-symbols-rounded">arrow_back</span>
        </a>

        <img src="${article.image}" class="hero-bg" alt="${article.title}">
        <div class="hero-overlay"></div>
        
        <div class="hero-content">
            <span class="tag">${article.category}</span>
            <h1 class="article-title">${article.title}</h1>
            <div class="hero-info-grid">
                <div class="info-item">
                    <span class="label">RELEASING IN</span>
                    <span class="value">${article.release_date || 'Published'}</span>
                </div>
                <div class="info-item">
                    <span class="label">PUBLISHER</span>
                    <span class="value">${article.pub}</span>
                </div>
            </div>
        </div>
    </div>

    <div class="article-details-row scroll-reveal">
        <div class="description-column">
            <h2 class="description-heading"><i class="fa-solid fa-eye"></i> Overview</h2>
            <p class="description-paragraph">${article.description || article.excerpt}</p>
        </div>

        <div class="epic-table-column">
            <h2 class="description-heading"><i class="fa-solid fa-list-check"></i> Details</h2>
            <div class="epic-details-table">
                <div class="detail-row">
                    <span class="detail-label"><i class="fa-solid fa-database"></i> Size</span>
                    <span class="detail-value">${article.size || 'TBA'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label"><i class="fa-solid fa-display-code"></i> Developer</span>
                    <span class="detail-value">${article.developer || article.pub}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label"><i class="fa-solid fa-layer-group"></i> Platform</span>
                    <span class="detail-value"><i class="fa-brands fa-windows"></i> <i class="fa-brands fa-playstation"></i> <i class="fa-brands fa-xbox"></i></span>
                </div>
                                <div class="detail-row">
                    <span class="detail-label"><i class="fa-solid fa-symbols"></i> Category</span>
                    <span class="detail-value">${article.cate || 'TBA'}</span>
                </div>
            </div>
        </div>
    </div>

    <div class="article-body-container scroll-reveal">
        <div class="article-text-full">
            ${article.content}
        </div>
    </div>
`;

        setTimeout(() => {
            document.querySelectorAll('.scroll-reveal').forEach(el => el.classList.add('active'));
        }, 100);

    } catch (err) {
        console.error("Error loading article:", err);
    }
}

window.onload = generateArticle;