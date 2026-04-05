

// ================= PATH =================
function getBasePath() {
    const path = window.location.pathname;
    return path.includes("/html/") ? "../" : "./";
}

const base = getBasePath();

// ================= SIDEBAR HTML =================
const sidebarHTML = `
    <aside class="sb closed">
        <header class="sb-h">
            <a href="${base}index.html">
                <img src="${window.location.origin}/assets/images/Logo.png" class="logo">
                <h2 class="sb-text">GameOnix</h2>
            </a>
            <button class="sb-toggle">
                <span class="material-symbols-rounded">chevron_left</span>
            </button>
        </header>

        <div class="sb-content">
            <ul class="menu-list">

                <li class="menu-item">
                    <a href="${base}index.html" class="menu-link">
                        <span class="material-symbols-rounded">home</span>
                        <span class="menu-label">Home</span>
                    </a>
                </li>

                <li class="menu-item">
                    <a href="${base}html/games.html" class="menu-link">
                        <span class="material-symbols-rounded">stadia_controller</span>
                        <span class="menu-label">Games</span>
                    </a>
                </li>

                <li class="menu-item">
                    <a href="${base}html/games-news.html" class="menu-link">
                        <span class="material-symbols-rounded">newspaper</span>
                        <span class="menu-label">Games News</span>
                    </a>
                </li>

                <li class="menu-item">
                    <a href="${base}html/recharge.html" class="menu-link">
                        <span class="material-symbols-rounded">shopping_cart</span>
                        <span class="menu-label">Recharge Games</span>
                    </a>
                </li>

                <li class="menu-item">
                    <a href="${base}html/channel.html" class="menu-link">
                        <span class="material-symbols-rounded">live_tv</span>
                        <span class="menu-label">GameOnix Channel</span>
                        <span id="channelDot" class="new-dot"></span>
                    </a>
                </li>

                <li class="menu-item">
                    <a href="${base}html/apps.html" class="menu-link">
                        <span class="material-symbols-rounded">apps</span>
                        <span class="menu-label">Applications</span>
                    </a>
                </li>

                <li class="menu-item">
                    <a href="${base}html/request-game.html" class="menu-link">
                        <span class="material-symbols-rounded">person_raised_hand</span>
                        <span class="menu-label">Request Game</span>
                    </a>
                </li>

            </ul>
        </div>

        <div class="sb-footer">
            <ul class="menu-list">
                <li class="menu-item">
                    <a href="${base}html/donations.html" class="menu-link">
                        <span class="material-symbols-rounded">volunteer_activism</span>
                        <span class="menu-label">Support Us</span>
                    </a>
                </li>
            </ul>
        </div>
    </aside>
    `;

// inject
document.getElementById("sidebar-container").innerHTML = sidebarHTML;

// ================= SELECT =================
const sb = document.querySelector(".sb");
const sbToggleBtn = document.querySelectorAll(".sb-toggle");
const menuToggle = document.querySelector(".menu-toggle");

const themeBtn = document.querySelector(".theme-changer");
const themeIco = themeBtn?.querySelector("span");

const modeBtn = document.getElementById("modeBtn");
const modeMenu = document.getElementById("modeMenu");
const modeText = document.getElementById("modeText");
const modeIcon = modeBtn?.querySelector(".mode-icon");

// ================= SIDEBAR STATE =================
const savedSidebar = localStorage.getItem("sidebar-state");
const isMobile = window.innerWidth <= 768;

if (sb) {
    if (savedSidebar === "open") {
        sb.classList.remove("closed");
    } else if (savedSidebar === "closed") {
        sb.classList.add("closed");
    } else {
        if (isMobile) sb.classList.add("closed");
    }
}

const toggleSidebar = () => {
    if (!sb) return;

    sb.classList.toggle("closed");

    localStorage.setItem(
        "sidebar-state",
        sb.classList.contains("closed") ? "closed" : "open"
    );
};

sbToggleBtn.forEach(btn => btn.addEventListener("click", toggleSidebar));
menuToggle?.addEventListener("click", toggleSidebar);

// mobile close outside
document.addEventListener("click", (e) => {
    if (
        window.innerWidth <= 768 &&
        sb &&
        !sb.contains(e.target) &&
        !e.target.closest(".menu-toggle")
    ) {
        sb.classList.add("closed");
        localStorage.setItem("sidebar-state", "closed");
    }
});

// ================= THEME =================
const savedTheme = localStorage.getItem("theme");
const sysPrefersDark = window.matchMedia("(prefers-color-scheme:dark)").matches;

const updateThemeIco = () => {
    if (!themeIco) return;
    const isDark = document.body.classList.contains("dark-theme");
    themeIco.textContent = isDark ? "light_mode" : "dark_mode";
};

const applyMode = (mode) => {
    const isDark = mode === "dark";

    document.body.classList.toggle("dark-theme", isDark);

    if (modeText) modeText.textContent = isDark ? "Dark" : "Light";
    if (modeIcon) modeIcon.textContent = isDark ? "dark_mode" : "light_mode";

    updateThemeIco();
};

applyMode(savedTheme || (sysPrefersDark ? "dark" : "light"));

themeBtn?.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-theme");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    applyMode(isDark ? "dark" : "light");
});

// ================= MODE DROPDOWN =================
if (modeBtn && modeMenu) {
    modeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = modeMenu.style.display === "block";
        modeMenu.style.display = isOpen ? "none" : "block";
        modeBtn.classList.toggle("open", !isOpen);
    });

    modeMenu.querySelectorAll("li").forEach(item => {
        item.addEventListener("click", () => {
            const selected = item.dataset.mode;
            applyMode(selected);
            localStorage.setItem("theme", selected);
            modeMenu.style.display = "none";
            modeBtn.classList.remove("open");
        });
    });

    document.addEventListener("click", (e) => {
        if (!e.target.closest(".mode-dropdown")) {
            modeMenu.style.display = "none";
            modeBtn.classList.remove("open");
        }
    });
}

// ================= ACTIVE LINK (🔥 مهم) =================
const currentPage = window.location.pathname;

document.querySelectorAll(".menu-link").forEach(link => {
    const href = link.getAttribute("href");

    if (currentPage.endsWith(href.replace(base, ""))) {
        link.classList.add("active");
    }
});

// ================= CHANNEL DOT =================
async function fetchWithFallback(paths) {
    for (const path of paths) {
        try {
            const res = await fetch(path);
            if (res.ok) return await res.json();
        } catch { }
    }
    throw new Error("fail");
}

async function checkNewVideos() {
    try {
        const videos = await fetchWithFallback([
            base + "data/json/channel-data.json",
            base + "../data/json/channel-data.json"
        ]);

        const now = new Date();

        const hasNew = videos.some(video => {
            const videoDate = new Date(video.date);
            const diffDays = (now - videoDate) / (1000 * 60 * 60 * 24);
            return diffDays <= 6;
        });

        const dot = document.getElementById("channelDot");
        if (dot) dot.style.display = hasNew ? "inline-block" : "none";

    } catch (err) {
        console.error(err);
    }
}

checkNewVideos();

