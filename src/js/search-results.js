// 🔍 Search Results Page

const params = new URLSearchParams(window.location.search);
const query = params.get('q') || '';

// Update page title
document.title = `GameOnix | Search: ${query}`;

// Create search header
const searchContainer = document.getElementById('search-results');
searchContainer.insertAdjacentHTML('beforebegin', `
    <div class="search-header">
        <h2 class="hold-hover back-button"><i class="fa-solid fa-arrow-left"></i> Search Results for: <span class="search-query">"${query}"</span></h2>
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
        background: transparent;
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

// Fetch and search games
const pathsToTry = [
    '../../data/json/games.json',
    '/data/json/games.json',
    '../../../data/json/games.json'
];

let fetchSuccessful = false;

async function tryFetch() {
    // Prevent multiple processing
    if (fetchSuccessful) return;

    for (const path of pathsToTry) {
        try {
            console.log(`Trying to fetch from: ${path}`);
            const response = await fetch(path);
            if (response.ok) {
                console.log(`✓ Successfully fetched from: ${path}`);
                const data = await response.json();
                fetchSuccessful = true;
                processGames(data);
                return;
            }
        } catch (error) {
            console.warn(`✗ Failed to fetch from ${path}:`, error);
        }
    }

    // If no path worked, show error
    if (!fetchSuccessful) {
        console.error('Failed to fetch games.json from all paths');
        searchContainer.innerHTML = '<div class="no-results"><p>Error loading search results. Please navigate to the games page and try searching again.</p></div>';
    }
}

function processGames(data) {
    console.log('Games loaded successfully:', data);
    const allGames = [];

    // Flatten all games from all categories
    Object.values(data).forEach(category => {
        if (category.games && Array.isArray(category.games)) {
            allGames.push(...category.games);
        }
    });

    console.log('Total games found:', allGames.length);

    // Search for matching games
    const searchQuery = query.toLowerCase();
    const results = allGames.filter(game => {

        const title = (game.title || '').toLowerCase();
        const publisher = (game.publisher || '').toLowerCase();
        const slug = (game.slug || '').toLowerCase();

        // ❌ تجاهل كارد More Games
        if (slug === "more-games" || title === "more games") {
            return false;
        }

        return title.includes(searchQuery) ||
            publisher.includes(searchQuery) ||
            slug.includes(searchQuery);

    });

    // Remove duplicate games (same slug)
    const seen = new Set();
    const uniqueResults = results.filter(game => {
        if (seen.has(game.slug)) {
            return false;
        }
        seen.add(game.slug);
        return true;
    });

    console.log('Search results before dedup:', results.length);
    console.log('Search results after dedup:', uniqueResults.length);

    // Clear previous results
    searchContainer.innerHTML = '';

    // Display results
    if (uniqueResults.length === 0) {
        searchContainer.innerHTML = '<div class="no-results"><p>No games found matching your search.</p></div>';
        return;
    }

    // Function to check if image exists
    async function getValidImageUrl(posterPath) {
        if (!posterPath) return '../../assets/images/game.jpg';

        const fullUrl = `${posterPath}.jpg`;
        try {
            const response = await fetch(fullUrl, { method: 'HEAD' });
            if (response.ok) {
                console.log(`✓ Image found: ${fullUrl}`);
                return fullUrl;
            }
        } catch (error) {
            console.log(`✗ Image not found: ${fullUrl}`);
        }

        return '../../assets/images/game.jpg';
    }

    // Load all images with validation
    uniqueResults.forEach(async (game) => {
        const card = document.createElement('a');
        card.href = `game.html?game=${encodeURIComponent(game.slug)}`;
        card.className = 'result-card';

        // Get valid image URL
        const imageUrl = await getValidImageUrl(game.poster);
        console.log(`Game: ${game.title}, Using URL: ${imageUrl}`);

        card.innerHTML = `
            <div class="result-card-details">
                <img 
                    src="${imageUrl}" 
                    alt="${game.title}"
                >
                <p class="publisher">${game.publisher}</p>
                <h3 class="title">${game.title}</h3>
            </div>
        `;
        searchContainer.appendChild(card);
    });
}

// Start the fetch
tryFetch();
