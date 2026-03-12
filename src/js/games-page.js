// JS كامل مع overlay fill صحيح لأول عنصر
const sidebar = document.getElementById("sidebar");
const heroContainer = document.querySelector(".hero");
const title = document.getElementById("title");
const desc = document.getElementById("desc");
const publicher = document.getElementById("pub");
const heroContentChildren = Array.from(document.querySelector(".hero-content").children);
const buyBtn = document.querySelector(".buy");
const gameImg = document.querySelector(".game-img");

let currentIndex = 0;
let currentSlug = null;            // slug of the game currently shown in hero
const progressTime = 10000; // 10 ثواني لكل لعبة
let allGames = [];

// rAF-based carousel state
let rafId = null;
let progress = 0;            // fraction (0-1) through current slide
let lastFrameTime = null;
let currentGames = [];
let justUnhidden = false;    // ignore the first frame delta after coming back

// 🎬 تغيير الـ Hero (يدعم image + video)
function animateHeroChange(game, instant = false) {
    // keep slug for download/navigation
    currentSlug = game.slug || null;

    heroContentChildren.forEach(el => {
        if (!instant) {
            el.style.opacity = 0;
            el.style.transform = "translateY(20px)";
        }
    });

    const oldMedia = heroContainer.querySelector(".hero-media");
    if (oldMedia && !instant) oldMedia.style.opacity = 0;

    setTimeout(() => {
        title.textContent = game.title || "NO TITLE";
        desc.textContent = game.desc || "NO DESCRIPTION";
        publicher.textContent = game.pub || "";

        if (oldMedia) oldMedia.remove();

        let newMedia;
        if (game.type === "video") {
            newMedia = document.createElement("video");
            newMedia.src = game.heroImage;
            newMedia.autoplay = true;
            newMedia.loop = true;
            newMedia.muted = true;
            newMedia.playsInline = true;
        } else {
            newMedia = document.createElement("img");
            newMedia.src = game.heroImage;
        }

        newMedia.className = "hero-media";
        newMedia.style.position = "absolute";
        newMedia.style.top = "0";
        newMedia.style.left = "0";
        newMedia.style.width = "100%";
        newMedia.style.height = "100%";
        newMedia.style.objectFit = "cover";
        newMedia.style.opacity = 0;
        newMedia.style.transition = "opacity 0.4s ease-in-out";

        newMedia.style.cursor = "pointer";
        newMedia.onclick = () => {
            if (currentSlug) {
                window.location.href = `game.html?game=${encodeURIComponent(currentSlug)}`;
            }
        };

        heroContainer.appendChild(newMedia);
        requestAnimationFrame(() => { newMedia.style.opacity = 1; });
        heroContentChildren.forEach(el => { el.style.opacity = 1; el.style.transform = "translateY(0)"; });
    }, instant ? 0 : 400);
}

// ✨ إنشاء sidebar مع overlay fill
fetch("https://www.gameonix.shop/data/json/games-database-gallery.json")
    .then(res => res.json())
    .then(data => {
        allGames = data;

        data.forEach((game, index) => {
            const div = document.createElement("div");
            div.classList.add("game");

            div.innerHTML = `
                <div class="fill-overlay"></div>
                <img class="side-img" src="${game.thumb}" alt="${game.title}">
                <span class="title-side">${game.title}</span>
            `;

            sidebar.appendChild(div);

            div.addEventListener("click", () => {
                // animate the thumbnail image by toggling a class
                div.classList.add("clicked");
                // remove class after animation duration
                setTimeout(() => div.classList.remove("clicked"), 300);

                selectGame(index, data);
                startAutoSlide(data);
            });
        });

        // initialize the first game explicitly so its hero and overlay are reset
        selectGame(0, data, true);
        // give the browser a moment to paint the initial state before animating
        setTimeout(() => startAutoSlide(data), 50);

        // wire buy button to game detail page using slug
        if (buyBtn) {
            buyBtn.addEventListener('click', () => {
                if (currentSlug) {
                    // navigate to the game page with query param
                    window.location.href = `game.html?game=${encodeURIComponent(currentSlug)}`;
                }
            });
        }

        // bug icon in hero: open email compose just like on game-page
        const heroBugBtn = document.querySelector('.icon');
        if (heroBugBtn) {
            heroBugBtn.addEventListener('click', () => {
                // lookup current game title via slug in allGames
                const g = allGames.find(x => x.slug === currentSlug);
                const subject = encodeURIComponent(`Bug Report: ${g ? g.title : ''}`);
                const body = encodeURIComponent(`
Game: ${g ? g.title : ''}
Page: ${window.location.href}

Describe the problem:
`);
                const gmailURL =
                    `https://mail.google.com/mail/?view=cm&fs=1&to=gameonix.website@gmail.com&su=${subject}&body=${body}`;
                window.open(gmailURL, '_blank');
            });
        }
    })
    .catch(err => console.error("JSON Load Error:", err));
// when the tab becomes hidden we already clear the overlay in the
// visibilitychange listener defined earlier, no need for extra code.

function selectGame(index, games, instant = false) {
    const gameDivs = document.querySelectorAll(".game");
    gameDivs.forEach((g, i) => {
        g.classList.toggle("active", i === index);
        const overlay = g.querySelector(".fill-overlay");
        overlay.style.transition = "none"; // reset without animation
        overlay.style.width = "0%";
    });

    currentIndex = index;
    animateHeroChange(games[index], instant);
}

// 🌟 Auto-slide using requestAnimationFrame
function startAutoSlide(games, initialProgress = 0) {
    currentGames = games;
    progress = initialProgress;
    cancelAnimationFrame(rafId);
    lastFrameTime = performance.now();
    rafId = requestAnimationFrame(step);
}

function step(timestamp) {
    // always ask for another frame
    rafId = requestAnimationFrame(step);

    if (document.hidden) {
        // do not advance progress while hidden
        lastFrameTime = timestamp;
        return;
    }

    // Stop hero animation while loading screen is visible
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        const loadingStyle = window.getComputedStyle(loadingScreen);
        const isLoadingVisible = loadingStyle.display !== 'none' && 
                                  loadingStyle.visibility !== 'hidden' && 
                                  loadingStyle.opacity !== '0';
        if (isLoadingVisible) {
            lastFrameTime = timestamp;
            return;
        }
    }

    // compute frame time; but if we just became visible ignore large gap
    let delta = timestamp - lastFrameTime;
    if (justUnhidden) {
        delta = 0;
        justUnhidden = false;
    }
    lastFrameTime = timestamp;

    progress += delta / progressTime;

    // if progress completes, move to next game
    if (progress >= 1) {
        progress -= 1;
        currentIndex = (currentIndex + 1) % currentGames.length;
        selectGame(currentIndex, currentGames);
    }

    // update the current overlay width
    const currentDiv = document.querySelectorAll('.game')[currentIndex];
    const overlay = currentDiv?.querySelector('.fill-overlay');
    if (overlay) {
        overlay.style.transition = 'none';
        overlay.style.width = `${Math.min(progress, 1) * 100}%`;
    }
}

// 🔍 Search functionality
const searchBox = document.getElementById('searchBox');
if (searchBox) {
    searchBox.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchBox.value.trim();
            if (query) {
                window.location.href = `search-results.html?q=${encodeURIComponent(query)}`;
            }
        }
    });
}

// 📥 Handle card download buttons
document.addEventListener('DOMContentLoaded', () => {
    // بنلف على كل كارت عنده data-slug
    document.querySelectorAll('.card[data-slug]').forEach(card => {
        const slug = card.getAttribute('data-slug');
        const gameImg = card.querySelector('.game-img');
        const downloadBtn = card.querySelector('.buy');
        const bugBtn = card.querySelector('.icon'); // زرار الـ Bug جوه الكارت
        const gameTitle = gameImg ? gameImg.alt : "Game";

        // 1. لما تضغط على الصورة يفتح صفحة اللعبة
        if (gameImg) {
            gameImg.style.cursor = "pointer";
            gameImg.addEventListener('click', () => {
                window.location.href = `game.html?game=${encodeURIComponent(slug)}`;
            });
        }

        // 2. تفعيل زرار الـ Download اللي جوه الكارت
        if (downloadBtn) {
            downloadBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // عشان ميتداخلش مع أي ضغطات تانية
                window.location.href = `game.html?game=${encodeURIComponent(slug)}`;
            });
        }

        // 3. تفعيل زرار الـ Bug اللي جوه الكارت
        if (bugBtn) {
            bugBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // منع تداخل الأحداث
                const subject = encodeURIComponent(`Bug Report: ${gameTitle}`);
                const body = encodeURIComponent(`Game: ${gameTitle}\nLink: ${window.location.href}`);
                const gmailURL = `https://mail.google.com/mail/?view=cm&fs=1&to=gameonix.website@gmail.com&su=${subject}&body=${body}`;
                window.open(gmailURL, '_blank');
            });
        }
    });
});

const cardsContainer = document.getElementById("store-game-cards");
const popularContainer = document.getElementById("store-popular-list");

fetch("https://www.gameonix.shop/data/json/games-main.json")
    .then(res => res.json())
    .then(data => {

        data.forEach(game => {

            // ✅ فلترة: لو الكارت مخصص للـ popular بس، متعملش main card
            if (game.onlyPopular) return; // لو عندك علامة خاصة للـ popular-only

            const card = document.createElement("div");
            card.className = "store-game-card";

            card.innerHTML = `
        <img src="${game.thumb}" alt="${game.title}">
        <div class="game-info">
            <h3>${game.title}</h3>
            <span>${game.pub || "Unknown Publisher"}</span>
            <p class="store-desc">${game.shortDesc || ""}</p>
        </div>
    `;

            card.addEventListener("click", () => {
                window.location.href =
                    `game.html?game=${encodeURIComponent(game.slug)}`;
            });

            cardsContainer.appendChild(card);

            // الألعاب المشهورة
            if (game.popular === true) {
                const popularItem = document.createElement("div");
                popularItem.className = "store-popular-item";

                popularItem.innerHTML = `
            <img src="${game.thumb}">
            <div class="store-popular-info">
                <span>${game.title}</span>
                <small>${game.pub}</small>
                <p class="popular-desc">${game.shortDesc || ""}</p>
            </div>
        `;

                popularItem.addEventListener("click", () => {
                    window.location.href =
                        `game.html?game=${encodeURIComponent(game.slug)}`;
                });

                popularContainer.appendChild(popularItem);
            }

        });

    })
    .catch(err => console.error("Cards JSON Load Error:", err));

const sectionsContainer = document.getElementById("store-sections-list");

fetch("https://www.gameonix.shop/data/json/games.json")
    .then(res => res.json())
    .then(data => {

        let isFirst = true; // العلم للسكشن الأول

        for (const sectionName in data) {

            if(isFirst) {
                isFirst = false; // نتخطى السكشن الأول (Popular)
                continue;
            }

            const section = data[sectionName];

            const sectionItem = document.createElement("div");
            sectionItem.className = "section-item";

            sectionItem.innerHTML = `
                ${section.icon ? `<i class="${section.icon}"></i>` : ""}
                <span>${sectionName}</span>
            `;

            sectionItem.addEventListener("click", () => {
                const encoded = encodeURIComponent(sectionName);
                window.location.href = `section.html?section=${encoded}`;
            });

            sectionsContainer.appendChild(sectionItem);
        }

    })
    .catch(err => console.error("Sections Load Error:", err));