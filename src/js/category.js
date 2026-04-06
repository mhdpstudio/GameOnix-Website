const searchInput = document.getElementById("searchInput");

let allItems = [];
let filtered = [];
let searchValue = "";

// =========================
const params = new URLSearchParams(window.location.search);
const selectedType = params.get("type");

// =========================
async function load() {
    const res = await fetch("../../data/json/recharge.json");
    const data = await res.json();

    allItems = data.filter(item =>
        item.type.toLowerCase() === (selectedType || "").toLowerCase()
    );

    render();
}

// =========================
function render() {

    const list = searchValue
        ? allItems.filter(item =>
            item.name.toLowerCase().includes(searchValue.toLowerCase())
        )
        : allItems;

    document.getElementById("category-page").innerHTML = `
        <div class="apps-row">
            ${list.map(createItem).join("")}
        </div>
    `;
}

// =========================
function createItem(item) {
    return `
        <div class="app-item" data-id="${item.id}">
            <div class="app-icon">
                <img src="${item.image}" />
            </div>
            <div class="app-name">${item.name}</div>
        </div>
    `;
}

// =========================
searchInput.addEventListener("input", (e) => {
    searchValue = e.target.value.trim();
    render();
});

// =========================
document.addEventListener("click", (e) => {
    const card = e.target.closest(".app-item");
    if (!card) return;

    window.location.href = `game-recharge.html?game=${card.dataset.id}`;
});

// =========================
function format(str) {
    return (str || "")
        .split(" ")
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");
}

// =========================
load();