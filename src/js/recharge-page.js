const container = document.getElementById("recharge-page");

let data = [];
let filteredData = [];
let currentFilter = "all";
let searchValue = "";
let currentSort = "default";
let cart = [];

// =========================
// HELPERS 🔥
// =========================
function normalize(str) {
    return (str || "").toLowerCase().trim();
}

function formatLabel(str) {
    return (str || "")
        .split(" ")
        .map(word =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");
}

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

function parsePrice(value) {
    if (value == null) return 0;

    // يشيل أي حاجة غير أرقام و نقط
    const cleaned = String(value).replace(/,/g, "").replace(/[^\d.]/g, "");
    return parseFloat(cleaned) || 0;
}

function formatNumber(num) {
    return new Intl.NumberFormat("en-US").format(num);
}

// =========================
// 💥 SMART DISCOUNT CALC
// =========================
function calcDiscount(oldPrice, price) {
    const oldP = parsePrice(oldPrice);
    const newP = parsePrice(price);

    if (!oldP || oldP <= newP) return null;

    const diff = oldP - newP;

    const percent = (diff / oldP) * 100;

    return {
        amount: diff,
        percent: percent
    };
}

// =========================
// LOAD
// =========================
async function load() {
    try {
        const res = await fetch("../../data/json/recharge.json");
        data = await res.json();

        generateFilters();
        applyFilters();

        renderDiscoverProducts();

    } catch (error) {
        console.error("Error loading data:", error);
    }
}

// =========================
// FILTER LOGIC
// =========================
function applyFilters() {
    filteredData = data.filter(item => {
        const matchFilter =
            normalize(currentFilter) === "all" ||
            normalize(item.type) === normalize(currentFilter);

        return matchFilter;
    });

    if (currentSort === "name-asc") {
        filteredData.sort((a, b) => a.name.localeCompare(b.name));
    } else if (currentSort === "name-desc") {
        filteredData.sort((a, b) => b.name.localeCompare(a.name));
    }

    renderSections();
}

// =========================
// RENDER SECTIONS
// =========================
function renderSections() {
    container.innerHTML = "";
    const grouped = {};

    filteredData.forEach(item => {
        const key = normalize(item.type);

        if (!grouped[key]) {
            grouped[key] = {
                title: item.type,
                items: []
            };
        }

        grouped[key].items.push(item);
    });

    Object.keys(grouped).forEach(key => {
        const group = grouped[key];

        const section = document.createElement("section");
        section.className = "game-section";

        section.innerHTML = `
            <div class="game-header">
                <h2 class="section-title clickable-title" data-type="${group.title}">
                    ${formatLabel(group.title)} 
                    <i class="fa-solid fa-chevron-right"></i>
                </h2>
                <div class="header-controls section-controls">
                    <i class="fa-solid fa-chevron-left scroll-btn left"></i>
                    <i class="fa-solid fa-chevron-right scroll-btn right"></i>
                </div>
            </div>
            <div class="apps-row">
                ${group.items.map(item => createAppHTML(item)).join("")}
            </div>
        `;

        container.appendChild(section);
        attachSectionEvents(section);
    });

    updateControlsPosition();
}

// =========================
// CLICK CATEGORY
// =========================
document.addEventListener("click", (e) => {
    const title = e.target.closest(".clickable-title");
    if (!title) return;

    const type = title.dataset.type;
    window.location.href = `category.html?type=${encodeURIComponent(type)}`;
});

// =========================
// APP CLICK
// =========================
container.addEventListener("click", (e) => {
    const app = e.target.closest(".app-item");
    if (!app) return;

    const id = app.dataset.id;
    window.location.href = `game-recharge.html?game=${id}`;
});

// =========================
// SEARCH
// =========================
document.addEventListener("keydown", (e) => {
    if (e.target.id === "searchInput") {
        if (e.key === "Enter") {
            const query = e.target.value.trim();
            if (query !== "") {
                window.location.href = `search-recharge.html?q=${encodeURIComponent(query)}`;
            }
        }
    }
});

// =========================
// FILTERS
// =========================
function generateFilters() {
    const filtersContainer = document.getElementById("filters");
    if (!filtersContainer) return;

    const types = ["all", ...new Set(data.map(d => normalize(d.type)))];

    filtersContainer.innerHTML = types.map(type => `
        <div class="filter-btn ${type === "all" ? "active" : ""}" data-type="${type}">
            ${type === "all" ? "All" : formatLabel(type)}
        </div>
    `).join("");
}

document.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;

    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    currentFilter = btn.dataset.type;
    applyFilters();
});

// =========================
// SORT
// =========================
document.addEventListener("change", (e) => {
    if (e.target.id === "sortSelect") {
        currentSort = e.target.value;
        applyFilters();
    }
});

// =========================
// SCROLL
// =========================
function attachSectionEvents(section) {
    const row = section.querySelector(".apps-row");
    const btnLeft = section.querySelector(".scroll-btn.left");
    const btnRight = section.querySelector(".scroll-btn.right");
    const controls = section.querySelector(".header-controls");

    if (!row || !btnLeft || !btnRight) return;

    const amount = 150;

    btnRight.onclick = () => row.scrollBy({ left: amount, behavior: "smooth" });
    btnLeft.onclick = () => row.scrollBy({ left: -amount, behavior: "smooth" });

    function updateVisibility() {
        if (controls) {
            controls.style.display = row.scrollWidth > row.clientWidth + 5 ? "flex" : "none";
        }
    }

    updateVisibility();
    window.addEventListener("resize", updateVisibility);
}

// =========================
// HTML BUILDER
// =========================
function createAppHTML(item) {
    return `
        <div class="app-item" data-id="${item.id}" data-type="${item.type}">
            <div class="app-icon">
                <img src="${item.image}" alt="${item.name}" />
            </div>
            <div class="app-name">${item.name}</div>
        </div>
    `;
}

// =========================
// SIDEBAR FIX
// =========================
document.addEventListener("click", (e) => {
    if (e.target.closest(".sb-toggle")) {
        setTimeout(updateControlsPosition, 400);
    }
});

window.addEventListener("resize", updateControlsPosition);

// =========================
// DISCOVER (GAMES / CARDS)
// =========================
function renderDiscoverProducts() {
    const grid = document.getElementById("discover-grid");
    if (!grid) return;

    const groups = {};

    data.forEach(game => {
        game.packs.forEach(pack => {

            const type = normalize(pack.type);

            const item = {
                gameId: game.id,
                gameName: game.name,
                pack
            };

            const sectionName = pack.discoverSection || "Other";

            const key = normalize(sectionName);

            if (!groups[key]) {
                groups[key] = {
                    title: sectionName,
                    items: []
                };
            }

            groups[key].items.push(item);
        });
    });

    function buildCard(item) {
        const pack = item.pack;
        const discount = calcDiscount(pack.oldPrice, pack.price);

        return `
            <div class="discover-card" 
     data-game="${item.gameId}" 
     data-pack="${item.pack.title}">
                
${discount ? `
    <div class="discount-badge">
        - ${discount.percent.toFixed(2)}%
    </div>
` : ""}

                <div class="discover-img">
                    <img src="${pack.img}" alt="${item.gameName}" />
                    ${pack.popular ? `<span class="badge"><i class="fa-solid fa-fire"></i> Hot</span>` : ""}
                </div>

                <div class="discover-info">
                    <h3 class="title">${item.gameName}</h3>
                    <p class="desc">${pack.title} ${pack.type}</p>

                    <div class="price-box">
                        <span class="price">${pack.price} EGP</span>
                        ${pack.oldPrice ? `<span class="old">${pack.oldPrice}</span>` : ""}
                    </div>
                </div>
            </div>
        `;
    }

    grid.innerHTML = Object.values(groups).map(group => `
    <section class="discover-section game-section">
        <div class="game-header">
            <h2>${group.title}</h2>
            <div class="header-controls section-controls">
                <i class="fa-solid fa-chevron-left scroll-btn left"></i>
                <i class="fa-solid fa-chevron-right scroll-btn right"></i>
            </div>
        </div>
        <div class="discover-grid-inner apps-row">
            ${group.items.map(buildCard).join("")}
        </div>
    </section>
`).join("");

    // 🔥 الخطوة الأهم: تشغيل الأحداث لكل قسم اكتشاف جديد
    grid.querySelectorAll('.discover-section').forEach(sec => {
        attachSectionEvents(sec);
    });

    // تحديث أماكن الأسهم بناءً على السايدبار
    updateControlsPosition();
}

document.addEventListener("click", (e) => {
    const card = e.target.closest(".discover-card");
    if (!card) return;

    const gameId = card.dataset.game;
    const packTitle = card.dataset.pack;

    window.location.href = `game-recharge-card.html?game=${encodeURIComponent(gameId)}&pack=${encodeURIComponent(packTitle)}`;
});

// =========================
// INIT
// =========================
load();