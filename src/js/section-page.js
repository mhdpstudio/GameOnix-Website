const params = new URLSearchParams(window.location.search);
const sectionName = params.get("section");
const sectionLabel = document.getElementById("section-text");
const WebsiteName = "GameOnix";

// دالة العرض اللي اتفقنا عليها
function renderInitialGames(games, containerId) {
    const container = document.getElementById(containerId);
    if (!games || games.length === 0) {
        container.innerHTML = `<div class="no-results"><p>No games available in this section.</p></div>`;
        return;
    }

    container.innerHTML = "";
    games.forEach(game => {
        const gameCard = `
            <div class="game-card" data-slug="${game.slug}" style="cursor: pointer;">
                <div class="game-details">
                    <img src="${game.poster ? game.poster + ".jpg" : '../../assets/images/game.jpg'}" 
                         alt="${game.title}" 
                         loading="lazy" 
                         onerror="this.src='../../assets/images/game.jpg'">
                    <div class="publisher">${game.publisher || WebsiteName}</div>
                    <div class="title">${game.title}</div>
                </div>
            </div>
        `;
        container.innerHTML += gameCard;
    });

    document.querySelectorAll('.game-card').forEach(card => {
        card.addEventListener('click', () => {
            const slug = card.getAttribute('data-slug');
            if (slug) window.location.href = `game.html?game=${encodeURIComponent(slug)}`;
        });
    });
}

async function loadSectionGames() {
    try {
        const params = new URLSearchParams(window.location.search);
        const sectionName = params.get("section"); // مثل: Popular
        const platform = params.get("type");      // نرسل فيه PC أو PS

        const response = await fetch('../../data/json/games.json');
        const data = await response.json();

        let gamesData = null;
        let displayType = ""; // اللي هيتكتب في العنوان

        // المنطق: تحديد الـ Key الأساسي بناءً على النوع المبعوث في الرابط
        if (platform === "PS") {
            gamesData = data["Playstation Games"]?.[sectionName];
            displayType = "PS";
        } else if (platform === "PC") {
            gamesData = data["Desktop Games"]?.[sectionName];
            displayType = "PC";
        } else {
            // حل احتياطي في حال نسينا نبعت النوع (Fallback)
            if (data["Desktop Games"][sectionName]) {
                gamesData = data["Desktop Games"][sectionName];
                displayType = "PC";
            } else {
                gamesData = data["Playstation Games"][sectionName];
                displayType = "PS";
            }
        }

        if (!gamesData) {
            console.error("Section not found in JSON");
            return;
        }

        // التعديل المطلوب: تحديث التايتل حسب المنصة والقسم
        // النتيجة: GameOnix | Popular | PC
        document.title = `${WebsiteName} | ${sectionName} | ${displayType}`;

        // عرض الأيقونة والنص في الصفحة
        const sectionLabel = document.getElementById("section-text");
        if (sectionLabel) {
            const icon = gamesData.icon || "fa-gamepad";
            sectionLabel.innerHTML = `
    <div class="section-label" style="cursor: pointer;" onclick="window.history.back()">
        <i class="fa-solid fa-arrow-left"></i> 
        <i class="fa-solid ${icon}"></i> 
        ${sectionName} Games
    </div>
`;
        }

        // استخراج الألعاب وعرضها
        const gamesArray = gamesData.games || [];
        renderInitialGames(gamesArray, "section-games");

    } catch (error) {
        console.error('Error loading JSON:', error);
    }
}

loadSectionGames();