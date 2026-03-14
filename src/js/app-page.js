// App Page JavaScript - Based on game-page.js structure
const WebsiteName = "GameOnix";
const params = new URLSearchParams(window.location.search);
const appSlug = params.get("app");

const page = document.getElementById("app-page");

fetch("./../../data/json/apps-data.json")
    .then(res => res.json())
    .then(data => {

        const app = data.apps.find(a => a.slug === appSlug);

        if (!app) {
            page.innerHTML = "<h2>App not found</h2>";
            return;
        }

        // 🎯 ضبط عنوان الصفحة في الـ head
        document.title = `${WebsiteName} | ${app.title}`;
        const theme = document.body.classList.contains("dark-theme") ? "c5c5c5" : "6e6e6e";

        // 🎯 بناء الصفحة
        page.innerHTML = `
    <div class="game-container">
        <div class="game-title">
            <div class="game-name" id="goBack"><span style="font-size: 40px;" class="material-symbols-rounded">arrow_left_alt</span> ${app.title}</div>
            <div class="details">
                <div class="game-publisher pl"> ${app.publisher}</div>
                <div class="game-type pl"><span class="material-symbols-rounded">${app.appTypeIcon}</span> ${app.appType}</div>
            </div>
        </div>

        <div class="game-layout">
            <div class="left-column">
                <div class="media-row">
                    <div class="media-stack">
                        <div class="main-media">
                            <img id="mainMedia" src="${app.media[0]}">

                            <div class="media-overlay">
                                <div class="media-arrow left" id="mainLeft">
                                    <span class="material-symbols-rounded">arrow_back_ios_new</span>
                                </div>

                                <div class="media-arrow right" id="mainRight">
                                    <span class="material-symbols-rounded">arrow_forward_ios</span>
                                </div>
                            </div>
                        </div>

                        <div class="thumb-wrapper">
                            <div class="arrow" id="leftArrow"><span class="material-symbols-rounded">arrow_back_ios_new</span></div>

                            <div class="thumb-slider">
                                <div class="thumb-slider-inner" id="thumbSlider">
                                    ${app.media.map((img, i) => `
                                        <div class="thumb ${i === 0 ? 'active' : ''}">
                                            <img src="${img}">
                                        </div>
                                    `).join('')}
                                </div>
                            </div>

                            <div class="arrow" id="rightArrow"><span class="material-symbols-rounded">arrow_forward_ios</span></div>
                        </div>
                        <div class="game-ads">
                        </div>
                    </div>
                    
                    <div class="side-panel">
                        <div class="game-logo-wrapper">
                            <img class="game-poster" src="${app.app_poster}" alt="${app.title}">
                        </div>

                        <div class="commands-btns">
                            <a href="${app.appLink}" class="fa-download-good-for-now" target="_blank" rel="noopener noreferrer">
                                <button class="btn download-btn"><span class="material-symbols-rounded">download</span> Download</button>
                            </a>
                            <button class="btn bug-btn"> <span class="material-symbols-rounded">bug_report</span> </button>
                        </div>
                        
                        <button class="btn share-btn"><span class="material-symbols-rounded">share</span> Share</button>

                        <div class="epic-details-table">
                            <div class="detail-row">
                                <span class="detail-label"><span class="material-symbols-rounded">commit</span> Version</span>
                                <span class="detail-value"> ${app.version}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label"><span class="material-symbols-rounded">data_usage</span> Size</span>
                                <span class="detail-value">${app.size}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label"><span class="material-symbols-rounded">code_xml</span> Developer</span>
                                <span class="detail-value">${app.publisher}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label"><span class="material-symbols-rounded">layers</span> Platform</span>
                                <span class="detail-value"><span class="material-symbols-rounded">desktop_windows</span></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;

        const shareBtn = document.querySelector(".share-btn");
        const bugBtn = document.querySelector(".bug-btn");
        const popup = document.getElementById("sharePopup");
        const shareLink = document.getElementById("shareLink");
        const copyBtn = document.getElementById("copyBtn");
        const closeBtn = document.querySelector(".close-share");

        bugBtn.addEventListener("click", () => {
            const subject = encodeURIComponent(`Bug Report: ${app.title}`);
            const body = encodeURIComponent(`
App: ${app.title}
Version: ${app.version}
Page: ${window.location.href}
_______________________________________________________________________________________________________
Describe the problem:
`);

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
            mainMedia.src = app.media[currentIndex];

            thumbs.forEach(t => t.classList.remove("active"));
            thumbs[currentIndex].classList.add("active");

            updateThumbPosition();
        }

        mainRight.onclick = () => {
            currentIndex++;
            if (currentIndex >= app.media.length) {
                currentIndex = 0;
            }
            updateMainImage(currentIndex);
        };

        mainLeft.onclick = () => {
            currentIndex--;
            if (currentIndex < 0) {
                currentIndex = app.media.length - 1;
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
        page.innerHTML = "<h2>Error loading app data</h2>";
    });
