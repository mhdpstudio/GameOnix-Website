export function initGameSearch({
    containerId,
    searchInputId,
    allGamesData,
    websiteName = "GameOnix"
}) {
    const container = document.getElementById(containerId);
    const searchBox = document.getElementById(searchInputId);

    // --- NEW: check if game is recent (36h) ---
    function isNewGame(gameDate) {
        if (!gameDate) return false;

        const gameTime = new Date(gameDate).getTime();
        const now = Date.now();

        const diffHours = (now - gameTime) / (1000 * 60 * 60);

        return diffHours <= 36;
    }


    // --- استخراج الألعاب ---
    function extractAllGames(data) {
        if (!data) return [];

        if (Array.isArray(data)) {
            return data.filter(g => g.title && g.title !== "More Games");
        }

        let allGames = [];

        console.log("Parsing data structure...", data);

        try {
            Object.values(data).forEach(mainSection => {
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

        const uniqueGames = Array.from(
            new Map(allGames.map(game => [game.slug, game])).values()
        );

        return uniqueGames.filter(g => g.title && g.title !== "More Games");
    }


    const sortedGames = extractAllGames(allGamesData).sort((a, b) =>
        a.title.localeCompare(b.title)
    );

    console.log("✅ Final Games List Created:", sortedGames.length, "games found.");


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
        searchBox.addEventListener("input", (e) =>
            performSearch(e.target.value)
        );
    }


    function render(list, query = "") {
        if (!container) return;

        if (list.length === 0) {
            container.innerHTML = `
                <div class="no-results" style="grid-column: 1/-1; text-align: center; padding: 50px;">
                    <i class="fa-solid fa-face-frown fa-3x" style="color: #695CFE;"></i>
                    <p style="margin-top: 20px; font-size: 1.2rem;">
                        No games found matching "<strong>${query}</strong>".
                    </p>
                    <p style="opacity: 0.7;">Check spelling or try common names like 'GTA' or 'FIFA'.</p>
                </div>`;
            return;
        }

        container.innerHTML = list.map(game => {
            const isNew = isNewGame(game.date);

            return `
                <div class="game-card" data-slug="${game.slug}">
                    <div class="game-details" style="position: relative;">

                        ${isNew ? `<div class="badge-new">New</div>` : ""}

                        <img 
                            src="${game.poster ? game.poster + ".webp" : '../../assets/images/game.jpg'}" 
                            alt="${game.title}" 
                            onerror="this.src='../../assets/images/game.jpg'"
                        >

                        <div class="publisher">${game.publisher || websiteName}</div>
                        <div class="title">${game.title}</div>
                    </div>
                </div>
            `;
        }).join('');

        container.querySelectorAll(".game-card").forEach(card => {
            card.addEventListener("click", () => {
                window.location.href = `game.html?game=${encodeURIComponent(card.dataset.slug)}`;
            });
        });
    }
}