// 🔍 Search Results Page

const params = new URLSearchParams(window.location.search);
const query = params.get('q') || '';

// Update page title
document.title = `GameOnix | Search: ${query}`;

// Create search header
const searchContainer = document.getElementById('search-results');
searchContainer.insertAdjacentHTML('beforebegin', `
    <div class="search-header">
        <h2 class="hold-hover back-button" style="display: flex; align-items: center; justify-content: center; gap: 10px;"><span style="font-size: 35px;" class="material-symbols-rounded">arrow_left_alt</span> Search Results for: <span class="search-query">"${query}"</span></h2>
    </div>
`);

// Add click event to go back to previous page
const backButton = document.querySelector('.back-button');
if (backButton) {
    backButton.style.cursor = 'pointer';
    backButton.addEventListener('click', () => {
        window.history.back();
    });
}

// Add CSS for search header if needed
const style = document.createElement('style');
style.textContent = `
    .search-header {
        padding: 20px 0;
        margin-bottom: 20px;
        border-bottom: 2px solid var(--color-hover-primary);
        margin-right: 20px;
    }
    .search-header h2 {
        font-size: 24px;
        margin: 0;
        color: var(--color-text-primary);
    }
    .search-query {
        color: var(--color-hover-primary);
    }
    .grid {
        display: flex;
        gap: 15px;
        flex-wrap: wrap;
        padding: 20px 0;
    }
    .result-card {
        background-color: transparent;
        border-radius: 10px;
        width: 180px;
        min-height: 240px;
        color: white;
        font-family: Arial, sans-serif;
        text-decoration: none;
        transition: all 0.3s ease;
        flex: 0 0 auto;
    }
    .result-card-details {
        background-color: var(--card-clr);
        border-radius: 8px 8px 8px 8px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    .result-card:not(.more-games) .result-card-details:hover {
        filter: drop-shadow(0 0 6px var(--color-text-primary));
        transform: translateY(-5px);
    }
    .result-card img {
        width: 100%;
        height: 240px;
        object-fit: cover;
        border-radius: 8px 8px 0 0;
        transition: filter 0.3s ease;
        background: var(--card-clr);
        background-image: linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.05) 50%, transparent 70%);
    }
    .result-card img.loading-img {
        filter: blur(2px);
        opacity: 0.7;
    }
    .result-card img.error-img {
        filter: grayscale(0.3) brightness(1.1);
    }
    .result-card .title {
        font-weight: bold;
        padding: 5px 10px 0 10px;
        color: var(--color-text-primary);
        transition: text-shadow 0.3s ease;
        padding-bottom: 10px;
        margin: 0;
        font-size: 16px;
    }
    .result-card-details:hover .title {
        text-shadow: 0 0 10px;
    }
    .result-card .publisher {
        font-size: 12px;
        color: var(--clr-txt-dev);
        padding: 0 10px 5px 10px;
        margin: 0;
    }
    .result-card:not(.result-card) .result-card-details {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 4px;
        height: auto;
        padding: 0;
        background: none;
        margin: 0;
    }
    .no-results {
        text-align: center;
        padding: 40px 20px;
        color: var(--color-text-secondary);
    }
`;
document.head.appendChild(style);

// 🔍 Search functionality for results page
// Note: Not using DOMContentLoaded because scripts are loaded dynamically
// and may execute after DOMContentLoaded has already fired
const searchBox = document.getElementById('searchBox');
if (searchBox) {
    searchBox.value = query; // Pre-fill with current query
    searchBox.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const newQuery = searchBox.value.trim();
            if (newQuery) {
                window.location.href = `search-results.html?q=${encodeURIComponent(newQuery)}`;
            }
        }
    });
}

// Fetch local games.json (more reliable)
async function loadGames() {
    try {
        console.log('Fetching local data/json/games.json');
        const response = await fetch('../../data/json/games.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        console.log('✓ Local games loaded:', Object.keys(data).length, 'categories');
        processGames(data);
    } catch (error) {
        console.error('Failed to load local games.json:', error);
        searchContainer.innerHTML = '<div class="no-results"><p>Error loading games data. <a href="../games.html">Go to Games page</a></p></div>';
    }
}

function processGames(data) {
    console.log('Games loaded successfully:', data);
    const allGames = [];

    // Recursively flatten all games from nested categories/subcategories
    function collectGames(obj) {
        if (obj.games && Array.isArray(obj.games)) {
            allGames.push(...obj.games);
        }
        // Recurse into subcategories
        Object.values(obj).forEach(subObj => {
            if (typeof subObj === 'object' && subObj !== null) {
                collectGames(subObj);
            }
        });
    }

    Object.values(data).forEach(topLevel => {
        collectGames(topLevel);
    });

    console.log('Total games found:', allGames.length);

    // Search for matching games
    const searchQuery = query.toLowerCase();
    const results = allGames.filter(game => {
        const title = (game.title || '').toLowerCase();
        const publisher = (game.publisher || '').toLowerCase();
        const slug = (game.slug || '').toLowerCase();

        // Skip "More Games" cards
        if (slug === "more-games" || title.toLowerCase().includes("more games")) {
            return false;
        }

        return title.includes(searchQuery) ||
               publisher.includes(searchQuery) ||
               slug.includes(searchQuery);
    });

    // Remove duplicates by slug
    const seen = new Set();
    const uniqueResults = results.filter(game => {
        if (seen.has(game.slug)) return false;
        seen.add(game.slug);
        return true;
    });

    console.log(`Search "${query}": ${uniqueResults.length} unique results`);

    // Clear container
    searchContainer.innerHTML = '';

    if (uniqueResults.length === 0) {
        searchContainer.innerHTML = `<div class="no-results"><p>No games found matching "<strong>${query}</strong>". Try different keywords.</p></div>`;
        return;
    }

    // Create all cards with loading state first
    uniqueResults.forEach(game => {
        const card = document.createElement('a');
        card.href = `game.html?game=${encodeURIComponent(game.slug)}`;
        card.className = 'result-card';
        card.innerHTML = `
            <div class="result-card-details">
                <img 
                    src="assets/images/game.jpg" 
                    data-poster="${game.poster || ''}"
                    alt="${game.title}"
                    class="loading-img"
                    loading="lazy"
                >
                <p class="publisher">${game.publisher || 'Unknown'}</p>
                <h3 class="title">${game.title}</h3>
            </div>
        `;
        searchContainer.appendChild(card);
    });

    // Then set actual poster srcs with error fallback
    const imgs = searchContainer.querySelectorAll('img[data-poster]');
    imgs.forEach((img, i) => {
        const posterBase = img.dataset.poster;
        if (posterBase) {
            // Try remote first (matching JSON format)
            const remoteUrl = `${posterBase}.jpg`;
            img.src = remoteUrl;
            img.onerror = () => {
                console.log(`Image failed: ${remoteUrl}, trying local`);
                // Fallback to local poster if exists
                const localPoster = `assets/images/games/posters/${posterBase.split('/').pop()}.jpg`;
                img.src = localPoster;
                img.onerror = () => {
                    console.log(`Local also failed, using placeholder`);
                    img.src = 'assets/images/game.jpg';
                    img.classList.add('error-img');
                };
            };
            img.onload = () => {
                console.log(`✓ Image loaded: ${img.src}`);
                img.classList.remove('loading-img');
            };
        } else {
            img.src = 'assets/images/game.jpg';
        }
    });
}

// Start loading local data
loadGames();
