import { initGameSearch } from "./search-script.js";

const params = new URLSearchParams(window.location.search);
const sectionName = params.get("section");
const sectionLabel = document.getElementById("section-text");
const WebsiteName = "GameOnix";


// --- Lazy Load Images (NEW) ---
function lazyLoadImages(root = document) {
    const imgs = root.querySelectorAll('img[data-src]:not([data-observed])');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;

                // preload
                const temp = new Image();
                temp.src = img.dataset.src;

                temp.onload = () => {
                    img.src = temp.src;
                    img.classList.remove('lazy-img');
                };

                temp.onerror = () => {
                    img.src = '../../assets/images/game.jpg';
                };

                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: "200px"
    });

    imgs.forEach(img => {
        img.setAttribute('data-observed', 'true');
        observer.observe(img);
    });
}


// دالة العرض
function renderInitialGames(games, containerId) {
    const container = document.getElementById(containerId);

    if (!games || games.length === 0) {
        container.innerHTML = `<div class="no-results"><p>No games available in this section.</p></div>`;
        return;
    }

    container.innerHTML = "";

    const fragment = document.createDocumentFragment();

    games.forEach(game => {
        const div = document.createElement("div");
        div.className = "game-card";
        div.dataset.slug = game.slug;
        div.style.cursor = "pointer";

        div.innerHTML = `
            <div class="game-details">
                <img 
                    src="../../assets/images/game.jpg"
                    data-src="${game.poster ? game.poster + ".webp" : '../../assets/images/game.jpg'}"
                    alt="${game.title}"
                    onerror="this.src='../../assets/images/game.jpg'"
                >
                <div class="publisher">${game.publisher || WebsiteName}</div>
                <div class="title">${game.title}</div>
            </div>
        `;

        fragment.appendChild(div);
    });

    container.appendChild(fragment);

    // events
    container.querySelectorAll('.game-card').forEach(card => {
        card.addEventListener('click', () => {
            const slug = card.dataset.slug;
            if (slug) window.location.href = `game.html?game=${encodeURIComponent(slug)}`;
        });
    });

}


async function loadSectionGames() {
    try {
        const params = new URLSearchParams(window.location.search);
        const sectionName = params.get("section");
        const platform = params.get("type");

        const response = await fetch('../../data/json/games.json');
        const data = await response.json();

        let gamesData = null;
        let displayType = "";

        if (platform === "PS") {
            gamesData = data["Playstation Games"]?.[sectionName];
            displayType = "PS";
        } else if (platform === "PC") {
            gamesData = data["Desktop Games"]?.[sectionName];
            displayType = "PC";
        } else {
            if (data["Desktop Games"][sectionName]) {
                gamesData = data["Desktop Games"][sectionName];
                displayType = "PC";
            } else {
                gamesData = data["Playstation Games"][sectionName];
                displayType = "PS";
            }
        }

        if (!gamesData) {
            console.error("Section not found in JSON");
            return;
        }

        document.title = `${WebsiteName} | ${sectionName} | ${displayType}`;
        window.titleBarPageName = `${sectionName} | ${displayType}`;
        if (window.renderTitleBar) {
            window.renderTitleBar();
        }

        const sectionLabel = document.getElementById("section-text");
        if (sectionLabel) {
            const icon = gamesData.icon || "fa-gamepad";
            sectionLabel.innerHTML = `
                <div class="section-label" style="cursor: pointer;" onclick="window.history.back()">
                    <i class="fa-solid fa-arrow-left"></i> 
                    <i class="fa-solid ${icon}"></i> 
                    ${sectionName} Games
                </div>
            `;
        }

        let gamesArray = gamesData.games || [];

        gamesArray = gamesArray.filter(game =>
            game.title?.toLowerCase() !== "more games"
        );

        gamesArray.sort((a, b) =>
            a.title.localeCompare(b.title)
        );

        renderInitialGames(gamesArray, "section-games");

        initGameSearch({
            containerId: "section-games",
            searchInputId: "searchBox",
            allGamesData: gamesArray,
            websiteName: WebsiteName
        });

    } catch (error) {
        console.error('Error loading JSON:', error);
    }
}

loadSectionGames();