export function initGameSearch({
    containerId,
    searchInputId,
    allGamesData,
    websiteName = "GameOnix"
}) {
    const container = document.getElementById(containerId);
    const searchBox = document.getElementById(searchInputId);

    // دالة استخراج الألعاب المحسنة جداً
    function extractAllGames(data) {
        if (!data) return [];
        let allGames = [];
        
        console.log("Parsing data structure...", data);

        try {
            // بنلف على الأقسام الكبيرة (PC Games, PS Games)
            Object.values(data).forEach(mainSection => {
                // بنلف على الأقسام الفرعية (Action, Racing, etc.)
                for (const key in mainSection) {
                    if (key !== "icon" && mainSection[key].games) {
                        const gamesArray = mainSection[key].games;
                        if (Array.isArray(gamesArray)) {
                            allGames = allGames.concat(gamesArray);
                        }
                    }
                }
            });
        } catch (e) {
            console.error("Critical error during extraction:", e);
        }

        // إزالة التكرار بناءً على الـ slug وضمان وجود title
        const uniqueGames = Array.from(new Map(allGames.map(game => [game.slug, game])).values());
        return uniqueGames.filter(g => g.title && g.title !== "More Games");
    }

    const sortedGames = extractAllGames(allGamesData).sort((a, b) => 
        a.title.localeCompare(b.title)
    );

    console.log("✅ Final Games List Created:", sortedGames.length, "games found.");

    // منطق الـ URL والبحث
    const urlParams = new URLSearchParams(window.location.search);
    const initialQuery = urlParams.get('q') || "";

    if (initialQuery) {
        if (searchBox) searchBox.value = initialQuery;
        performSearch(initialQuery);
    } else {
        render(sortedGames);
    }

    function performSearch(keyword) {
        const cleanKeyword = keyword.toLowerCase().trim();
        const filtered = sortedGames.filter(game =>
            game.title.toLowerCase().includes(cleanKeyword) || 
            (game.publisher && game.publisher.toLowerCase().includes(cleanKeyword))
        );
        render(filtered, cleanKeyword);
    }

    if (searchBox) {
        searchBox.addEventListener("input", (e) => performSearch(e.target.value));
    }

    function render(list, query = "") {
        if (!container) return;
        
        if (list.length === 0) {
            container.innerHTML = `
                <div class="no-results" style="grid-column: 1/-1; text-align: center; padding: 50px;">
                    <i class="fa-solid fa-face-frown fa-3x" style="color: #695CFE;"></i>
                    <p style="margin-top: 20px; font-size: 1.2rem;">No games found matching "<strong>${query}</strong>".</p>
                    <p style="opacity: 0.7;">Check spelling or try common names like 'GTA' or 'FIFA'.</p>
                </div>`;
            return;
        }

        container.innerHTML = list.map(game => `
            <div class="game-card" data-slug="${game.slug}">
                <div class="game-details">
                    <img src="${game.poster ? game.poster + ".jpg" : '../assets/images/game.jpg'}" 
                         alt="${game.title}" 
                         onerror="this.src='../assets/images/game.jpg'">
                    <div class="publisher">${game.publisher || websiteName}</div>
                    <div class="title">${game.title}</div>
                </div>
            </div>
        `).join('');

        container.querySelectorAll(".game-card").forEach(card => {
            card.addEventListener("click", () => {
                window.location.href = `game.html?game=${encodeURIComponent(card.dataset.slug)}`;
            });
        });
    }
}