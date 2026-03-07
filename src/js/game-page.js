const WebsiteName = "GameOnix";
const params = new URLSearchParams(window.location.search);
const gameSlug = params.get("game");

const page = document.getElementById("game-page");

fetch("../../data/json/games-data.json")
    .then(res => res.json())
    .then(data => {

        const game = data.games.find(g => g.slug === gameSlug);

        if (!game) {
            page.innerHTML = "<h2>Game not found</h2>";
            return;
        }

        // 🎯 ضبط عنوان الصفحة في الـ head
        document.title = `${WebsiteName} | ${game.title}`;
        const theme = document.body.classList.contains("dark-theme") ? "c5c5c5" : "6e6e6e";

        // توليد الصور تلقائي
        let mediaImages = [];

        if (game.mediaPrefix && game.mediaCount) {
            for (let i = 1; i <= game.mediaCount; i++) {
                mediaImages.push(`../../assets/images/games/banners/${game.mediaPrefix}-${i}.png`);
            }
        } else {
            mediaImages = game.media || [];
        }

        // 🎯 بناء الصفحة
        page.innerHTML = `
    <div class="game-container">

        <div class="game-title">
            <div class="game-name" id="goBack"><i class="fa-solid fa-arrow-left"></i> ${game.title}</div>
            <div class="details">
                <div class="game-publisher"> ${game.publisher}</div>
                <div class="game-type"><i class="${game.gameTypeIcon}"></i> ${game.gameType}</div>
            </div>
        </div>

        <div class="game-layout">

            <div class="left-column">

                <div class="media-row">
                    <div class="media-stack">
                <div class="main-media">
                    <img id="mainMedia" src="${mediaImages[0]}">

                    <div class="media-overlay">
                        <div class="media-arrow left" id="mainLeft">
                            <i class="fa-solid fa-chevron-left"></i>
                        </div>

                        <div class="media-arrow right" id="mainRight">
                            <i class="fa-solid fa-chevron-right"></i>
                        </div>
                    </div>
                </div>

                <div class="thumb-wrapper">
                    <div class="arrow" id="leftArrow"><i class="fa-solid fa-chevron-left"></i></div>

                    <div class="thumb-slider">
                        <div class="thumb-slider-inner" id="thumbSlider">

${mediaImages.map((img, i) => `
    <div class="thumb ${i === 0 ? 'active' : ''}">
        <img src="${img}">
    </div>
`).join('')}
                        </div>
                    </div>

                    <div class="arrow" id="rightArrow"><i class="fa-solid fa-chevron-right"></i></div>
                </div>
                </div>
                <div class="side-panel">
                    <div class="game-logo-wrapper">
                        <img class="game-poster" src="${game.game_poster}" alt="${game.title}">
                    </div>
    
                    <div class="commands-btns">
                        <button class="btn download-btn" id="downloadBtn">
<i class="fa-solid fa-download"></i> Download
</button>
                        <button class="btn bug-btn"> <i class="fa-solid fa-bug"></i> </button>
                        </div>
                    <button class="btn share-btn"><i class="fa-solid fa-share"></i> Share</button>

                    <div class="epic-details-table">
                    <div class="detail-row">
                        <span class="detail-label"><i class="fa-solid fa-code-branch"></i> Version</span>
                        <span class="detail-value">${game.version}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label"><i class="fa-solid fa-database"></i> Size</span>
                        <span class="detail-value">${game.size}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label"><i class="fa-solid fa-display-code"></i> Developer</span>
                        <span class="detail-value">${game.publisher}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label"><i class="fa-solid fa-layer-group"></i> Platform</span>
                        <span class="detail-value"><i class="fa-brands fa-windows"></i></span>
                    </div>
                </div>
                </div>
                </div>
            </div>


        </div>
    </div>
    `;

        const downloadBtn = document.getElementById("downloadBtn");
        const popup2 = document.getElementById("downloadPopup");
        const countdownText = document.getElementById("countdown");
        const realDownload = document.getElementById("realDownload");

        // مهم جداً: تأكد إن الزرار موجود قبل ما تضيف الـ Click
        if (downloadBtn && popup2) {
            downloadBtn.addEventListener("click", () => {
                console.log("Download Clicked!"); // للتأكد في الـ Console
                popup2.style.display = "flex"; // أو popup2.classList.add("active") حسب الـ CSS بتاعك

                let time = 5;
                // تصفير العداد عشان لو فتح الـ popup كذا مرة
                countdownText.textContent = time;

                const downloadButtonElement = realDownload.querySelector("button");
                downloadButtonElement.disabled = true;
                downloadButtonElement.classList.remove("active");

                const timer = setInterval(() => {
                    time--;
                    countdownText.textContent = time;

                    if (time <= 0) {
                        clearInterval(timer);
                        downloadButtonElement.disabled = false;
                        downloadButtonElement.classList.add("active");
                        countdownText.textContent = "Ready!";
                    }
                }, 1000);
            });
        }

        const shareBtn = document.querySelector(".share-btn");
        const bugBtn = document.querySelector(".bug-btn");
        const popup = document.getElementById("sharePopup");
        const shareLink = document.getElementById("shareLink");
        const copyBtn = document.getElementById("copyBtn");
        const closeBtn = document.querySelector(".close-share");

        bugBtn.addEventListener("click", () => {

            const subject = encodeURIComponent(`Bug Report: ${game.title}`);
            const body = encodeURIComponent(
                `
Game: ${game.title}
Version: ${game.version}
Page: ${window.location.href}
_______________________________________________________________________________________________________

Describe the problem:
`
            );

            const gmailURL =
                `https://mail.google.com/mail/?view=cm&fs=1&to=gameonix.website@gmail.com&su=${subject}&body=${body}`;

            window.open(gmailURL, "_blank");
        });

        shareBtn.addEventListener("click", () => {
            shareLink.value = window.location.href;
            popup.classList.add("active");
        });

        closeBtn.addEventListener("click", () => {
            popup.classList.remove("active");
        });

        popup.addEventListener("click", e => {
            if (e.target === popup) popup.classList.remove("active");
        });

        copyBtn.addEventListener("click", () => {
            navigator.clipboard.writeText(shareLink.value);
            copyBtn.textContent = "Copied ✓";
            setTimeout(() => copyBtn.textContent = "Copy", 1500);
        });

        const mainLeft = document.getElementById("mainLeft");
        const mainRight = document.getElementById("mainRight");

        let currentIndex = 0;

        function updateThumbPosition() {
            const newPage = Math.floor(currentIndex / visibleThumbs);

            if (newPage !== pageIndex) {
                pageIndex = newPage;
                updateSlider();
            }
        }

        function updateMainImage(index) {
            currentIndex = index;
            mainMedia.src = mediaImages[currentIndex];

            thumbs.forEach(t => t.classList.remove("active"));
            thumbs[currentIndex].classList.add("active");

            updateThumbPosition();
        }

        mainRight.onclick = () => {
            currentIndex++;
            if (currentIndex >= mediaImages.length) {
                currentIndex = 0;
            }
            updateMainImage(currentIndex);
        };

        mainLeft.onclick = () => {
            currentIndex--;
            if (currentIndex < 0) {
                currentIndex = mediaImages.length - 1;
            }
            updateMainImage(currentIndex);
        };

        const goBack = document.getElementById("goBack");

        goBack.addEventListener("click", () => {
            window.history.back();
        });

        const slider = document.getElementById("thumbSlider");
        const thumbs = document.querySelectorAll(".thumb");

        const mainMedia = document.getElementById("mainMedia");

        thumbs.forEach(thumb => {
            thumb.addEventListener("click", () => {
                thumbs.forEach(t => t.classList.remove("active"));
                thumb.classList.add("active");
                mainMedia.src = thumb.querySelector("img").src;
            });
        });

        const visibleThumbs = 4;
        const thumbWidth = 130;

        let pageIndex = 0;
        const totalPages = Math.ceil(thumbs.length / visibleThumbs);

        function updateSlider() {
            slider.style.transform =
                `translateX(-${pageIndex * visibleThumbs * thumbWidth}px)`;
        }

        // ▶ السهم اليمين
        rightArrow.onclick = () => {
            if (pageIndex < totalPages - 1) {
                pageIndex++;
                updateSlider();
            }
        };

        // ◀ السهم الشمال
        leftArrow.onclick = () => {
            if (pageIndex > 0) {
                pageIndex--;
                updateSlider();
            }
        };


    })
    .catch(err => {
        console.error(err);
        page.innerHTML = "<h2>Error loading game data</h2>";
    });
