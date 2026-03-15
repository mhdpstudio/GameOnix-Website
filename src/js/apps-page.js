setupCategoryFilters();
setupSearchFunctionality();
loadApps();

async function loadApps() {
    const appsGrid = document.getElementById('apps-grid');
    if (!appsGrid) {
        console.error('apps-grid element not found!');
        return;
    }

    try {
        console.log('Loading apps...');
        // Show loading skeletons
        showLoadingSkeletons(appsGrid);

        // Fetch with no cache
        const response = await fetch("../../data/json/apps-list.json?" + Date.now(), { cache: "no-store" });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        console.log('Apps data loaded:', data.apps?.length || 0);

        // Hide loading skeletons
        appsGrid.innerHTML = '';

        // Generate app cards
        if (data.apps && data.apps.length > 0) {
            appsGrid.innerHTML = ''; // Clear skeletons
            data.apps.forEach(app => {
                const appCard = createAppCard(app);
                appsGrid.appendChild(appCard);
            });
            console.log('Cards generated:', data.apps.length);
        } else {
            showNoAppsMessage(appsGrid);
        }

    } catch (error) {
        console.error('Error loading apps:', error);
        appsGrid.innerHTML = '';
        const errorDiv = document.createElement('div');
        errorDiv.className = 'app-error';
        errorDiv.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <i class="fa-solid fa-exclamation-triangle" style="font-size: 48px; color: #e74c3c; margin-bottom: 20px;"></i>
                <h3 style="margin: 0 0 10px 0;">Failed to load apps</h3>
                <p style="margin: 0;">Please check your internet connection and try again.</p>
                <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Try Again
                </button>
            </div>
        `;
        appsGrid.appendChild(errorDiv);
    }
}

function createAppCard(app) {
    const card = document.createElement('div');
    card.className = `app-card ${app.ITEAM.toLowerCase().replace(/\s+/g, '-')}`;
    card.dataset.slug = app.slug;
    card.dataset.category = app.ITEAM.toLowerCase().replace(/\s+/g, '-');

    // Generate star rating HTML (using a default rating since it's not in the JSON)
    const starsHTML = generateStars(4.5); // Default rating

    card.innerHTML = `
        <div class="app-icon-container">
            <div class="app-icon">
                <img class="app-icon-img" src="${app.previewImage}">
            </div>
        </div>
        
        <div class="app-info">
            <h3 class="app-title">${app.title}</h3>
            <span class="app-category"><i class="fa-solid fa-${app.categoryIcon}"></i> ${app.category}</span>
            
            
            <p class="app-description">${app.description}</p>
            
            <div class="app-meta">
                <span class="bt"><i class="fa-solid fa-code-branch"></i> ${app.version}</span>
                <span class="bt"><i class="fa-solid fa-database"></i> ${app.size}</span>
            </div>
            
            <div class="app-actions">
                <a style="text-decoration: none;" href="${app.appLink}" target="_blank" class="app-download-btn btn5">
                    <i class="fa-solid fa-download"></i>
                    Download
                </a>
                <button class="app-more-info btn4" onclick="openAppDetails('${app.slug}')">
                    <i class="fa-solid fa-info"></i>
                    More Info
                </button>
            </div>
        </div>
    `;

    // Make the entire card clickable to open app details
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
        // Don't trigger if clicking on buttons
        if (e.target.closest('.app-actions') || e.target.closest('.app-download-btn')) {
            return;
        }
        openAppDetails(app.slug);
    });

    return card;
}

// Function to open app details page
function openAppDetails(slug) {
    // Navigate to app page with slug parameter
    window.location.href = `app-page.html?slug=${slug}`;
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let starsHTML = '';

    // Full stars
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fa-solid fa-star"></i>';
    }

    // Half star if needed
    if (hasHalfStar) {
        starsHTML += '<i class="fa-solid fa-star-half-stroke"></i>';
    }

    // Empty stars to complete 5
    const totalStars = 5;
    const emptyStars = totalStars - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="fa-regular fa-star"></i>';
    }

    return starsHTML;
}

function showLoadingSkeletons(container) {
    container.innerHTML = '';

    // Create 6 skeleton cards
    for (let i = 0; i < 6; i++) {
        const skeleton = document.createElement('div');
        skeleton.className = 'app-card skeleton';
        skeleton.innerHTML = `
            <div class="app-icon-container">
                <div class="app-icon" style="background: linear-gradient(135deg, #f0f0f0, #e0e0e0);">
                    <span class="material-symbols-rounded">apps</span>
                </div>
            </div>
            <div class="app-info">
                <div class="app-title skeleton-line" style="height: 24px; background: linear-gradient(90deg, #f0f0f0, #e0e0e0, #f0f0f0); background-size: 200% 100%; animation: shimmer 1.5s infinite;"></div>
                <div class="app-category skeleton-line" style="height: 20px; width: 80px; background: linear-gradient(90deg, #f0f0f0, #e0e0e0, #f0f0f0); background-size: 200% 100%; animation: shimmer 1.5s infinite; margin-bottom: 15px;"></div>
                
                <div class="app-rating skeleton-line" style="height: 16px; width: 60%; background: linear-gradient(90deg, #f0f0f0, #e0e0e0, #f0f0f0); background-size: 200% 100%; animation: shimmer 1.5s infinite; margin-bottom: 15px;"></div>
                
                <div class="app-description skeleton-line" style="height: 60px; background: linear-gradient(90deg, #f0f0f0, #e0e0e0, #f0f0f0); background-size: 200% 100%; animation: shimmer 1.5s infinite; margin-bottom: 20px;"></div>
                
                <div class="app-meta" style="margin-bottom: 15px;">
                    <div class="skeleton-line" style="height: 14px; width: 60px; background: linear-gradient(90deg, #f0f0f0, #e0e0e0, #f0f0f0); background-size: 200% 100%; animation: shimmer 1.5s infinite;"></div>
                    <div class="skeleton-line" style="height: 14px; width: 50px; background: linear-gradient(90deg, #f0f0f0, #e0e0e0, #f0f0f0); background-size: 200% 100%; animation: shimmer 1.5s infinite;"></div>
                </div>
                
                <div class="app-actions">
                    <button class="app-download-btn" style="background: linear-gradient(90deg, #f0f0f0, #e0e0e0, #f0f0f0); background-size: 200% 100%; animation: shimmer 1.5s infinite; color: transparent; border: none; cursor: default;">
                        Loading...
                    </button>
                    <button class="app-more-info" style="background: linear-gradient(90deg, #f0f0f0, #e0e0e0, #f0f0f0); background-size: 200% 100%; animation: shimmer 1.5s infinite; color: transparent; border: none; cursor: default;">
                        Info
                    </button>
                </div>
            </div>
        `;
        container.appendChild(skeleton);
    }
}

function showNoAppsMessage(container) {
    container.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #666; grid-column: 1 / -1;">
            <i class="fa-solid fa-box-open" style="font-size: 48px; color: #bdc3c7; margin-bottom: 20px;"></i>
            <h3 style="margin: 0 0 10px 0;">No apps available</h3>
            <p style="margin: 0;">We're working on adding more applications. Please check back soon!</p>
        </div>
    `;
}

// Category filter functionality
function setupCategoryFilters() {
    const categories = ['all', 'games-store', 'emulator'];

    const filtersContainer = document.getElementById('app-filters');
    if (!filtersContainer) {
        console.error('app-filters container not found!');
        return;
    }

    // Clear existing buttons
    filtersContainer.innerHTML = '';

    categories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'app-filter-btn';
        button.dataset.category = category;
        button.textContent = category.charAt(0).toUpperCase() + category.slice(1);

        // Make All the default active category
        if (category === 'all') button.classList.add('active55');

        button.addEventListener('click', () => {
            document.querySelectorAll('.app-filter-btn').forEach(btn => btn.classList.remove('active55'));
            button.classList.add('active55');
            filterAppsByCategory(category);
        });

        filtersContainer.appendChild(button);
    });
}
function filterAppsByCategory(category) {
    const appsGrid = document.getElementById('apps-grid');
    const appCards = appsGrid.querySelectorAll('.app-card');
    const searchTerm = document.getElementById('app-search').value.toLowerCase().trim();

    appCards.forEach(card => {
        const cardCategory = card.dataset.category;
        const cardTitle = card.querySelector('.app-title').textContent.toLowerCase();
        const cardDescription = card.querySelector('.app-description').textContent.toLowerCase();
        const cardCategoryText = card.querySelector('.app-category').textContent.toLowerCase();

        // Check category filter
        const categoryMatch = category === 'all' || cardCategory.includes(category);

        // Check search filter (title only)
        const searchMatch = searchTerm === '' || 
            cardTitle.includes(searchTerm);

        // Show card only if both filters match
        if (categoryMatch && searchMatch) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Search functionality
function setupSearchFunctionality() {
    const searchInput = document.getElementById('app-search');
    const searchClear = document.getElementById('search-clear');

    if (!searchInput) {
        console.error('Search input not found!');
        return;
    }

    // Search input event listener
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        // Get current active category
        const activeCategoryBtn = document.querySelector('.app-filter-btn.active55');
        const currentCategory = activeCategoryBtn ? activeCategoryBtn.dataset.category : 'all';
        
        // Apply filters
        filterAppsByCategory(currentCategory);
        
        // Show/hide clear button
        if (searchTerm) {
            searchClear.style.display = 'block';
        } else {
            searchClear.style.display = 'none';
        }
    });

    // Clear search functionality
    if (searchClear) {
        searchClear.addEventListener('click', () => {
            searchInput.value = '';
            searchClear.style.display = 'none';
            
            // Get current active category and re-apply filter
            const activeCategoryBtn = document.querySelector('.app-filter-btn.active55');
            const currentCategory = activeCategoryBtn ? activeCategoryBtn.dataset.category : 'all';
            filterAppsByCategory(currentCategory);
            
            // Focus back on search input
            searchInput.focus();
        });
    }

    // Clear button hover effect
    if (searchClear) {
        searchClear.addEventListener('mouseenter', () => {
            searchClear.style.background = 'var(--color-bg-secondary)';
            searchClear.style.color = 'var(--color-text-primary)';
        });
        
        searchClear.addEventListener('mouseleave', () => {
            searchClear.style.background = 'none';
            searchClear.style.color = 'var(--color-text-secondary)';
        });
    }
}


// Add shimmer animation for loading skeletons
style.textContent = `
    @keyframes shimmer {
        0% {
            background-position: -200% 0;
        }
        100% {
            background-position: 200% 0;
        }
    }
    
    .skeleton-line {
        border-radius: 4px;
        margin-bottom: 10px;
    }
    
    .app-card.skeleton {
        animation: pulse 1.5s ease-in-out infinite;
    }
    
    @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.6; }
        100% { opacity: 1; }
    }
`;
document.head.appendChild(style);