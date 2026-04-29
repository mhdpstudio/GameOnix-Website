const container = document.getElementById("channel-page");

// ⏱️ تحويل الثواني -> وقت
function formatDuration(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    if (h > 0) {
        return `${h}:${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
    }
    return `${m}:${s < 10 ? "0" : ""}${s}`;
}

// 🕒 "منذ كام"
function timeAgo(dateString) {
    const now = new Date();
    const past = new Date(dateString);
    const diff = Math.floor((now - past) / 1000);

    const units = [
        { name: "Year", value: 31536000 },
        { name: "Month", value: 2592000 },
        { name: "Day", value: 86400 },
        { name: "Hour", value: 3600 },
        { name: "Minute", value: 60 },
        { name: "Second", value: 1 }
    ];

    for (let unit of units) {
        const amount = Math.floor(diff / unit.value);
        if (amount >= 1) {
            return `Just ${amount} ${unit.name}${amount > 1 ? "s" : ""} ago`;
        }
    }
    return "Just now";
}

// ✅ جلب stats من السيرفر
async function getVideoStats(slug) {
    try {
        const res = await fetch(`https://backend-videos-psi.vercel.app/api/stats?slug=${slug}`);
        return await res.json();
    } catch (err) {
        return { views: 0, likes: 0, dislikes: 0 };
    }
}

async function loadChannelVideos() {
    try {
        // Show small loading in stats
        const watchEl = document.getElementById('watch');
        const likesEl = document.getElementById('likes');
        const videosEl = document.getElementById('videos');
        [watchEl, likesEl, videosEl].forEach(el => {
            el.innerHTML = '<span class="small-stat-loader"></span>';
        });

        const res = await fetch("../../data/json/channel-data.json");
        const data = await res.json();

        // 🔥 ترتيب الفيديوهات من الجديد للأقدم
        data.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Render skeleton cards
        renderSkeletonCards(data.length);

        // 🔥 نجيب كل الـ stats مرة واحدة
        const statsPromises = data.map(video => getVideoStats(video.slug));
        const statsResults = await Promise.all(statsPromises);

        let totalViews = 0;
        let totalLikes = 0;

        // 🔥 رندر بعد ما كل الداتا توصل
        data.forEach((video, index) => {

            const stats = statsResults[index] || {};

            const views = stats.views || 0;
            const likes = stats.likes || 0;

            totalViews += views;
            totalLikes += likes;

            const videoCard = document.createElement("div");
            videoCard.className = "video-card";

            videoCard.innerHTML = `
                <div class="thumbnail">
                    <img src="${video.thumbnail}" alt="${video.title}">
                    <span class="video-time">${formatDuration(video.duration)}</span>
                </div>

                <div class="video-details">
                    <img class="channel-img" src="../../assets/videos/pics/logo/logo-vd.webp" alt="GameOnix">

                    <div class="video-meta">
                        <h3 class="video-title">${video.title}</h3>
                        <p class="channel-name">GameOnix</p>
                        <p class="video-info">
                            ${views} Views • ${timeAgo(video.date)}
                        </p>
                    </div>
                </div>
            `;

            videoCard.addEventListener("click", () => {
                window.location.href = `video.html?slug=${video.slug}`;
            });

            // Replace skeleton card
            const skeletonCard = container.children[index];
            if (skeletonCard) {
                container.replaceChild(videoCard, skeletonCard);
            } else {
                container.appendChild(videoCard);
            }
        });

        // ✅ إجمالي البروفايل
        watchEl.textContent = totalViews;
        likesEl.textContent = totalLikes;
        videosEl.textContent = data.length;

        watchEl.style.visibility = 'visible';
        likesEl.style.visibility = 'visible';
        videosEl.style.visibility = 'visible';

    } catch (error) {
        console.error(error);
        container.innerHTML = "<p>Failed to load videos</p>";
    }
}

function renderSkeletonCards(count) {
    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const skeletonCard = document.createElement("div");
        skeletonCard.className = "video-card skeleton-card";
        skeletonCard.innerHTML = `
            <div class="thumbnail skeleton-thumbnail">
                <div class="skeleton-image"></div>
                <span class="video-time skeleton-time">00:00</span>
            </div>
            <div class="video-details">
                <div class="channel-img skeleton-avatar"></div>
                <div class="video-meta">
                    <h3 class="video-title skeleton-line skeleton-title"></h3>
                    <p class="channel-name skeleton-line skeleton-subtitle"></p>
                    <p class="video-info skeleton-line skeleton-info"></p>
                </div>
            </div>
        `;
        container.appendChild(skeletonCard);
    }
}

loadChannelVideos().finally(() => {
    document.dispatchEvent(new CustomEvent('channel-videos-ready'));
});

// ===== SHARE SYSTEM =====

const sharePopup = document.getElementById("sharePopup");
const shareLink = document.getElementById("shareLink");
const copyBtn = document.getElementById("copyBtn");
const openShare = document.getElementById("openShare");
const closeShare = document.querySelector(".close-share");

// افتح
if (openShare) {
    openShare.addEventListener("click", () => {
        sharePopup.classList.add("active");
        shareLink.value = window.location.href;
    });
}

// قفل
if (closeShare) {
    closeShare.addEventListener("click", () => {
        sharePopup.classList.remove("active");
    });
}

// كليك برا
if (sharePopup) {
    sharePopup.addEventListener("click", (e) => {
        if (e.target === sharePopup) {
            sharePopup.classList.remove("active");
        }
    });
}

// copy
if (copyBtn) {
    copyBtn.addEventListener("click", () => {
        shareLink.select();
        document.execCommand("copy");

        copyBtn.textContent = "Copied!";
        setTimeout(() => {
            copyBtn.textContent = "Copy";
        }, 1500);
    });
}