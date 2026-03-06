const container = document.getElementById("games-container");
const WebsiteName = "GameOnix";

// دالة لتحديث مكان section-controls وحجم padding للـ sections
function updateControlsPosition() {
    const sidebar = document.querySelector('.sb');
    const isOpen = !sidebar.classList.contains('closed'); // مفتوح؟
    const sidebarWidth = sidebar.offsetWidth;

    document.querySelectorAll('.section-controls').forEach(ctrl => {
        ctrl.style.right = isOpen ? (sidebarWidth + 40) + 'px' : "150px";
    });

    document.querySelectorAll('.section').forEach(sec => {
        sec.style.paddingRight = isOpen ? "170px" : "20px";
    });
}

// تحميل الألعاب
fetch('https://mhdpstudio.github.io/GameOnix-Website/data/json/games.json')
    .then(res => res.json())
    .then(data => {
        for (const sectionName in data) {
            const section = data[sectionName];
            const sectionDiv = document.createElement("div");
            sectionDiv.classList.add("section-container");

            // الألعاب قبل "More Games"
            const maxHomeIndex = section.games.findIndex(g => g.title === "More Games");
            const homeGames = maxHomeIndex !== -1 ? section.games.slice(0, maxHomeIndex) : section.games;

            sectionDiv.innerHTML = `
            <div class="section-wrapper">
                <div class="section-header">
                    <h2 class="sec-style">
                        <a class="sec-txt" data-section="${sectionName}">
                            ${section.icon ? `<i class="${section.icon}"></i>` : ''}
                            ${sectionName}
                            <i class="fa-solid fa-chevron-right ico"></i>
                        </a>
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
                                <img src="${game.poster + ".jpg" || '../../assets/images/game.jpg'}" alt="${game.title}">
                                <div class="publisher">${game.publisher || WebsiteName}</div>
                                <div class="title">${game.title}</div>
                            </div>
                        </div>
                    `).join('')}

                    ${maxHomeIndex !== -1 ? `
                        <div class="game-card more-games">
                            <div class="game-details">
                                <i class="fa-solid fa-arrow-right fa-3x" style="color: var(--color-text-primary);"></i>
                                <div class="title">More Games</div>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
            `;

            container.appendChild(sectionDiv);

            // رابط عنوان القسم
            sectionDiv.querySelector(".sec-txt").addEventListener("click", () => {
                const sectionNameEncoded = encodeURIComponent(sectionName);
                window.location.href = `html/section.html?section=${sectionNameEncoded}`;
            });

            // زر More Games
            sectionDiv.querySelectorAll(".more-games").forEach(btn => {
                btn.addEventListener("click", () => {
                    const sectionNameEncoded = encodeURIComponent(sectionName);
                    window.location.href = `html/section.html?section=${sectionNameEncoded}`;
                });
            });

            // فتح صفحة الألعاب العادية
            sectionDiv.querySelectorAll(".game-card").forEach(card => {
                if (!card.classList.contains("more-games")) {
                    card.addEventListener("click", () => {
                        const slug = card.dataset.slug;
                        window.location.href = `html/game.html?game=${encodeURIComponent(slug)}`;
                    });
                }
            });

            // كود التحريك يمين وشمال
            const slider = sectionDiv.querySelector(".section");
            const btnLeft = sectionDiv.querySelector(".scroll-btn.left");
            const btnRight = sectionDiv.querySelector(".scroll-btn.right");
            const controls = sectionDiv.querySelector(".section-controls");

            slider.addEventListener("wheel", (evt) => {
                if (evt.deltaY !== 0) {
                    evt.preventDefault();
                    // ضربنا في 1.5 لو عايز السكرول يكون أسرع شوية، أو سيبها زي ما هي
                    slider.scrollLeft += evt.deltaY;
                }
            }, { passive: false });

            const cardWidth = slider.querySelector(".game-card").offsetWidth;
            const gap = 15;
            const scrollAmount = cardWidth + gap;

            btnRight.addEventListener("click", () => slider.scrollLeft += scrollAmount);
            btnLeft.addEventListener("click", () => slider.scrollLeft -= scrollAmount);

            // إظهار أو إخفاء الأزرار حسب عدد الكروت
            function updateControlsVisibility() {
                controls.style.display = slider.scrollWidth > slider.clientWidth ? "flex" : "none";
            }

            updateControlsVisibility();
            window.addEventListener("resize", () => {
                updateControlsVisibility();
                updateControlsPosition();
            });
        }

        // تحديث مكان الأزرار وأماكن الـ sections أول مرة
        updateControlsPosition();

        // التعامل مع sidebar toggle
        document.querySelectorAll('.sb-toggle').forEach(btn => {
            btn.addEventListener('click', () => setTimeout(updateControlsPosition, 400));
        });

    })
    .catch(err => console.error(err));
