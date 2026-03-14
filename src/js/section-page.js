import { initGameSearch } from "../js/search-script.js";

const params = new URLSearchParams(window.location.search);
const sectionName = params.get("section");
const sectionLabel = document.getElementById("section-text");
const WebsiteName = "GameOnix";

fetch("https://www.gameonix.shop/data/json/games.json")
    .then(res => res.json())
    .then(data => {

        const section = data[sectionName];

        if (!section) {
            document.getElementById("section-games").innerHTML = "<p>Section not found</p>";
            document.title = WebsiteName;
            return;
        }

        // عنوان الصفحة
        document.title = `${WebsiteName} | ${sectionName}`;
        sectionLabel.innerHTML = `<span class="material-symbols-rounded">${section.icon}</span> ${sectionName} Games`;

        // عرض الألعاب وتشغيل البحث مباشرة
        initGameSearch({
            containerId: "section-games",
            searchInputId: "searchBox",
            games: section.games,
            websiteName: WebsiteName
        });

    })
    .catch(err => {
        console.error(err);
        document.getElementById("section-games").innerHTML = "<p>Error loading section</p>";
    });
