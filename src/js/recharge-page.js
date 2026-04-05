const container = document.getElementById("recharge-page");
let data = [];

// =========================
// CONTROLS POSITION
// =========================
function updateControlsPosition() {
    const sidebar = document.querySelector('.sb');
    const isOpen = sidebar ? !sidebar.classList.contains('closed') : false;
    const sidebarWidth = sidebar ? sidebar.offsetWidth : 0;

    document.querySelectorAll('.section-controls').forEach(ctrl => {
        ctrl.style.right = isOpen
            ? (sidebarWidth + 40) + 'px'
            : '150px';
    });

    document.querySelectorAll('.game-section').forEach(sec => {
        sec.style.paddingRight = isOpen ? "170px" : "20px";
    });
}

// =========================
// LOAD DATA
// =========================
async function load() {
    try {
        const res = await fetch("../../data/json/recharge.json");
        data = await res.json();
        render();
    } catch (error) {
        console.error("Error loading data:", error);
    }
}

// =========================
// RENDER
// =========================
function render() {
    container.innerHTML = "";

    data.forEach(game => {
        const section = document.createElement("section");
        section.className = "game-section";

        section.innerHTML = `
            <div class="game-header">
                <div class="game-header-left" data-id="${game.id}">
                    <img src="${game.image}" />
                    <h2>${game.name} <i class="fa-solid fa-chevron-right"></i></h2>
                </div>

                <div class="header-controls">
                    <i class="fa-solid fa-chevron-left scroll-btn left"></i>
                    <i class="fa-solid fa-chevron-right scroll-btn right"></i>
                </div>
            </div>

            <div class="cards-grid">
                ${game.packs.map(pack => createCardHTML(game, pack)).join("")}
            </div>
        `;

        container.appendChild(section);

        requestAnimationFrame(() => {
            attachSectionEvents(section);
        });
    });

    updateControlsPosition();
}

// =========================
// EVENT DELEGATION (🔥 المهم)
// =========================
container.addEventListener("click", (e) => {

    // ===== HEADER CLICK =====
    const header = e.target.closest(".game-header-left");
    if (header) {
        const gameId = header.dataset.id;
        window.location.href = `game-recharge.html?game=${gameId}`;
        return;
    }

    // ===== CARD CLICK =====
    const card = e.target.closest(".card");
    if (card) {
        const gameId = card.dataset.game;
        const pack = card.dataset.pack;

        window.location.href = `game-recharge-card.html?game=${gameId}&pack=${pack}`;
        return;
    }

});

// =========================
// SCROLL LOGIC
// =========================
function attachSectionEvents(section) {
    const grid = section.querySelector(".cards-grid");
    const btnLeft = section.querySelector(".scroll-btn.left");
    const btnRight = section.querySelector(".scroll-btn.right");
    const controls = section.querySelector(".header-controls");

    if (!grid || !btnLeft || !btnRight) return;

    function getScrollAmount() {
        const card = grid.querySelector(".card");
        if (!card) return 200;

        const gap = 20;
        return card.offsetWidth + gap;
    }

    btnRight.addEventListener("click", () => {
        grid.scrollBy({ left: getScrollAmount(), behavior: "smooth" });
    });

    btnLeft.addEventListener("click", () => {
        grid.scrollBy({ left: -getScrollAmount(), behavior: "smooth" });
    });

    function updateVisibility() {
        const canScroll = grid.scrollWidth > grid.clientWidth + 5;
        controls.style.display = canScroll ? "flex" : "none";
    }

    updateVisibility();

    window.addEventListener("resize", updateVisibility);
    grid.addEventListener("scroll", updateVisibility);
}

// =========================
// CARD HTML
// =========================
function createCardHTML(game, pack) {
    const popular = pack.popular ? "popular" : "";

    let priceHTML = "";

    if (pack.oldPrice) {
        const discountRaw =
            ((pack.oldPrice - pack.price) / pack.oldPrice) * 100;

        const discount = discountRaw.toFixed(2);

        priceHTML = `
            <div class="price-box">
                <span class="old-price">${pack.oldPrice} EGP</span>
                <span class="new-price">${pack.price} EGP</span>
            </div>

            <div class="discount-badge">-${discount}%</div>
        `;
    } else {
        priceHTML = `<div class="price-only">${pack.price} EGP</div>`;
    }

    return `
        <div class="card ${popular}" 
             data-game="${game.id}" 
             data-pack="${pack.title}">

            ${pack.popular ? `
                <div class="popular-badge">
                    <i class="fa-solid fa-fire"></i>
                    Hot
                </div>
            ` : ""}

            <div class="card-img">
                <img src="${pack.img}" />
            </div>

            <div class="card-body">
                <h3 class="card-title">${pack.title} Diamonds</h3>
                ${priceHTML}
            </div>
        </div>
    `;
}

// =========================
// SIDEBAR TOGGLE FIX
// =========================
document.addEventListener("click", (e) => {
    if (e.target.closest(".sb-toggle")) {
        setTimeout(updateControlsPosition, 400);
    }
});

// =========================
// RESIZE
// =========================
window.addEventListener("resize", updateControlsPosition);

// =========================
// INIT
// =========================
load();