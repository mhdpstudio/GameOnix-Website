const container = document.getElementById("games-container");
const WebsiteName = "GameOnix";

// --- 1. تحسين موضع أزرار التحكم (Responsive Controls) ---
function updateControlsPosition() {
    const sidebar = document.querySelector('.sb');
    if (!sidebar) return;

    const isOpen = !sidebar.classList.contains('closed');
    const sidebarWidth = sidebar.offsetWidth;

    document.querySelectorAll('.section-controls').forEach(ctrl => {
        ctrl.style.right = isOpen ? (sidebarWidth + 40) + 'px' : "150px";
    });

    document.querySelectorAll('.section').forEach(sec => {
        sec.style.paddingRight = isOpen ? "170px" : "20px";
    });
}


// --- 2. جلب البيانات وعرضها ---
async function init() {
    const params = new URLSearchParams(window.location.search);
    const platform = params.get("type");

    try {
        const response = await fetch('../../data/json/games.json');
        const data = await response.json();

        let targetKey = platform === "PS" ? "Playstation Games" : "Desktop Games";
        let platformData = data[targetKey];

        let mainIcon = platformData.icon || (platform === "PS" ? "fa-brands fa-playstation" : "fa-solid fa-desktop");

        document.title = `${WebsiteName} | ${targetKey}`;
        window.titleBarPageName = targetKey;
        if (window.renderTitleBar) {
            window.renderTitleBar();
        }

        container.innerHTML = "";

        // العنوان الرئيسي
        const mainTitle = document.createElement("h1");
        mainTitle.className = "main-section-title";
        mainTitle.style.margin = "20px";
        mainTitle.innerHTML = `
            <div class="main-title" style="display: flex; align-items: center; gap: 12px;" onclick="window.history.back()">
                <i class="fa-solid fa-arrow-left" style="cursor:pointer; margin-left:10px;"></i>
                <i class="${mainIcon}"></i> 
                <span>${targetKey}</span>
            </div>
        `;
        container.appendChild(mainTitle);

        for (const subSectionName in platformData) {
            if (subSectionName === "icon") continue;

            const sectionData = platformData[subSectionName];
            const games = sectionData.games || [];
            if (games.length === 0) continue;

            const sectionDiv = document.createElement("div");
            sectionDiv.className = "section-container";

            const maxHomeIndex = games.findIndex(g => g.title === "More Games");
            const homeGames = maxHomeIndex !== -1 ? games.slice(0, maxHomeIndex) : games;

            sectionDiv.innerHTML = `
        <div class="section-wrapper">
            <div class="section-header">
                <h2 class="sec-style" style="cursor: pointer;">
                    <span class="sec-txt">
                        ${sectionData.icon ? `<i class="fa-solid ${sectionData.icon}"></i>` : ''}
                        <span>${subSectionName}</span>
                        <i class="fa-solid fa-chevron-right"></i>
                    </span>
                </h2>
            </div>
            <div class="section-controls">
                <i class="fa-solid fa-chevron-left scroll-btn left"></i>
                <i class="fa-solid fa-chevron-right scroll-btn right"></i>
            </div>
            <div class="section">
                ${homeGames.map(game => `
                    <div class="game-card" data-slug="${game.slug}">
                        <div class="game-details">
                            <img 
                                src="${game.poster ? game.poster + ".webp" : '../assets/images/game.jpg'}"
                                alt="${game.title}"
                                onerror="this.src='../assets/images/game.jpg'"
                            >
                            <div class="publisher">${game.publisher || WebsiteName}</div>
                            <div class="title">${game.title}</div>
                        </div>
                    </div>
                `).join('')}

                ${maxHomeIndex !== -1 ? `
                    <div class="game-card more-games" style="cursor:pointer;">
                        <div class="game-details">
                            <i class="fa-solid fa-arrow-right fa-3x"></i>
                            <div class="title">More Games</div>
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
    `;

            sectionDiv.querySelectorAll(".more-games").forEach(btn => {
                btn.addEventListener("click", () => {
                    window.location.href = `section.html?section=${encodeURIComponent(subSectionName)}&type=${platform}`;
                });
            });

            const header = sectionDiv.querySelector(".sec-style");
            header.addEventListener("click", () => {
                window.location.href = `section.html?section=${encodeURIComponent(subSectionName)}&type=${platform}`;
            });

            container.appendChild(sectionDiv);

            setupSlider(sectionDiv);

        }

        updateControlsPosition();

    } catch (err) {
        console.error("Error loading games:", err);
    }
}


// --- 3. إعداد السلايدر والضغط على الكروت ---
function setupSlider(sectionDiv) {
    const slider = sectionDiv.querySelector(".section");
    const btnLeft = sectionDiv.querySelector(".scroll-btn.left");
    const btnRight = sectionDiv.querySelector(".scroll-btn.right");
    const cards = sectionDiv.querySelectorAll(".game-card");

    if (slider && btnLeft && btnRight && cards.length > 0) {
        const scrollAmount = cards[0].offsetWidth + 15;

        btnRight.addEventListener("click", () => slider.scrollBy({ left: scrollAmount, behavior: 'smooth' }));
        btnLeft.addEventListener("click", () => slider.scrollBy({ left: -scrollAmount, behavior: 'smooth' }));

        cards.forEach(card => {
            card.addEventListener("click", () => {
                const slug = card.dataset.slug;
                window.location.href = `game.html?game=${encodeURIComponent(slug)}`;
            });
        });
    }
}


// --- 4. المستمعات ---
document.querySelectorAll('.sb-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
        setTimeout(updateControlsPosition, 400);
    });
});

window.addEventListener("resize", updateControlsPosition);


// بدء التشغيل
init();