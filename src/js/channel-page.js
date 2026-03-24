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
            return `Just ${amount} ${unit.name}${amount > 1 ? "" : ""}`;
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
        const res = await fetch("../../data/json/channel-data.json");
        const data = await res.json();

        container.innerHTML = "";

        let totalViews = 0;
        let totalLikes = 0;

        for (const video of data) {

            const stats = await getVideoStats(video.slug);

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

            container.appendChild(videoCard);
        }

        // ✅ إجمالي البروفايل
        document.getElementById("watch").textContent = totalViews;
        document.getElementById("likes").textContent = totalLikes;
        document.getElementById("videos").textContent = data.length;

    } catch (error) {
        console.error(error);
        container.innerHTML = "<p>Failed to load videos</p>";
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