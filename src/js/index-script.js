import { initGameSearch } from "./search-script.js";

const container = document.getElementById("games-container");
const WebsiteName = "GameOnix";

function updateControlsPosition() {
    const sidebar = document.querySelector('.sb');
    const isOpen = !sidebar.classList.contains('closed');
    const sidebarWidth = sidebar.offsetWidth;

    document.querySelectorAll('.section-controls').forEach(ctrl => {
        ctrl.style.right = isOpen ? (sidebarWidth + 40) + 'px' : "150px";
    });

    document.querySelectorAll('.section').forEach(sec => {
        sec.style.paddingRight = isOpen ? "170px" : "20px";
    });
}

const searchBox = document.getElementById('searchBox');
if (searchBox) {
    searchBox.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchBox.value.trim();
            if (query) {
                window.location.href = `html/search-results.html?q=${encodeURIComponent(query)}`;
            }
        }
    });
}

fetch('https://www.gameonix.shop/data/json/games.json')
.then(res => res.json())
.then(data => {

    for (const mainSectionName in data) {

        const mainSection = data[mainSectionName];

        // عرض اسم القسم الرئيسي
        const mainTitle = document.createElement("h1");
        mainTitle.classList.add("main-section-title");

        mainTitle.innerHTML = `
            ${mainSection.icon ? `<i class="${mainSection.icon}"></i>` : ''}
            ${mainSectionName}
            <i class="fa-solid fa-chevron-right"></i>
        `;

        container.appendChild(mainTitle);

        for (const subSectionName in mainSection) {

            if (subSectionName === "icon") continue;

            const section = mainSection[subSectionName];
            const games = section.games || [];

            const sectionDiv = document.createElement("div");
            sectionDiv.classList.add("section-container");

            const maxHomeIndex = games.findIndex(g => g.title === "More Games");
            const homeGames = maxHomeIndex !== -1 ? games.slice(0, maxHomeIndex) : games;

            sectionDiv.innerHTML = `
            <div class="section-wrapper">

                <div class="section-header">
                    <h2 class="sec-style">
                        <a class="sec-txt" data-section="${subSectionName}">
                            ${section.icon ? `<i class="fa-solid ${section.icon}"></i>` : ''}
                            ${subSectionName}
                            <i class="fa-solid fa-chevron-right"></i>
                        </a>
                    </h2>
                </div>

                <div class="section-controls">
                    <i class="fa-solid fa-chevron-left fa scroll-btn left"></i>
                    <i class="fa-solid fa-chevron-right fa scroll-btn right"></i>
                </div>

                <div class="section">
                    ${homeGames.map(game => `
                        <div class="game-card" data-slug="${game.slug}">
                            <div class="game-details">
                                <img src="${game.poster ? game.poster + ".jpg" : '../../assets/images/game.jpg'}" alt="${game.title}">
                                <div class="publisher">${game.publisher || WebsiteName}</div>
                                <div class="title">${game.title}</div>
                            </div>
                        </div>
                    `).join('')}

                    ${maxHomeIndex !== -1 ? `
                        <div class="game-card more-games">
                            <div class="game-details">
                                <i class="fa-solid fa-arrow-right fa-3x" style="color: var(--color-text-primary);"></i>
                                <div class="title">More Games</div>
                            </div>
                        </div>
                    ` : ''}
                </div>

            </div>
            `;

            container.appendChild(sectionDiv);

            sectionDiv.querySelector(".sec-txt").addEventListener("click", () => {
                const sectionNameEncoded = encodeURIComponent(subSectionName);
                window.location.href = `html/section.html?section=${sectionNameEncoded}`;
            });

            sectionDiv.querySelectorAll(".more-games").forEach(btn => {
                btn.addEventListener("click", () => {
                    const sectionNameEncoded = encodeURIComponent(subSectionName);
                    window.location.href = `html/section.html?section=${sectionNameEncoded}`;
                });
            });

            sectionDiv.querySelectorAll(".game-card").forEach(card => {
                if (!card.classList.contains("more-games")) {
                    card.addEventListener("click", () => {
                        const slug = card.dataset.slug;
                        window.location.href = `html/game.html?game=${encodeURIComponent(slug)}`;
                    });
                }
            });

            const slider = sectionDiv.querySelector(".section");
            const btnLeft = sectionDiv.querySelector(".scroll-btn.left");
            const btnRight = sectionDiv.querySelector(".scroll-btn.right");
            const controls = sectionDiv.querySelector(".section-controls");

            const firstCard = slider.querySelector(".game-card");

            if (firstCard) {

                const cardWidth = firstCard.offsetWidth;
                const gap = 15;
                const scrollAmount = cardWidth + gap;

                btnRight.addEventListener("click", () => slider.scrollLeft += scrollAmount);
                btnLeft.addEventListener("click", () => slider.scrollLeft -= scrollAmount);

                function updateControlsVisibility() {
                    controls.style.display = slider.scrollWidth > slider.clientWidth ? "flex" : "none";
                }

                updateControlsVisibility();

                window.addEventListener("resize", () => {
                    updateControlsVisibility();
                    updateControlsPosition();
                });
            }

        }

    }

    updateControlsPosition();

    document.querySelectorAll('.sb-toggle').forEach(btn => {
        btn.addEventListener('click', () => setTimeout(updateControlsPosition, 400));
    });

})
.catch(err => console.error(err));