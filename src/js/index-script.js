// ملاحظة: شلنا الـ import بتاع initGameSearch لأننا مش محتاجينه يشتغل لايف هنا
const container = document.getElementById("games-container");
const WebsiteName = "GameOnix";
let allGamesData = null;
let currentFilter = 'all';

// --- NEW BADGE LOGIC (36 HOURS) ---
function isNewGame(gameDate) {
    if (!gameDate) return false;

    const gameTime = new Date(gameDate).getTime();
    const now = Date.now();

    const diffHours = (now - gameTime) / (1000 * 60 * 60);

    return diffHours <= 36;
}

// --- 1. تحسين موضع أزرار التحكم ---
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

// --- 2. إعدادات صندوق البحث ---
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

// --- 3. جلب البيانات ---
fetch('../data/json/games.json')
    .then(res => res.json())
    .then(data => {
        allGamesData = data;

        preloadAds();
        renderSections('all');
        setupFilterListeners();
    })
    .catch(err => console.error("Error fetching games:", err));

// --- 4. عرض الأقسام ---
function renderSections(filterType = 'all') {
    if (!allGamesData) return;
    currentFilter = filterType;
    container.innerHTML = "";

    for (const mainSectionName in allGamesData) {
        const mainSection = allGamesData[mainSectionName];

        const isPC = mainSection.icon && (mainSection.icon.includes("computer") || mainSection.icon.includes("desktop"));
        const isPS = mainSection.icon && mainSection.icon.includes("playstation");

        if (filterType === 'pc' && !isPC) continue;
        if (filterType === 'ps' && !isPS) continue;

        const mainTitle = document.createElement("h1");
        mainTitle.classList.add("main-section-title");
        mainTitle.style.cursor = "pointer";

        mainTitle.innerHTML = `
            ${mainSection.icon ? `<i class="${mainSection.icon}"></i>` : ''}
            ${mainSectionName}
            <i class="fa-solid fa-chevron-right"></i>
        `;

        mainTitle.addEventListener("click", () => {
            let type = isPS ? "PS" : "PC";
            window.location.href = `html/section-all.html?type=${type}`;
        });

        container.appendChild(mainTitle);

        for (const subSectionName in mainSection) {
            if (subSectionName === "icon") continue;

            const section = mainSection[subSectionName];
            const games = section.games || [];
            if (games.length === 0) continue;

            const sectionDiv = document.createElement("div");
            sectionDiv.classList.add("section-container");

            const maxHomeIndex = games.findIndex(g => g.title === "More Games");
            const homeGames = maxHomeIndex !== -1 ? games.slice(0, maxHomeIndex) : games;

            sectionDiv.innerHTML = `
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
                    ${homeGames.map(game => {
                        const isNew = isNewGame(game.date);

                        return `
                            <div class="game-card" data-slug="${game.slug}">
                                <div class="game-details">

                                    ${isNew ? `<div class="badge-new">New</div>` : ""}

                                    <img 
                                        src="${game.poster ? game.poster + ".webp" : '../assets/images/game.jpg'}"
                                        alt="${game.title}"
                                        onerror="this.src='../assets/images/game.jpg'"
                                    >
                                    <div class="publisher">${game.publisher || WebsiteName}</div>
                                    <div class="title">${game.title}</div>
                                </div>
                            </div>
                        `;
                    }).join('')}

                    ${maxHomeIndex !== -1 ? `
                        <div class="game-card more-games">
                            <div class="game-details">
                                <i class="fa-solid fa-arrow-right fa-3x" style="color: var(--color-text-primary);"></i>
                                <div class="title">More Games</div>
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;

            container.appendChild(sectionDiv);
            attachSectionEvents(sectionDiv, subSectionName);
        }
    }

    updateControlsPosition();
}

// --- Ads ---
async function loadAllAdsSequential() {
    const allAdContainers = container.querySelectorAll(".section-container .adv .ad");

    for (let index = 0; index < allAdContainers.length; index++) {
        const ad = allAdContainers[index];

        try {
            await loadSingleAd(ad);
        } catch (err) {
            console.error(`Ad #${index + 1} failed to load:`, err);
            ad.innerHTML = `<img src="assets/images/ad-fallback.jpg" alt="Ad" style="width:100%; height:auto;">`;
        }
    }
}

function loadSingleAd(adContainer) {
    return new Promise((resolve, reject) => {
        adContainer.innerHTML = "";

        try {
            (function (jiwz) {
                var d = document,
                    s = d.createElement('script');

                s.settings = jiwz || {};
                s.src = "//stupid-police.com/beX.VJs/d/Gmlf0/YBW/cH/Nedmk9KuHZhUKl/kaP/T/Ye4TOiDBMZ4QMlz_cntINJjrgD4QMUz/g/0SM_Qx";
                s.async = true;
                s.referrerPolicy = 'no-referrer-when-downgrade';

                s.onload = () => resolve();
                s.onerror = () => reject(new Error("Ad failed"));

                adContainer.appendChild(s);
            })({});
        } catch (err) {
            reject(err);
        }
    });
}

function preloadAds() {
    const adPlaceholderCount = 10;

    for (let i = 0; i < adPlaceholderCount; i++) {
        const adDiv = document.createElement('div');
        adDiv.classList.add('adv', 'preload-ad');
        adDiv.style.marginTop = '10px';

        const innerAd = document.createElement('div');
        innerAd.classList.add('ad');
        adDiv.appendChild(innerAd);

        container.appendChild(adDiv);

        const script1 = document.createElement("script");
        script1.type = "text/javascript";
        script1.innerHTML = `
            atOptions = {
                'key' : '9d1775733bcb53c5e0ad81d6d9870e39',
                'format' : 'iframe',
                'height' : 90,
                'width' : 728,
                'params' : {}
            };
        `;

        const script2 = document.createElement("script");
        script2.type = "text/javascript";
        script2.src = "https://www.highperformanceformat.com/9d1775733bcb53c5e0ad81d6d9870e39/invoke.js";

        innerAd.appendChild(script1);
        innerAd.appendChild(script2);
    }
}

// --- 5. أحداث السلايدر ---
function attachSectionEvents(sectionDiv, subSectionName) {

    let platformType = "PC";

    const mainHeader = sectionDiv.previousElementSibling;
    if (mainHeader && mainHeader.classList.contains("main-section-title")) {
        const iconClass = mainHeader.querySelector("i")?.className || "";
        if (iconClass.toLowerCase().includes("playstation")) {
            platformType = "PS";
        }
    }

    const targetSectionUrl = `html/section.html?section=${encodeURIComponent(subSectionName)}&type=${platformType}`;

    const secTxt = sectionDiv.querySelector(".sec-txt");
    if (secTxt) {
        secTxt.addEventListener("click", () => {
            window.location.href = targetSectionUrl;
        });
    }

    sectionDiv.querySelectorAll(".more-games").forEach(btn => {
        btn.addEventListener("click", () => {
            window.location.href = targetSectionUrl;
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
    const firstCard = slider?.querySelector(".game-card");

    if (slider && firstCard && btnLeft && btnRight) {
        const cardWidth = firstCard.offsetWidth;
        const gap = 15;
        const scrollAmount = cardWidth + gap;

        btnRight.addEventListener("click", () => {
            slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        btnLeft.addEventListener("click", () => {
            slider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        const updateVisibility = () => {
            if (controls) {
                controls.style.display = slider.scrollWidth > slider.clientWidth ? "flex" : "none";
            }
        };

        updateVisibility();
        window.addEventListener("resize", updateVisibility);
    }
}

// --- 6. الفلاتر ---
function setupFilterListeners() {
    const allBtn = document.querySelector('.filter.all');
    const pcBtn = document.querySelector('.filter.pc');
    const psBtn = document.querySelector('.filter.ps');

    if (allBtn) {
        allBtn.addEventListener('click', () => {
            toggleActiveFilter(allBtn);
            renderSections('all');
        });
    }

    if (pcBtn) {
        pcBtn.addEventListener('click', () => {
            toggleActiveFilter(pcBtn);
            renderSections('pc');
        });
    }

    if (psBtn) {
        psBtn.addEventListener('click', () => {
            toggleActiveFilter(psBtn);
            renderSections('ps');
        });
    }
}

function toggleActiveFilter(el) {
    document.querySelectorAll('.filter').forEach(f => f.classList.remove('active'));
    el.classList.add('active');
}

// --- 7. Sidebar ---
document.querySelectorAll('.sb-toggle').forEach(btn => {
    btn.addEventListener('click', () => setTimeout(updateControlsPosition, 400));
});

window.addEventListener("resize", updateControlsPosition);