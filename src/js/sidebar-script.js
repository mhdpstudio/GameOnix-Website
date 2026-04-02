const sb = document.querySelector(".sb");
const sbToggleBtn = document.querySelectorAll(".sb-toggle");
const menuToggle = document.querySelector(".menu-toggle");

const themeBtn = document.querySelector(".theme-changer");
const themeIco = themeBtn?.querySelector("span");

const themeLabel = document.querySelector(".theme-text");
const searchForm = document.querySelector(".search-form");

const modeBtn = document.getElementById("modeBtn");
const modeMenu = document.getElementById("modeMenu");
const modeText = document.getElementById("modeText");
const modeIcon = modeBtn?.querySelector(".mode-icon");

// ================= Sidebar State (NEW FIX) =================
const savedSidebar = localStorage.getItem("sidebar-state");

// default: desktop open, mobile closed
const isMobile = window.innerWidth <= 768;

if (sb) {
    if (savedSidebar === "open") {
        sb.classList.remove("closed");
    } else if (savedSidebar === "closed") {
        sb.classList.add("closed");
    } else {
        // first time load
        if (isMobile) {
            sb.classList.add("closed");
        }
    }
}

// ================= Theme =================
const savedTheme = localStorage.getItem("theme");
const sysPrefersDark = window.matchMedia("(prefers-color-scheme:dark)").matches;

// helper
const updateThemeIco = () => {
    if (!themeIco) return;

    const isDark = document.body.classList.contains("dark-theme");
    themeIco.textContent = isDark ? "light_mode" : "dark_mode";
};

const applyMode = (mode) => {
    const isDark = mode === "dark";

    document.body.classList.toggle("dark-theme", isDark);

    if (modeText) modeText.textContent = isDark ? "Dark" : "Light";

    if (modeIcon) {
        modeIcon.textContent = isDark ? "dark_mode" : "light_mode";
    }

    updateThemeIco();
};

// init theme
applyMode(savedTheme || (sysPrefersDark ? "dark" : "light"));

// ================= Sidebar Toggle (FIXED) =================
const toggleSidebar = () => {
    if (!sb) return;

    sb.classList.toggle("closed");

    // save state
    localStorage.setItem(
        "sidebar-state",
        sb.classList.contains("closed") ? "closed" : "open"
    );
};

// desktop toggle buttons
sbToggleBtn.forEach(btn => {
    btn.addEventListener("click", toggleSidebar);
});

// mobile menu button
menuToggle?.addEventListener("click", toggleSidebar);

// ================= Close Sidebar when clicking outside (mobile) =================
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

// ================= Search =================
searchForm?.addEventListener("click", () => {
    if (sb?.classList.contains("closed")) {
        sb.classList.remove("closed");
        searchForm.querySelector("input")?.focus();

        localStorage.setItem("sidebar-state", "open");
    }
});

// ================= Theme Button =================
themeBtn?.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-theme");

    localStorage.setItem("theme", isDark ? "dark" : "light");

    applyMode(isDark ? "dark" : "light");
});

// ================= Mode Dropdown =================
if (modeBtn && modeMenu && modeText) {

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

// ================= Default Sidebar State =================
window.addEventListener("resize", () => {
    if (!sb) return;

    const isMobileNow = window.innerWidth <= 768;

    // optional smart behavior
    if (isMobileNow && !sb.classList.contains("closed")) {
        // keep as user choice (no forced reset)
    }
});

// ================= Channel Dot =================
async function fetchWithFallback(paths) {
    for (const path of paths) {
        try {
            const res = await fetch(path);
            if (res.ok) return await res.json();
        } catch (e) {}
    }
    throw new Error("All paths failed");
}

async function checkNewVideos() {
    try {
        const videos = await fetchWithFallback([
            "../data/json/channel-data.json",
            "../../data/json/channel-data.json"
        ]);

        const now = new Date();

        const hasNew = videos.some(video => {
            const videoDate = new Date(video.date);
            const diffDays = (now - videoDate) / (1000 * 60 * 60 * 24);
            return diffDays <= 6;
        });

        const dot = document.getElementById("channelDot");

        if (dot) {
            dot.style.display = hasNew ? "inline-block" : "none";
        }

    } catch (err) {
        console.error("Error checking new videos:", err);
    }
}

checkNewVideos();