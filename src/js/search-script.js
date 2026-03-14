export function initGameSearch({
    containerId,
    searchInputId,
    games,
    websiteName = "GameOnix"
}) {

    const container = document.getElementById(containerId);
    const searchBox = document.getElementById(searchInputId);

    // تنظيف + ترتيب أبجدي احترافي
    const sortedGames = games
        .filter(g => g.title !== "More Games")
        .sort((a, b) => {
            const normalize = str =>
                str.replace(/^(a|an)\s+/i, '').trim();

            return normalize(a.title)
                .localeCompare(normalize(b.title), 'en', { sensitivity: 'base' });
        });

    render(sortedGames);

    // 🔍 البحث الفوري
    searchBox.addEventListener("input", () => {

        const keyword = searchBox.value.toLowerCase().trim();

        const filtered = sortedGames.filter(game =>
            game.title.toLowerCase().includes(keyword)
        );

        render(filtered);
    });

    // عرض الألعاب
    function render(list) {

        if (list.length === 0) {
            container.innerHTML = "<p>No games found</p>";
            return;
        }

        container.innerHTML = list.map(game => `
        <div class="game-card" data-slug="${game.slug}">
                <div class="game-details">
                    <img src="${game.poster}.jpg"
                         alt="${game.title}"
                         onerror="this.src='../../assets/images/game.jpg'">

                    <div class="publisher">
                        ${game.publisher || websiteName}
                    </div>

                    <div class="title">${game.title}</div>
                </div>
            </div>
        `).join('');

        container.querySelectorAll(".game-card").forEach(card => {
            card.addEventListener("click", () => {
                const slug = card.dataset.slug;
                if (!slug) return;
                window.location.href =
                    `game.html?game=${encodeURIComponent(slug)}`;
            });
        });
    }
}
