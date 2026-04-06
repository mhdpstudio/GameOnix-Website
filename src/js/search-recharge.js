const container = document.getElementById("category-page");

let data = [];
let filteredData = [];

function getSearchQuery() {
    const params = new URLSearchParams(window.location.search);
    return params.get('q') || "";
}

function normalize(str) {
    return (str || "").toLowerCase().trim();
}

async function loadSearch() {
    try {
        const res = await fetch("../../data/json/recharge.json");
        data = await res.json();
        
        const query = getSearchQuery();
        const searchInput = document.getElementById("searchInput");
        
        if (searchInput) searchInput.value = query;

        performSearch(query);
    } catch (error) {
        console.error("Error loading search data:", error);
    }
}

function performSearch(query) {
    const normalizedQuery = normalize(query);
    filteredData = data.filter(item => 
        normalize(item.name).includes(normalizedQuery) || 
        normalize(item.type).includes(normalizedQuery)
    );
    renderResults(query);
}

function renderResults(query) {
    if (filteredData.length === 0) {
        container.innerHTML = `
            <h2 style="padding: 20px; color: white; cursor: pointer;" class="back-btn">
                <i class="fa-solid fa-arrow-left"></i> No results found for "${query}"
            </h2>`;
        return;
    }

    container.innerHTML = `
        <h2 class="main-section-title">
            <i class="fa-solid fa-arrow-left"></i>        
            <i class="fa-solid fa-magnifying-glass"></i> 
            Search Results for: ${query}
        </h2>
        <div class="search-results" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 20px; padding: 20px;">
            ${filteredData.map(item => `
                <div class="app-item" data-id="${item.id}" style="cursor:pointer;">
                    <div class="app-icon">
                        <img src="${item.image}" alt="${item.name}" style="width:100%; border-radius:15px;" />
                    </div>
                    <div class="app-name" style="text-align:center; margin-top:10px; color:white;">${item.name}</div>
                </div>
            `).join("")}
        </div>
    `;
}

// 🔥 التعديل هنا: دالة الرجوع الذكية
container.addEventListener("click", (e) => {
    const backTrigger = e.target.closest("h2");
    if (!backTrigger) return;

    // فكرة الحل: نستخدم sessionStorage لتخزين الصفحة التي أتينا منها أول مرة
    const originPage = sessionStorage.getItem('search_origin');

    if (originPage && !originPage.includes('search-recharge.html')) {
        window.location.href = originPage; // العودة للأصل فوراً
    } else {
        // لو لم نجد أصل، نعود للمتصفح العادي أو صفحة شحن افتراضية
        window.location.href = 'recharge.html'; 
    }
});

// حفظ أول صفحة دخل منها المستخدم قبل الدخول في دوامة البحث
if (!document.referrer.includes('search-recharge.html')) {
    sessionStorage.setItem('search_origin', document.referrer || 'recharge.html');
}

// تشغيل الضغط على العناصر
container.addEventListener("click", (e) => {
    const app = e.target.closest(".app-item");
    if (!app) return;
    const id = app.dataset.id;
    window.location.href = `game-recharge.html?game=${id}`;
});

// تفعيل البحث مرة أخرى
document.addEventListener("keydown", (e) => {
    if (e.target.id === "searchInput" && e.key === "Enter") {
        const newQuery = e.target.value;
        if(newQuery.trim() !== "") {
            // نستخدم replace لكي لا نملأ الـ History بصفحات بحث مكررة
            window.location.replace(`search-recharge.html?q=${encodeURIComponent(newQuery.trim())}`);
        }
    }
});

loadSearch();